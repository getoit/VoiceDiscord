"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("../../core");
const _1 = require(".");
test("buffer", async () => {
    const event = new core_1.Event();
    const pool = (0, _1.Buffer)(3, event);
    let i = 0;
    pool.subscribe(() => {
        expect(i > 3).toBe(true);
    });
    event.execute(i++);
    event.execute(i++);
    event.execute(i++);
    event.execute(i++);
    event.execute(i++);
    event.execute(i++);
    await new Promise((r) => setTimeout(r, 10));
});
//# sourceMappingURL=test.js.map