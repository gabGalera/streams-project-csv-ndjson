import { Transform } from "node:stream";
export default class CSVToNDJSON extends Transform {
  #delimiter = ",";
  #headers = [];

  constructor({ delimiter = ",", headers }) {
    super();
    this.#delimiter = delimiter;
    this.#headers = headers;
  }

  _transform(chunk, enc, callback) {
    callback(null, chunk);
  }

  _final(callback) {
    callback();
  }
}
