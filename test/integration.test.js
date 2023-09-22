import { expect, describe, it, jest } from "@jest/globals";
import CSVToNDJSON from "../src/streamComponents/csvtondjson.js";
import { pipeline } from "node:stream/promises";
import { Readable, Writable } from "node:stream";
import Reporter from "../src/streamComponents/reporter";

describe("CSV to NDJSON", () => {
  const reporter = new Reporter();
  it("given a csv string, it should parse each line to a valid NDJSON string", async () => {
    const csvString = `id,name,desc\n01,test,mydesc\n02,gabriel,descr01\n03,erick,lorem`;
    const csvToJSON = new CSVToNDJSON({
      delimiter: ",",
      headers: ["id", "name", "desc"],
    });

    const spy = jest.fn();

    await pipeline(
      Readable.from(csvString),
      csvToJSON,
      reporter.progress(csvString.length),
      Writable({
        write(chunk, enc, cb) {
          spy(chunk);
          cb(null, chunk);
        },
      })
    );
    const times = csvString.split("\n").length - 1;
    expect(spy).toHaveBeenCalledTimes(times);

    const [firstCall, secondCall, thirdCall] = spy.mock.calls;
    expect(JSON.parse(firstCall)).toStrictEqual({
      id: "01",
      name: "test",
      desc: "mydesc",
    });
    expect(JSON.parse(secondCall)).toStrictEqual({
      id: "02",
      name: "gabriel",
      desc: "descr01",
    });
    expect(JSON.parse(thirdCall)).toStrictEqual({
      id: "03",
      name: "erick",
      desc: "lorem",
    });
  });
});
