import chalk from "chalk";
import ObjectsToCsv from "objects-to-csv";
import { queryParams } from "./queryParams.js";
import { getdate } from "./getdate.js";

const writeFile = async (path, output) => {
  const { type } = await queryParams("list", "Guardar archivo?:", ["Sí", "No"]);
  if (type !== "No") {
    const { type: prefijo } = await queryParams("text", "Escribe un nombre:");
    const name = getdate() + "-" + prefijo + ".csv";
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

export const writeCSV = async (path, output) => {
  await writeFile(path, output);
};
