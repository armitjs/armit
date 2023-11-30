// eslint-disable-next-line @typescript-eslint/naming-convention
import EventEmitter from 'node:events';

export class WorkerWithEmitter extends EventEmitter {
  triggerSomething(x: number, y: number) {
    const result = x + y;
    this.emit('some:event', result);
  }
}

export default new WorkerWithEmitter();
