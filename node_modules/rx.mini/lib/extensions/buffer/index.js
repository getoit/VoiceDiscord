"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Buffer = void 0;
const core_1 = require("../../core");
function Buffer(length, event) {
    const observable = new core_1.Event();
    const pool = [];
    let fulled = false;
    event.subscribe((...e) => {
        if (!fulled && pool.length === length) {
            pool.forEach((e) => observable.execute(...e));
            fulled = true;
        }
        if (fulled) {
            observable.execute(...e);
        }
        else {
            pool.push(e);
        }
    });
    const { subscribe, asPromise, once } = observable;
    return { subscribe, asPromise, once };
}
exports.Buffer = Buffer;
//# sourceMappingURL=index.js.map