"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require("../../"));
class Wait {
    constructor() {
        Object.defineProperty(this, "candidates", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
    }
    exist(id) {
        return Object.keys(this.candidates).includes(id);
    }
    delete(kid) {
        delete this.candidates[kid];
    }
    async create(id, job) {
        if (this.exist(id)) {
            return { exist: this.candidates[id] };
        }
        else {
            const event = new __1.default();
            this.candidates[id] = event;
            const result = await job();
            event.execute(...result);
            this.delete(id);
            return { result };
        }
    }
}
exports.default = Wait;
//# sourceMappingURL=index.js.map