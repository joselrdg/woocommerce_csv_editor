import fs from "fs";
import chalk from "chalk";
import ObjectsToCsv from "objects-to-csv";
import { queryParams } from "./common/queryParams.js";
import { createCSVObjt } from "./common/createCSVObjt.js";

// const updateAll = async (data, header, value, posicion) => {
//   for (let index = 0; index < data.length; index++) {
//     const producto = data[index];
//     for (const key in producto) {
//       if (Object.hasOwnProperty.call(producto, key)) {
//         const element = producto[key];
//         if (key === header ) {
//           console.log("header: " + header + " key: " + key + " value: " + value);
//         }
//       }
//     }
//   }
// };

const rplace = (e, header, value, posicion) => {
  if (posicion === "Reemplazar el valor") {
    e[header] = value;
  } else if (posicion === "Añadir al principo valor") {
    e[header] = value + " " + e[header];
  } else if (posicion === "Añadir al final valor") {
    e[header] = e[header] + " " + value;
  }
};

const updateAll = async (data, header, value, posicion, restring = false) => {
  return data.map((e) => {
    if (e[restring.keyRest] === restring.value) {
      console.log("Es ingual si señor");
    } else return rplace(e);
  });
};

const options = async function (headers, data) {
  const { type: tarea } = await queryParams("list", "Que quieres hacer:", [
    "Actualizar valor en todos los productos",
    "Actualizar valor por key"
  ]);
  const { type: key } = await queryParams(
    "list",
    "Selecciona header a actulaizar:",
    headers
  );
  const { type: value } = await queryParams("text", "Escribe un valor:");
  const { type: posicion } = await queryParams(
    "list",
    "Donde lo quieres añadir:",
    ["Reemplazar el valor", "Añadir al principo valor", "Añadir al final valor"]
  );
  switch (tarea) {
    case "Actualizar valor en todos los productos":
      data = await updateAll(data, key, value, posicion, false);
      console.log(data[data.length - 1]);
      break;
    case "Actualizar valor por key":
      const { type: keyRest } = await queryParams(
        "list",
        "Selecciona header a restringir:",
        headers
      );
      const { type } = await queryParams("list", "Valor a restingir:", [
        "Seleccionar",
        "Introducir"
      ]);
      let rest = { keyRest };
      if (type === "Introducir") {
        const { type: valueRest } = await queryParams(
          "text",
          "Escribe un valor:"
        );
        rest.value = valueRest;
      }
      data = await updateAll(data, key, value, posicion, rest);
      console.log(data[data.length - 1]);
      break;
    default:
      break;
  }
};

const start = async (path, fileName) => {
  const { headers, data } = await createCSVObjt(path, fileName);
  console.log(headers);
  const op = await options(headers, data);
};

export function editCSV(path, fileName) {
  return new Promise((resolve) => {
    start(path, fileName);
    resolve("data");
  });
}
