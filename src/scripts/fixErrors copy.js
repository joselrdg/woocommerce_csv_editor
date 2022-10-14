import fs from "fs";
import chalk from "chalk";
import { queryParams } from "./common/queryParams.js";

const fillWithCommas = async (n) => {
  let str = "";
  for (let index = 0; index < n; index++) {
    str += ",";
  }
  return str;
};

const optios = async function (totalHead, totalRow, formatRow, rep = false) {
  let tarea = rep;
  if (!rep) {
    const { type } = await queryParams("list", "Que quieres hacer:", [
      "Rellenar con comas"
    ]);
    tarea = type;
  }
  let str = formatRow;
  switch (tarea) {
    case "Rellenar con comas":
      str += await fillWithCommas(totalHead - totalRow);
    default:
      break;
  }
  return { str, tarea };
};

const repetirAccion = async () => {
  const { type: rep } = await queryParams(
    "list",
    "Quieres repetir hasta otra diferencia?:",
    ["Si", "No"]
  );
  return rep;
};

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

const showErrorLength = (header, line) => {
  console.log(
    chalk[header === line ? "green" : "red"](
      "- Total de Headers: " + header + " - Linea: " + line
    )
  );
};

const writeFile = async (path, output, name) => {
  const { type } = await queryParams("list", "Guardar archivo?:", ["Sí", "No"]);
  if (type !== "No") {
    try {
      fs.writeFileSync(path + "fixed-errors" + "_" + name, output);
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
  let strVariable = "";
  const dataVariables = [];
  const allRows = data.toString().split(/\r?\n|\r/);
  const headers = allRows[0].split(",");
  console.log("Headers:");
  console.log(headers);
  console.log("\n");

  const totalHead = headers.length;
  console.log("Total de Headers: " + totalHead);

  let rep = { rep: "No", opt: "" };

  let oldLength = -1;
  const newRows = [allRows[0]];
  for (var singleRow = 1; singleRow < allRows.length; singleRow++) {
    // console.log(singleRow + "\n");
    if (allRows[singleRow]) {
      const formatRow = formatLine(allRows[singleRow]);
      const dataRow = formatRow.split(",");
      const totalRow = dataRow.length;
      if (totalRow !== totalHead) {
        showErrorLength(totalHead, totalRow);
        if (rep.rep === "No" && oldLength !== totalRow) {
          rep.rep = await repetirAccion();
          const str = await optios(totalHead, totalRow, formatRow);
          const arr = str.str.split(",");
          rep.opt = str.tarea;
          newRows.push(str.str);
          showErrorLength(totalHead, arr.length);
          oldLength = arr.length;
        } else {
          const str = await optios(totalHead, totalRow, formatRow, rep.opt);
          const arr = str.str.split(",");
          newRows.push(str.str);
          showErrorLength(totalHead, arr.length);
          if (oldLength !== arr.length) {
            console.log(chalk.red("errror " + oldLength + " " + totalRow));
            return;
          } else oldLength = arr.length;
        }
      } else {
        console.log(chalk.red("e"));
        return;
      }
    }
  }
  const dataStr = newRows.join("\n").replaceAll("[AaMm]", ",");
  writeFile(path, dataStr, fileName);

  // const urlSaveData = pathBase + "/svc" + `/wc-importer-${name}.csv`;

  //     for (let ind = 0; ind < variaciones.items.length; ind++) {
  //       const datosTubo = {};
  //       const colorVariacion = variaciones.items[ind];
  //       for (let column = 0; column < headers.length; column++) {
  //         const header = headers[column];
  //         if (header === "Tipo" || header === '"Tipo"') {
  //           const Tipo = "variation";
  //           datosTubo["Tipo"] = Tipo;
  //           strVariable += Tipo + ",";
  //         } else if (header === "Nombre" || header === '"Nombre"') {
  //           const Nombre =
  //             dataRow[column].replaceAll("[AaMm]", ",") +
  //             " - " +
  //             colorVariacion;
  //           datosTubo["Nombre"] = Nombre;
  //           strVariable += Nombre + ",";
  //         } else if (header === "Publicado" || header === '"Publicado"') {
  //           const Publicado = 1;
  //           datosTubo["Publicado"] = Publicado;
  //           strVariable += Publicado + ",";
  //         } else if (
  //           header === "¿Está destacado?" ||
  //           header === '"¿Está destacado?"'
  //         ) {
  //           const destacado = 0;
  //           datosTubo["¿Está destacado?"] = destacado;
  //           strVariable += destacado + ",";
  //         } else if (
  //           header === "Visibilidad en el catálogo" ||
  //           header === '"Visibilidad en el catálogo"'
  //         ) {
  //           const visible = "visible";
  //           datosTubo["Visibilidad en el catálogo"] = visible;
  //           strVariable += visible + ",";
  //         } else if (
  //           header === "Estado del impuesto" ||
  //           header === '"Estado del impuesto"'
  //         ) {
  //           const taxable = "taxable";
  //           datosTubo["Estado del impuesto"] = taxable;
  //           strVariable += taxable + ",";
  //         } else if (
  //           header === "Clase de impuesto" ||
  //           header === '"Clase de impuesto"'
  //         ) {
  //           const taxableClass = "parent";
  //           datosTubo["Clase de impuesto"] = taxableClass;
  //           strVariable += taxableClass + ",";
  //         } else if (
  //           header === "¿En inventario?" ||
  //           header === '"¿En inventario?"'
  //         ) {
  //           const inventario = 1;
  //           datosTubo["¿En inventario?"] = inventario;
  //           strVariable += inventario + ",";
  //         } else if (
  //           header === "Precio normal" ||
  //           header === '"Precio normal"'
  //         ) {
  //           const Precio = dataRow[column].replaceAll("[AaMm]", ",");
  //           datosTubo["Precio normal"] = Precio;
  //           console.log(Precio)
  //           console.log(dataRow[column])
  //           strVariable += Precio + ",";
  //         } else if (header === "Superior" || header === '"Superior"') {
  //           const Superior = dataRow[1]
  //           datosTubo["Superior"] = Superior;
  //           strVariable += Superior + ",";
  //         } else if (header === "Posición" || header === '"Posición"') {
  //           const Posición = ind + 1;
  //           datosTubo["Posición"] = Posición;
  //           strVariable += Posición + ",";
  //         } else if (
  //           header === "Nombre del atributo 1" ||
  //           header === '"Nombre del atributo 1"'
  //         ) {
  //           const atributo = "Color";
  //           datosTubo["Nombre del atributo 1"] = atributo;
  //           strVariable += atributo + ",";
  //         } else if (
  //           header === "Valor(es) del atributo 1" ||
  //           header === '"Valor(es) del atributo 1"'
  //         ) {
  //           const valoratributo = colorVariacion;
  //           datosTubo["Valor(es) del atributo 1"] = valoratributo;
  //           strVariable += valoratributo + ",";
  //         } else if (
  //           header === "Atributo global 1" ||
  //           header === '"Atributo global 1"'
  //         ) {
  //           const globalAtributo = 1;
  //           datosTubo["Atributo global 1"] = globalAtributo;
  //           strVariable += globalAtributo + ",";
  //         } else {
  //           strVariable += ",";
  //         }
  //       }
  //       strVariable += "\r\n";
  //       dataVariables.push(datosTubo);
  //     }
  //     // strVariable += "\n";
  //   }
  // }
  // const strFinal = data + strVariable;
  // const strVar = allRows[0] + "\r\n" + strVariable;

  // const urlSaveVar =
  //   pathBase + "svc" + "/variaciones_con_productos-" + fileNameCSV;

  // fs.writeFileSync(urlSaveVar, strVar, {
  //   mode: 0o777
  // });

  // console.log("Archivo creado: " + urlSaveVar);

  // console.log(dataVariables);

  // const urlSaveData =
  //   pathBase + "svc" + `/wc-variations-importer-${fileNameCSV}`;

  // const csv = new ObjectsToCsv(dataVariables);
  // csv.toDisk(urlSaveData);
  // console.log("Data saved: " + urlSaveData);
  // console.log("Productos añadidos: ", dataVariables.length);
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
