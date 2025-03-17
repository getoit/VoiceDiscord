"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("../../core");
function Pack() {
    let events = [];
    const event = () => {
        const e = new core_1.Event();
        events.push(e);
        return e;
    };
    const finishAll = () => {
        events.forEach((e) => e.allUnsubscribe());
        events = [];
    };
    return { event, finishAll };
}
exports.default = Pack;
//# sourceMappingURL=index.js.map