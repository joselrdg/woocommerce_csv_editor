import chalk from "chalk";
import ObjectsToCsv from "objects-to-csv";
import { queryParams } from "./queryParams.js";

const writeFile = async (path, output, name) => {
  const { type } = await queryParams("list", "Guardar archivo?:", ["Sí", "No"]);
  let { type: prefijo } = await queryParams("text", "Escribe un nombre:");
  if (type !== "No") {
    try {
      const csv = new ObjectsToCsv(output);
      csv.toDisk(path + prefijo + ".csv");
    } catch (err) {
      console.error(err);
      return;
    } finally {
      console.log(`
           ${chalk.green.bold("------ CREATED CORRECTLY ------")}\n
           The following item has been created\n
           - File: ${chalk.green.bold(prefijo + ".csv")}\n
           - Path: ${chalk.green.bold(path + prefijo + ".csv")}\n
           ----------------------------------\n`);
    }
  } else chalk.green.bold("No se guardo...");
};

export function writeCSV(path, output, name) {
  writeFile(path, output, name);
}
