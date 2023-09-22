import { expect, describe, it, jest } from "@jest/globals";
import Reporter from "../../src/streamComponents/reporter";

describe("Reporter Suite Test", () => {
  it("it should print progress status correctly", () => {
    const loggerMock = jest.fn();
    const reporter = new Reporter({
      logger: loggerMock,
    });
    reporter.LINE_LENGTH_AFTER_TURNED_INTO_JSON = 0;
    const multiple = 10;
    const progress = reporter.progress(multiple);

    for (let i = 1; i < multiple; i += 1) {
      progress.write("1");
    }
    progress.emit("end");
    expect(loggerMock.mock.calls.length).toEqual(10);

    for (const index in loggerMock.mock.calls) {
      const [call] = loggerMock.mock.calls[index];
      const expected = (Number(index) + 1) * multiple;
      expect(call).toStrictEqual(`processed ${expected}.00%`);
    }
  });
});
