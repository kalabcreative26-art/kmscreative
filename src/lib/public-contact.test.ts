import { expect, test } from "bun:test";
import { PUBLIC_PHONE, PUBLIC_PHONE_HREF } from "./public-contact";

test("contact phone dials the owner's requested number", () => {
  expect(PUBLIC_PHONE).toBe("0978792495");
  expect(PUBLIC_PHONE_HREF).toBe("tel:0978792495");
});