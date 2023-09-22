import { Transform } from "node:stream";
import { pipeline } from "node:stream/promises";
import CSVToNDJSON from "./streamComponents/csvtondjson.js";
import Reporter from "./streamComponents/reporter.js";
import { createReadStream, createWriteStream, statSync } from "node:fs";
import { log } from "node:console";

/* 
echo "id,name,desc,age" > big.csv
500k items
for i in `seq 1 5`; do node -e "process.stdout.write('$i,gabriel-$i,$i-text,$i\n'.repeat(1e5))" >> big.csv; done

50M items
for i in `seq 1 5`; do node -e "process.stdout.write('$i,gabriel-$i,$i-text,$i\n'.repeat(1e7))" >> big.csv; done
*/

const reporter = new Reporter();
const fileName = "big.csv";
const { size: fileSize } = statSync(fileName);
let counter = 0;

const processData = Transform({
  transform(chunk, enc, callback) {
    const data = JSON.parse(chunk);
    const result = JSON.stringify({
      ...data,
      id: counter++,
    }).concat("\n");

    return callback(null, result);
  },
});
const csvToJSON = new CSVToNDJSON({
  delimiter: ",",
  headers: ["id", "name", "desc", "age"],
});

const startedAt = Date.now();

await pipeline(
  createReadStream(fileName),
  csvToJSON,
  processData,
  reporter.progress(fileSize),
  createWriteStream("big.ndjson")
);
const A_MILLISECOND = 1000;
const A_MINUTE = 60;

const timeInSeconds = Math.round(
  (Date.now() - startedAt) / A_MILLISECOND
).toFixed(2);
const finalTime =
  timeInSeconds > A_MILLISECOND
    ? `${timeInSeconds / A_MINUTE}m`
    : `${timeInSeconds}s`;
log(
  `took: ${finalTime} - processed items: ${counter} process finished with success!`
);
