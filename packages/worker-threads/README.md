# @armit/worker-threads

## Turn any module into a worker thread

[![Master Push](https://github.com/PortBlueSky/thread-puddle/actions/workflows/master-push.yml/badge.svg)](https://github.com/PortBlueSky/thread-puddle/actions/workflows/master-push.yml) [![npm version](https://badge.fury.io/js/thread-puddle.svg)](https://badge.fury.io/js/thread-puddle) [![Coverage Status](https://coveralls.io/repos/github/PortBlueSky/thread-puddle/badge.svg?branch=master)](https://coveralls.io/github/PortBlueSky/thread-puddle?branch=master)

A library to pool Node.js [worker threads](https://nodejs.org/dist/latest-v13.x/docs/api/worker_threads.html), automatically exposing exported module methods using [Proxy Objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) for easy bi-directional communication between main and worker thread.

**+ Only one dependency** (the `debug` package)  
**+ Callbacks** (workers can call back functions on the main thread)  
**+ Graceful Shutdown** (drains the pool and terminates)

### Installation

```bash
npm install @armit/worker-threads
# or
yarn add @armit/worker-threads
```

### Usage Example

```ts
// examples/ts-class/worker.ts
export class MyWorker {
  say(): void {
    console.log("Hello!");
  }
}

export default new MyWorker();
```

```ts
// examples/ts-class/main.ts
import { createThreadPool } from "../../lib";
import { MyWorker } from "./worker";

(async () => {
  const worker = await createThreadPool<MyWorker>("./worker");
  await worker.say(); // -> "Hello!"

  worker.pool.terminate();
})();
```

This and more examples can be found in the `examples` directory.

## Typing

`createThreadPool` uses TypeScript [generics](https://www.typescriptlang.org/docs/handbook/generics.html) and [other](https://www.typescriptlang.org/docs/handbook/utility-types.html#picktk) [advanced](https://www.typescriptlang.org/docs/handbook/utility-types.html#parameterst) [features](https://www.typescriptlang.org/docs/handbook/utility-types.html#returntypet) to give you the type of how your worker module will actually be exposed to the main thread.

**TL;DR**: The captured type for your thread will be modified to only return async methods and be extended with the pool interface.

Example:

```ts
interface Calculations {
  crunchNumbers(data: number[]): number;
}

// Using as worker type:
const worker = createThreadPool<Calculations>("./calc-worker");

// Will basically become:
interface Calculations {
  crunchNumbers(data: number[]): Promise<number>;
  pool: PoolInterface;
}
```

## API

### `async createThreadPool<T>(workerPath, [options])`

Creates a pool of workers and waits until all workers are ready to call methods on, then returns a Proxy Object which will forward method calls to the worker.

Arguments:

- `workerPath` - an absolute or relative path to a module.
- `options` - optional settings:
  - `size`- the number of worker threads to be created in the pool for the given module. Defaults to `1`.
  - `workerOptions` - will be used as options for the [worker thread constructor](https://nodejs.org/dist/latest-v18.x/docs/api/worker_threads.html#new-workerfilename-options). Defaults to `{}`.
  - `startupTimeout` - if a worker thread cannot be started within this timout in milliseconds, the pool creation will fail and reject with a timout error. Defaults to `30000`.
  - `typecheck` - In development `ts-node` is used, which by default runs `transpile-only` mode. To get type checks, set this to `true`.
  - `maxQueueSize` - When filled up with waiting calls, will reject all subsequent calls, until emptied to below max again. Defaults to `1000`
  - `autoRefill` - Automatically fills up the pool with workers until `size` is reached when workers unexpectedly exit. Defaults to `false`.

If the pool size is `> 1`, method calls will be forwarded to the next available worker. If all workers are busy, the method calls will be queued. A worker will handle one method call at any time only.

### `async worker.[method]([arguments])`

On the Proxy Object returned from `createThreadPool`, you can call any method which is exported from the `workerPath` module. **All method calls are async and return a Promise**, no matter if the module method is async or not. The promise will be resolved with the return value of the method in the worker module. If the method call fails in the worker thread, the Promise will be rejected with that error and the original stack trace. If a method is not available on the worker, the Promise will be rejected with an error.

- `method` - Must match a method name exported from the worker module.
- `arguments` - Arbitrary number of arguments forwarded to the method call in the worker thread.

`Arguments` are transferred to the worker thread via [`postMessage`](https://nodejs.org/dist/latest-v12.x/docs/api/worker_threads.html#worker_threads_port_postmessage_value_transferlist), compatible with the [HTML structured clone algorithm](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm). If you want to move arguments of type `ArrayBuffer` or `MessageChannel` instead of copying them, you can use the [`withTransfer`](#withtransfervalue-transferlist) helper.

`Arguments` can contain a **`function`** (**callback**) in the first level, which will be callable from the thread via a reference, but be executed on the main thread.
**However**, the result of the callback is currently **not** transfered back to the thread. It is possible to implement a worker thread with an `EventEmitter` though, see the [eventemitter example](./examples/ts-eventemitter/). Callback errors will throw an `unhandled exception` if no error listener is attached to the pool `callback:error` event like `worker.pool.on('callback:error', () => ...)`.

```ts
// examples/ts-callbacks/worker.ts
export class MyWorker {
  callMe(callback: (msg: string) => void): void {
    callback("Hello!");
  }
}

export default new MyWorker();
```

```ts
// examples/ts-callbacks/main.ts
import { createThreadPool } from "../../lib";
import { MyWorker } from "./worker";

async function start() {
  const worker = await createThreadPool<MyWorker>("./worker");
  const callback = (msg: string) => console.log(msg);
  await worker.callMe(callback);

  worker.pool.terminate();
}

start();
```

### `async worker.all.[method]([arguments])`

Will call the given `method` on all workers, as soon as they become available. Returns a list of the results from all workers, like `Promise.all`. Otherwise behaves the same as `worker.[method]([arguments])`.

### `worker.pool.terminate()`

Terminates the pool and all worker threads in it. Trying to call methods in the pool afterwards, will result in an rejection.

### `worker.pool.refill()`

Fills up the pool with workers until `size` is reached. Can be used to manually decide wether to refill or terminate.

### `worker.pool.drain()`

Waits until all calls are handled and threads are idle, then terminates all threads.

### `worker.pool.size`

The number of worker threads in the pool.

### `worker.pool.isTerminated`

Wether or not the pool was terminated.

### `withTransfer(value, [transferList])`

This helper can be used **bi-directional**, to transfer values to a worker thread as method call argument(s), or to transfer return values from a worker thread method.

Arguments:

- `value` - Any value which contains transferrables (`ArrayBuffer` or `MessageChannel`).
- `transferList` - If `value` itself is not a [typed array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays), the list may specify any transferrable contained in `value`.

Example method arguments:

```js
// Main thread
const buf = Buffer.from("my main buffer value");
const value = {
  buf,
  anotherValue: true,
};

worker.customMethod(withTransfer(value, [buf])); // <--
```

Example return value:

```js
// Worker thread
module.exports = {
  customMethod() {
    const buf = Buffer.from("my thread buffer value");
    const value = {
      buf,
      anotherValue: true,
    };
    return withTransfer(value, [buf]); // <--
  },
};
```

### Pool Events

#### `error`

Forwards errors that are emitted for a specific worker in the pool. When a worker thread errors, it is terminated. The pool will spawn another worker, unless it is terminated.

#### `exit`

Forwards exit events that are emitted for a specific worker in the pool, adding the `threadId` as second argument.

## Debug

Worker Threads has only one dependency: [`debug`](https://www.npmjs.com/package/debug)

Namespaces:

- `armit-worker:*` - all debug logs for the module
- `armit-worker:master` - only logs from the pool controller
- `armit-worker:thread:*` - logs for all threads only
- `armit-worker:thread:[id]` - logs for a specific thread

Nested Namespaces:

- `armit-worker:parent:[id]:master`
- `armit-worker:parent:[id]:thread:[id]`

The debug method with the correct namespace is exported from the `thread-puddle` entry point.

---

## forks from

https://github.com/PortBlueSky/thread-puddle
