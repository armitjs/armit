import { type WrapWorkerType, createThreadPool } from '../../index.js';
import type NestedWorker from './nested.js';

let nestedWorker: WrapWorkerType<typeof NestedWorker> | null = null;

export default {
  setup: async () => {
    const worker = await createThreadPool<typeof NestedWorker>('./nested');
    nestedWorker = worker;
  },
  callNested: (val) => nestedWorker?.getNestedValue(val),
};
