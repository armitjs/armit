import { EventEmitter } from 'node:events';
import { type WorkerThread } from '../worker-thread.js';

export interface ThreadRequest {
  resolve(thread: WorkerThread): void;
  reject(error: Error): void;
}

export class RequestQueue extends EventEmitter {
  private threadRequests: ThreadRequest[] = [];

  constructor() {
    super();
  }

  size() {
    return this.threadRequests.length;
  }

  push(request: ThreadRequest): void {
    this.threadRequests.push(request);
  }

  hasPending(): boolean {
    return this.threadRequests.length > 0;
  }

  next(): ThreadRequest | undefined {
    const request = this.threadRequests.shift();
    this.emit('empty');
    return request;
  }

  rejectAll(err) {
    for (const workerRequest of this.threadRequests) {
      workerRequest.reject(err);
    }
  }
}
