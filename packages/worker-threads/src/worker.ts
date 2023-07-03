import { parentPort } from 'worker_threads';
import createDebug from 'debug';
import { dynamicExports } from './export-bridge.js';
import { TransferableValue } from './transferable.js';
import { type FunctionId, type ThreadMethodKey } from './types/general.js';
import {
  type BaseMainMessage,
  type CallMessage,
  type InitMessage,
  MainMessageAction,
  type ThreadCallbackMessage,
  type ThreadErrorMessage,
  type ThreadFreeFunctionMessage,
  type ThreadFunctionMessage,
  ThreadMessageAction,
} from './types/messages.js';
import majorNodeVersion from './utils/major-node-version.js';

if (!parentPort) {
  throw new Error('No parentPort available');
}

// parentPort.on('message',....);
// Listen `message` sent from `main` thread once.
// eslint-disable-next-line sonarjs/cognitive-complexity
parentPort.once('message', async (msg: InitMessage) => {
  if (msg.action !== 'init') {
    return;
  }

  const { workerPath, port, id, parentId } = msg;

  let debug = createDebug(`armit-worker:thread:${id}`);
  if (parentId) {
    debug = createDebug(`armit-worker:parent:${parentId}:thread:${id}`);
  }

  debug('Initializing worker thread...');
  let worker: Record<string, Function | any>;

  dynamicExports.threadId = id;
  dynamicExports.debug = debug;

  try {
    let isCommonJS = false;

    worker = await import(workerPath);

    if (!worker) {
      throw new Error('Worker does not expose a mountable object');
    }

    const workerKeys = Object.keys(worker);
    isCommonJS = workerKeys.includes('default');

    if (isCommonJS) {
      worker = worker.default;
      if (!(worker instanceof Object)) {
        throw new Error(`Worker should export an object, got ${worker}`);
      }
    }
  } catch (err) {
    const { message, stack } = err as Error;
    port.postMessage({
      action: ThreadMessageAction.STARTUP_ERROR,
      message,
      stack,
    });
    return;
  }

  const functionRegistry = new FinalizationRegistry(
    ({ id, key }: { id: FunctionId; key: ThreadMethodKey }) => {
      debug('thread freeing method %s for %s', id, key);

      const fnMsg: ThreadFreeFunctionMessage = {
        action: ThreadMessageAction.FREE_FUNCTION,
        functionId: id,
        key,
      };

      port.postMessage(fnMsg);
    }
  );

  // TODO: Handle message error.
  // Rare and possibly fatal as promises may never be resolved.
  // Note: This happens when trying to receive an array buffer that has already been detached.
  port.on('messageerror', (_err: Error) => {
    // Consider pool termination and reject all open promises
  });

  port.on('message', async (msg: BaseMainMessage) => {
    if (msg.action !== MainMessageAction.CALL) {
      throw new Error(`Unknown action "${msg.action}" for worker thread`);
    }

    const { key, args, callableId, argFunctionPositions } = msg as CallMessage;
    debug('calling worker thread method %s', key);

    try {
      if (typeof worker[key] !== 'function') {
        debug('%s is not a function', key);
        throw new Error(`"${key}" is not a function in this worker thread`);
      }

      if (argFunctionPositions.length > 0) {
        for (const fnArgPos of argFunctionPositions) {
          const { id } = args[fnArgPos];
          const fn = (...cbArgs: any[]) => {
            // TODO: Make transferables work here
            const fnMsg: ThreadFunctionMessage = {
              action: ThreadMessageAction.CALL_FUNCTION,
              functionId: id,
              key,
              args: cbArgs,
              pos: fnArgPos,
            };
            port.postMessage(fnMsg);
          };
          functionRegistry.register(fn, { id, key }, fn);
          args[fnArgPos] = fn;
        }
      }

      let result = await worker[key](...args);

      debug('worker done with thread method %s', key);

      if (result === worker) {
        result = '__THIS__';
      }

      if (result instanceof TransferableValue) {
        const resultMsg: ThreadCallbackMessage = {
          action: ThreadMessageAction.RESOLVE,
          callableId,
          result: result.obj,
        };

        port.postMessage(resultMsg, result.transferables);
      } else {
        const resultMsg: ThreadCallbackMessage = {
          action: ThreadMessageAction.RESOLVE,
          callableId,
          result,
        };
        port.postMessage(resultMsg);
      }
    } catch (err) {
      const { message, stack } = err as Error;
      debug(message);
      const resultMsg: ThreadErrorMessage = {
        action: ThreadMessageAction.REJECT,
        callableId,
        message: message as string,
        stack: stack as string,
      };
      port.postMessage(resultMsg);
    }
  });

  // Note: Node < 16 does not exit and throw unhandled promise rejections
  if (majorNodeVersion < 16) {
    process.on('unhandledRejection', (reason) => {
      throw reason;
    });
  }

  port.postMessage({ action: 'ready' });
});
