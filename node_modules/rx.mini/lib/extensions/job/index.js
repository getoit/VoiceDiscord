"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require("../../"));
class Worker {
    constructor(jobs) {
        Object.defineProperty(this, "jobs", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: jobs
        });
        Object.defineProperty(this, "running", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
    }
    async execute() {
        const job = this.jobs.shift();
        if (job) {
            this.running = true;
            const { func, args, event } = job;
            const res = await func(...args);
            event.execute(res);
            this.execute();
        }
        else {
            this.running = false;
        }
    }
    wakeup() {
        if (!this.running) {
            this.execute();
        }
    }
}
class JobSystem {
    constructor(opt = { a: 5 }) {
        Object.defineProperty(this, "opt", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: opt
        });
        Object.defineProperty(this, "jobs", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "workers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        const { a } = opt;
        this.workers = [...Array(a)].map(() => new Worker(this.jobs));
    }
    async add(func, args) {
        const { a } = this.opt;
        const event = new __1.default();
        this.jobs.push({ func, args, event });
        if (this.jobs.length < a) {
            this.workers.forEach(worker => worker.wakeup());
        }
        return event.asPromise();
    }
}
exports.default = JobSystem;
//# sourceMappingURL=index.js.map