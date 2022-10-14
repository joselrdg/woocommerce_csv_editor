import fs from "fs";
import chalk from "chalk";
import ObjectsToCsv from "objects-to-csv";
import { queryParams } from "./common/queryParams.js";

const formatLine = (line) => {
  let strF = line;
  let count = strF.indexOf('"');
  let formatRow = "";
  while (count > -1) {
    formatRow += strF.slice(0, count);
    strF = strF.slice(count + 1);
    count = strF.indexOf('"');
    formatRow += strF.slice(0, count).replaceAll(",", "[AaMm]");
    strF = strF.slice(count + 1);
    count = strF.indexOf('"');
  }
  return (formatRow += strF);
};

const writeFile = async (path, output, name) => {
  const { type } = await queryParams("list", "Guardar archivo?:", ["Sí", "No"]);
  if (type !== "No") {
    try {
      const csv = new ObjectsToCsv(output);
      csv.toDisk(path + "fixed-errors" + "_" + name);
    } catch (err) {
      console.error(err);
      return;
    } finally {
      console.log(`
         ${chalk.green.bold("------ CREATED CORRECTLY ------")}\n
         The following item has been created\n
         - File: ${chalk.green.bold("fixed-errors" + "_" + name)}\n
         - Path: ${chalk.green.bold(path + "fixed-errors" + "_" + name)}\n
         ----------------------------------\n`);
    }
  } else chalk.green.bold("No se guardo...");
};

const start = async (data, path, fileName) => {
  const dataVariables = [];
  const allRows = data.toString().split(/\r?\n|\r/);
  const headers = allRows[0].split(",");
  console.log("Headers:");
  console.log(headers);
  console.log("\n");

  const totalHead = headers.length;
  console.log("Total de Headers: " + totalHead);

  for (var singleRow = 1; singleRow < allRows.length; singleRow++) {
    // console.log(singleRow + "\n");
    if (allRows[singleRow]) {
      const formatRow = formatLine(allRows[singleRow]);
      const dataRow = formatRow.split(",");
      const totalRow = dataRow.length;
      const datosTubo = {};
      for (let column = 0; column < totalHead; column++) {
        const header = headers[column].replaceAll('"', "");
        datosTubo[header] = dataRow[column]
          ? dataRow[column].replaceAll("[AaMm]", ",")
          : "";
      }
      dataVariables.push(datosTubo);
    }
  }
  writeFile(path, dataVariables, fileName);
};

export function fixErrors(path, fileName) {
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
