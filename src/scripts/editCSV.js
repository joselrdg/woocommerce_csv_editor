import fs from "fs";
import chalk from "chalk";
import ObjectsToCsv from "objects-to-csv";
import { queryParams } from "./common/queryParams.js";
import { createCSVObjt } from "./common/createCSVObjt.js";

const start = async (data, path, fileName) => {
  const CSVdata = await createCSVObjt(data);
  console.log(CSVdata);
};

export function editCSV(path, fileName) {
  return new Promise((resolve) => {
    const dataa = [];
    fs.readFile(path + fileName, "utf-8", (err, data) => {
      if (err) console.log(err);
      else {
        start(data, path, fileName);
      }
    });
    resolve(dataa);
  });
}
