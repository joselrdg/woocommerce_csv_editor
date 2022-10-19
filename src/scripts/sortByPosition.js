import { isRow } from "./common/isRow.js";
import { queryParams } from "./common/queryParams.js";
import { queryRestringRows } from "./common/queryRestringRows.js";
import { writeCSV } from "./common/writeCSV.js";

let posicion = 0;
const addPosition = async (p, e) => {
  e[p] = posicion;
  posicion++;
  return e;
};

const ordenar = async (data, column, direccion) => {
  if (direccion === "<") {
    return await data.sort((a, b) => a[column] - b[column]);
  } else {
    return await data.sort((a, b) => b[column] - a[column]);
  }
};

const options = async function (headers, data) {
  const query = await queryRestringRows(headers, data);
  const { type: column } = await queryParams(
    "list",
    "Selecciona columna de referencia para ordenar:",
    headers
  );
  const { type: direccion } = await queryParams("list", "Dirección:", [
    "<",
    ">"
  ]);
  const { type: p } = await queryParams(
    "list",
    'Selecciona columna "Posición" o "Position":,',
    headers
  );
  const { type: id } = await queryParams(
    "list",
    'Selecciona columna "ID":,',
    headers
  );
  const { type: addnumb } = await queryParams(
    "list",
    "Empezar por un número?:,",
    ["Sí", "No"]
  );
  if (addnumb === "Sí") {
    const { type: n } = await queryParams("text", "Inserta el número:");
    posicion = Number(n);
  }

  const dataSort = await ordenar([...data], column, direccion);
  for (let i = 0; i < dataSort.length; i++) {
    const e = dataSort[i];
    const is = await isRow(e, query);
    if (is) {
      await addPosition(p, e);
    }
  }
  dataSort.forEach((sort) => {
    data.forEach((e) => {
      if (sort[id] === e[id]) {
        e[p] === sort[id];
      }
    });
  });
  return data;
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

export const sortByPosition = async (path, fileName, headers, data) => {
  await start(path, fileName, headers, data);
};
