import fs from "fs";
import chalk from "chalk";
import { generate, parse, transform, stringify } from "csv";
import { filewalker } from "./common/filewalker.js";
import { queryParams } from "./common/queryParams.js";

const pathBase = process.cwd();

const correcciones = [];
const pathCSV = pathBase + "/src/csv/";

const searchDirs = async () => {
  const pathArr = await filewalker(pathCSV, {
    directoryFilter: ["!.git", "!*modules"],
    type: "files",
    fileFilter: "*.csv"
  });
  return pathArr;
};

const options = async function (a, b) {
  const paths = await searchDirs(".csv");
  if (paths[0]) {
    const { type: CSVfile } = await queryParams(
      "list",
      "Selecciona archivo:",
      paths
    );

    fs.createReadStream(pathCSV + CSVfile)
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", function (row) {
      console.log(row);
    })
    .on("end", function () {
      console.log("finished");
    })
    .on("error", function (error) {
      console.log(error.message);
    });
  }
};

export default function start() {
  console.log("Empezamos...");
  options();
}
