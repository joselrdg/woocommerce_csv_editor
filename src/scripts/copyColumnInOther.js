import { isRow } from "./common/isRow.js";
import { queryParams } from "./common/queryParams.js";
import { queryRestringRows } from "./common/queryRestringRows.js";
import { writeCSV } from "./common/writeCSV.js";

const rplace = (e, header, value, posicion) => {
  if (posicion === "Reemplazar el valor") {
    e[header] = value;
  } else if (posicion === "Añadir valor al principo") {
    e[header] = value + e[header];
  } else if (posicion === "Añadir valor al final") {
    e[header] = e[header] + value;
  }
  return e;
};

const updateAll = async (data, query, columnCopy, columnGoal, posicion) => {
  const newData = [];
  for (let i = 0; i < data.length; i++) {
    const e = data[i];
    const is = await isRow(e, query);
    if (is) {
      newData.push(await rplace(e, columnGoal, e[columnCopy], posicion));
    } else newData.push(e);
  }
  return newData;
};

const options = async function (headers, data) {
  const query = await queryRestringRows(headers, data);
  const { type: columnCopy } = await queryParams(
    "list",
    "Que columna quieres copiar:",
    headers
  );
  const { type: columnGoal } = await queryParams(
    "list",
    "Cual es la columna de destino:",
    headers
  );
  const { type: posicion } = await queryParams(
    "list",
    "Donde lo quieres añadir:",
    ["Reemplazar el valor", "Añadir valor al principo", "Añadir valor al final"]
  );

  return await updateAll(data, query, columnCopy, columnGoal, posicion);
};

const start = async (path, fileName, headers, data) => {
  let newData = data;
  let fin = false;
  while (!fin) {
    newData = await options(headers, newData);
    const { type: cont } = await queryParams("list", "Terminar:", [
      "Actualizar nuevo dato",
      "Terminar"
    ]);
    if (cont === "Terminar") {
      await writeCSV(path, newData);
      fin = true;
    }
  }
};

export const copyColumnInOther = async (path, fileName, headers, data) => {
  start(path, fileName, headers, data);
};
