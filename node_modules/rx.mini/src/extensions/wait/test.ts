import Wait from ".";

test("wait", async () => {
  const wait = new Wait<[string]>();
  await Promise.all([
    new Promise<void>(async (r) => {
      const { exist, result } = await wait.create(
        "test",
        () => new Promise<[string]>((r) => setTimeout(() => r(["solve"]), 1000))
      );
      expect(exist).toBe(undefined);
      if (result) {
        expect(result).toEqual(["solve"]);
        r();
      }
    }),
    new Promise<void>(async (r) => {
      const { exist, result } = await wait.create(
        "test",
        () =>
          new Promise<[string]>((r) => setTimeout(() => r(["solve2"]), 1000))
      );
      expect(result).toBe(undefined);
      if (exist) {
        const res = await exist.asPromise();
        expect(res).toEqual(["solve"]);
        r();
      }
    }),
  ]);
});
