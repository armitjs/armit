import { type WrapWorkerType, createThreadPool } from '../../index.js';
// eslint-disable-next-line @typescript-eslint/naming-convention
import type NestedWorker from './nested.js';

let nestedWorker: WrapWorkerType<typeof NestedWorker> | null = null;

export default {
  setup: async () => {
    const worker = await createThreadPool<typeof NestedWorker>('./nested');
    nestedWorker = worker;
  },
  callNested: (val) => nestedWorker?.getNestedValue(val),
};
