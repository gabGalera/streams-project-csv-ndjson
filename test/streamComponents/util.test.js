import { expect, describe, it, jest, afterAll } from "@jest/globals";
import { log } from "../../src/util";
import readline from "node:readline";

describe("Log Suite Test", () => {
  readline.cursorTo = jest.fn().mockImplementation();
  process.stdout.write = jest.fn().mockImplementation();

  afterAll(() => jest.clearAllMocks());

  it("writeInput", () => {
    const msg = "test";
    log(msg);
    expect(readline.cursorTo).toBeCalledWith(process.stdout, 0);
    expect(process.stdout.write).toBeCalledWith(msg);
  });
});
