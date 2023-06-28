import { type MessagePort } from 'worker_threads';
import { isDetached } from './utils/is-detached.js';

export type Transferable = MessagePort | ArrayBuffer;

export class TransferableValue {
  obj;
  transferables: Transferable[];

  constructor(obj, transferables: Transferable[] | undefined) {
    this.obj = obj;
    const transfers = transferables || obj;
    this.transferables = [].concat(transfers).map((value: any) => {
      if (
        value instanceof Uint8Array ||
        value instanceof Uint16Array ||
        value instanceof Uint32Array
      ) {
        value = value.buffer;
      }
      if (value instanceof ArrayBuffer && isDetached(value)) {
        throw new TypeError('The ArrayBuffer for transfer is already detached');
      }
      return value;
    });
  }
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export function Transferable(obj, transferables?: Transferable[]) {
  return new TransferableValue(obj, transferables);
}

export function withTransfer(obj, transferables?: Transferable[]) {
  return new TransferableValue(obj, transferables);
}
