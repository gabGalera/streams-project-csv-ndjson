import { log } from "../util.js";
import { PassThrough } from "node:stream";

const A_HUNDRED_PERCENT = 100;
export default class Reporter {
  #loggerFn;
  constructor({ logger = log } = {}) {
    this.#loggerFn = logger;
  }
  #onData(amount) {
    let totalChunks = 0;
    return (chunk) => {
      totalChunks += chunk.length;
      const processed = (A_HUNDRED_PERCENT / amount) * totalChunks;
      this.#loggerFn(`processed ${processed.toFixed(2)}%`);
    };
  }

  progress(amount) {
    const progress = PassThrough();
    progress.on("data", this.#onData(amount));
    progress.on("end", () =>
      this.#loggerFn(`processed ${A_HUNDRED_PERCENT}.00%`)
    );

    return progress;
  }
}
