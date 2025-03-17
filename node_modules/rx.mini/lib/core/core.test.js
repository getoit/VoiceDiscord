"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
describe("event", () => {
    test("subscribe", () => {
        const testEvent = new _1.Event();
        const { unSubscribe } = testEvent.subscribe((data) => {
            expect(data).toBe("1");
        });
        testEvent.subscribe((data) => {
            expect(data).toBe("1");
        });
        testEvent.execute("1");
        expect(testEvent.event.stack.length).toBe(2);
        unSubscribe();
        expect(testEvent.event.stack.length).toBe(1);
        testEvent.once(() => {
            expect(testEvent.event.stack.length).toBe(1);
        });
        expect(testEvent.event.stack.length).toBe(2);
        testEvent.execute("1");
    });
    test("aspromise", async () => {
        const testEvent = new _1.Event();
        setTimeout(() => {
            testEvent.execute(1);
        }, 0);
        const [res] = await testEvent.asPromise();
        expect(res).toBe(1);
    });
    test("complete", async () => {
        const event = new _1.Event();
        const trigger = event.returnTrigger;
        const listener = event.returnListener;
        setTimeout(() => trigger.execute(0), 0);
        {
            const [res] = await listener.asPromise();
            expect(typeof res).toBe("number");
        }
        setTimeout(() => trigger.complete(), 0);
        {
            const [res] = await listener.asPromise();
            expect(typeof res).toBe("undefined");
        }
        expect(() => event.subscribe(() => { })).toThrowError("event completed");
        expect(() => event.execute(0)).toThrowError("event completed");
    });
    test("test-error", async () => {
        const event = new _1.Event();
        setTimeout(() => event.execute(1), 0);
        {
            const [res] = await event.asPromise();
            expect(typeof res).toBe("number");
        }
        setTimeout(() => event.error("error"), 0);
        {
            const [res] = await event.asPromise().catch((e) => [e]);
            expect(res).toBe("error");
        }
    });
});
//# sourceMappingURL=core.test.js.map