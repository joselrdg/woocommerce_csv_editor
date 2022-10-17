import chalk from "chalk";
import ObjectsToCsv from "objects-to-csv";
import { queryParams } from "./queryParams.js";
import { getdate } from "./getdate.js";

const writeFile = async (path, output) => {
  const { type } = await queryParams("list", "Guardar archivo?:", ["Sí", "No"]);
  let { type: prefijo } = await queryParams("text", "Escribe un nombre:");
  const name = getdate() + "-" + prefijo + ".csv";
  if (type !== "No") {
    try {
      const csv = new ObjectsToCsv(output);
      csv.toDisk(path + name);
    } catch (err) {
      console.error(err);
      return;
    } finally {
      console.log(`
           ${chalk.green.bold("------ CREATED CORRECTLY ------")}\n
           The following item has been created\n
           - File: ${chalk.green.bold(name)}\n
           - Path: ${chalk.green.bold(path + name)}\n
           ----------------------------------\n`);
    }
  } else chalk.green.bold("No se guardo...");
};

export function writeCSV(path, output, name) {
  writeFile(path, output, name);
}
