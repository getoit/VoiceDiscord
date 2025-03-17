"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = __importDefault(require("."));
test("wait", async () => {
    const wait = new _1.default();
    await Promise.all([
        new Promise(async (r) => {
            const { exist, result } = await wait.create("test", () => new Promise((r) => setTimeout(() => r(["solve"]), 1000)));
            expect(exist).toBe(undefined);
            if (result) {
                expect(result).toEqual(["solve"]);
                r();
            }
        }),
        new Promise(async (r) => {
            const { exist, result } = await wait.create("test", () => new Promise((r) => setTimeout(() => r(["solve2"]), 1000)));
            expect(result).toBe(undefined);
            if (exist) {
                const res = await exist.asPromise();
                expect(res).toEqual(["solve"]);
                r();
            }
        }),
    ]);
});
//# sourceMappingURL=test.js.map