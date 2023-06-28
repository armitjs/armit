import debug from 'debug';
import { createThreadPool } from '../index.js';
import {
  isThreadFreeFunctionMessage,
  ThreadMessageAction,
} from '../types/messages.js';
import { type WorkerThread } from '../worker-thread.js';
import { type WorkerWithCallback } from './workers/callback.js';

debug.enabled('armit-worker');

describe('Garbage Collections', () => {
  // Note: This might be flaky, as the garbage collection and the finalizer cannot be triggered reliably
  it('cleans up main thread function when garbage collected on thread', async () => {
    const worker = await createThreadPool<WorkerWithCallback>(
      './__tests__/workers/callback'
    );
    // Need to create a lot of callbacks to trigger the garbage collection
    const callTimes = 50000;
    const msgHandler = vi.fn();

    worker.pool.on('thread:message', (msg) => {
      if (isThreadFreeFunctionMessage(msg)) {
        msgHandler(msg);
      }
    });

    const callback = vi.fn();
    for (let i = 0; i < callTimes; i++) {
      if (i % 1000 === 0) {
        // Give garbage collection some time to kick in
        await new Promise<void>((resolve) => setTimeout(() => resolve(), 250));
      }
      await worker.withCallback(1, 2, callback);
    }

    await new Promise<void>((resolve) => setTimeout(() => resolve(), 5000));
    worker.pool.terminate();

    expect(callback.mock.calls.length).toBeGreaterThan(10000);
    expect(callback).toHaveBeenCalledWith(3);
    expect(msgHandler).toHaveBeenCalledWith({
      action: ThreadMessageAction.FREE_FUNCTION,
      functionId: expect.any(Number),
      key: expect.any(String),
    });

    const thread: WorkerThread = worker.pool.threads.values().next().value;
    const numberOfStoredMethods =
      thread.callableStore.callbacks.get('withCallback')?.size;
    expect(numberOfStoredMethods).toBeLessThan(callTimes / 2);
  }, 30000);
});
