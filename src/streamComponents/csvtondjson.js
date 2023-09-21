import { Transform } from "node:stream";
const BREAK_LINE_SYMBOL = "\n";
const INDEX_NOT_FOUND = -1;

export default class CSVToNDJSON extends Transform {
  #delimiter = "";
  #headers = [];
  #buffer = Buffer.alloc(0);

  constructor({ delimiter = ",", headers }) {
    super();
    this.#delimiter = delimiter;
    this.#headers = headers;
  }

  *#updateBuffer(chunk) {
    this.#buffer = Buffer.concat([this.#buffer, chunk]);
    let breakLineIndex = 0;
    while (breakLineIndex !== INDEX_NOT_FOUND) {
      breakLineIndex = this.#buffer.indexOf(Buffer.from(BREAK_LINE_SYMBOL));
      if (breakLineIndex === INDEX_NOT_FOUND) break;

      const lineToProcessIndex = breakLineIndex + BREAK_LINE_SYMBOL.length;
      const line = this.#buffer.subarray(0, lineToProcessIndex);
      const lineData = line.toString();

      this.#buffer = this.#buffer.subarray(lineToProcessIndex);

      if (lineData === BREAK_LINE_SYMBOL) continue;

      const NDJSONLine = [];
      const headers = Array.from(this.#headers);

      for (const item of lineData.split(this.#delimiter)) {
        const key = headers.shift();
        const value = item.replace(BREAK_LINE_SYMBOL, "");
        if (key === value) break;
        NDJSONLine.push(`"${key}":"${value}"`);
      }
      if (!NDJSONLine.length) continue;
      const ndJSONData = NDJSONLine.join(",");
      yield Buffer.from(
        "{".concat(ndJSONData).concat("}").concat(BREAK_LINE_SYMBOL)
      );
    }
  }

  _transform(chunk, enc, callback) {
    for (const item of this.#updateBuffer(chunk)) {
      this.push(item);
    }
    return callback();
  }

  _final(callback) {
    if (!this.#buffer.length) return callback();

    for (const item of this.#updateBuffer(Buffer.from(BREAK_LINE_SYMBOL))) {
      this.push(item);
    }

    callback();
  }
}
