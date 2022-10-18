import chalk from "chalk";
import { filewalker } from "./common/filewalker.js";
import { queryParams } from "./common/queryParams.js";
import { createCSVObjt } from "./common/createCSVObjt.js";
import { fixErrors } from "./fixErrors.js";
import { editCSV } from "./editCSV.js";
import { modifyDescription } from "./modifyDescription.js";

// const pathBase = process.cwd();

const pathCSV = process.cwd() + "/src/csv/";

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
  const CSVfile = await selectCSVfile();
  if (!CSVfile) {
    console.log(chalk.red("No se encontraron archivos en " + pathCSV));
    return false;
  }
  const { headers, data } = await createCSVObjt(pathCSV, CSVfile);
  // let salir = false;
  // while (!salir) {
    const { type: tarea } = await queryParams("list", "Que quieres hacer:", [
      "Actualizar datos",
      "Modificar descripción",
      "Eliminar errores en el archivo",
      "Salir"
    ]);
    if (tarea === "Eliminar errores en el archivo") {
      await fixErrors(pathCSV, CSVfile);
    } else if (tarea === "Actualizar datos") {
      await editCSV(pathCSV, CSVfile, headers, data);
    } else if (tarea === "Modificar descripción") {
      await modifyDescription(pathCSV, CSVfile, headers, data);
    } else {
      salir = true;
    }
  // }
};

export default function start() {
  console.log(chalk.greenBright("\n" + " Empezamos..." + "\n"));
  options();
}
