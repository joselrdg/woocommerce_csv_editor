import chalk from "chalk";
import { filewalker } from "./common/filewalker.js";
import { queryParams } from "./common/queryParams.js";
import { fixErrors } from "./fixErrors.js";
import { editCSV } from "./editCSV.js";

const pathBase = process.cwd();

const pathCSV = pathBase + "/src/csv/";

const searchDirs = async () => {
  const pathArr = await filewalker(pathCSV, {
    directoryFilter: ["!.git", "!*modules"],
    type: "files",
    fileFilter: "*.csv"
  });
  return pathArr;
};

const selectCSVfile = async function () {
  const paths = await searchDirs(".csv");
  if (paths[0]) {
    const { type } = await queryParams("list", "Selecciona archivo:", paths);
    return type;
  } else return false;
};

const options = async function () {
  let salir = false;
  while (!salir) {
    const CSVfile = await selectCSVfile();
    if (!CSVfile) {
      console.log(chalk.red("No se encontraron archivos en " + pathCSV));
      return false;
    }
    const { type: tarea } = await queryParams("list", "Que quieres hacer:", [
      "Actualizar datos",
      "Eliminar errores en el archivo",
      "Salir"
    ]);
    switch (tarea) {
      case "Eliminar errores en el archivo":
        await fixErrors(pathCSV, CSVfile);
      case "Actualizar datos":
        await editCSV(pathCSV, CSVfile);
      case "Salir":
        salir = true;
    }
  }
};

export default function start() {
  console.log(chalk.greenBright("\n" + " Empezamos..." + "\n"));
  options();
}
