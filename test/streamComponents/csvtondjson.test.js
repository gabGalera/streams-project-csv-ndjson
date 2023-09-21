import { expect, describe, it, jest } from "@jest/globals";
import CSVToNDJSON from "../../src/streamComponents/csvtondjson.js";

describe("CSV To NDJSON test suite", () => {
  it("given a csv string it should return a ndjson string", () => {
    const csvString = `id,name,address\n01,gabriel,address01\n`;
    const csvToJSON = new CSVToNDJSON({
      delimiter: ",",
      headers: ["id", "name", "address"],
    });

    const expected = JSON.stringify({
      id: "01",
      name: "gabriel",
      address: "address01",
    });
    const fn = jest.fn();

    csvToJSON.on("data", fn);
    csvToJSON.write(csvString);
    csvString.end();

    const [current] = fn.mock.lastCall;
    expect(current).toStrictEqual(expected);
  });
  it.todo(
    "it should work with strings that doesn't contain breaklines at the end"
  );
  it.todo(
    "it should work with files that has breaklines at the beginning of the string"
  );
});
