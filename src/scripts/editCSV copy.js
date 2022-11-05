import fs from "fs";
import chalk from "chalk";
import ObjectsToCsv from "objects-to-csv";
import { queryParams } from "./common/queryParams.js";
import { createCSVObjt } from "./common/createCSVObjt.js";
import { writeCSV } from "./common/writeCSV.js";
import { getdate } from "./common/getdate.js";
import { HEADERS } from "./common/HEADERS.js";

const selectKeyVal = async (idioma = "es") => {
  const { type: keyRest } = await queryParams(
    "list",
    "Selecciona header:",
    Object.keys(HEADERS[idioma])
  );
  const { type: value } = await queryParams(
    "list",
    "Selecciona valor:",
    HEADERS[idioma][keyRest]
  );
  return { keyRest, value };
};

const rplace = (e, header, value, posicion) => {
  if (posicion === "Reemplazar el valor") {
    e[header] = value;
  } else if (posicion === "Añadir valor al principo") {
    e[header] = value + " " + e[header];
  } else if (posicion === "Añadir valor al final") {
    e[header] = e[header] + " " + value;
  }
  return e;
};

const updateAll = async (data, header, value, posicion, restring = false) => {
  return data.map((e) => {
    if (!restring || e[restring.keyRest] === restring.value) {
      return rplace(e, header.replaceAll('"', ""), value, posicion);
    } else return e;
  });
};

const deleteRow = async (data, query) => {
  return data.filter((e) => {
    let is = 0;
    query.forEach((q) => {
      if (e[q.key] === q.value) {
        is++;
      }
    });
    const save = is === query.length ? false : true;
    !save && console.log(chalk(e[0] + " eliminado"));
    return save;
  });
};

const filterValues = async (data, key) => {
  const r = [];
  data.forEach((e) => {
    if (r.indexOf(e[key]) === -1) {
      r.push(e[key]);
    }
  });
  return r;
};

const options = async function (headers, data) {
  const { type: tarea } = await queryParams("list", "Que quieres hacer:", [
    "Actualizar valor en todos los productos",
    "Actualizar valor por key",
    "Eliminar fila"
  ]);
  if (tarea === "Eliminar fila") {
    const query = [];
    let fin = false;
    while (!fin) {
      const { type: key } = await queryParams(
        "list",
        "Selecciona header a buscar:",
        headers
      );

      let { type: value } = await queryParams("text", "Escribe un valor:");
      query.push({ key: key.replaceAll('"', ""), value });
      const { type: cont } = await queryParams("list", "Terminar:", [
        "Añadir restricción",
        "Terminar"
      ]);
      if (cont === "Terminar") {
        fin = true;
      }
    }
    data = await deleteRow(data, query);
    return data;
  } else {
    const { type: key } = await queryParams(
      "list",
      "Selecciona header a actualizar:",
      headers
    );
    const { type: value } = await queryParams("text", "Escribe un valor:");
    const { type: posicion } = await queryParams(
      "list",
      "Donde lo quieres añadir:",
      [
        "Reemplazar el valor",
        "Añadir valor al principo",
        "Añadir valor al final"
      ]
    );
    switch (tarea) {
      case "Actualizar valor en todos los productos":
        data = await updateAll(data, key, value, posicion, false);
        break;
      case "Actualizar valor por key":
        const { type } = await queryParams("list", "Valor a restingir:", [
          "Seleccionar",
          "Introducir"
        ]);
        let rest = {};
        if (type === "Introducir") {
          const { type: keyRest } = await queryParams(
            "list",
            "Selecciona header a restringir:",
            headers
          );
          const { type: valueRest } = await queryParams(
            "text",
            "Escribe un valor:"
          );
          rest = { keyRest, value: valueRest };
        } else {
          rest = await selectKeyVal();
        }
        data = await updateAll(data, key, value, posicion, rest);
        break;
      default:
        break;
    }
    return data;
  }
};

const start = async (path, fileName) => {
  const { headers, data } = await createCSVObjt(path, fileName);
  let newData = data;
  let fin = false;
  while (!fin) {
    newData = await options(headers, newData);
    const { type: cont } = await queryParams("list", "Terminar:", [
      "Actualizar nuevo dato",
      "Terminar"
    ]);
    if (cont === "Terminar") {
      await writeCSV(path, newData, "-updated-" + getdate() + "-" + fileName);
      fin = true;
    }
  }
};

export const editCSV = async (path, fileName) => {
  await start(path, fileName);
};
