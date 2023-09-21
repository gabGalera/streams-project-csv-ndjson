import { log } from "../util.js";
import { PassThrough } from "node:stream";
export default class Reporter {
  #loggerFn;
  constructor({ logger = log } = {}) {
    this.#loggerFn = logger;
  }

  progress(amount) {
    const progress = PassThrough();
    return amount;
  }
}
