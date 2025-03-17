import { Event } from "../../core";
import { Buffer } from ".";

test("buffer", async () => {
  const event = new Event<[number]>();
  const pool = Buffer(3, event);
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
