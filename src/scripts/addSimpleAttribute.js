import { isRow } from "./common/isRow.js";
import { queryParams } from "./common/queryParams.js";
import { queryRestringRows } from "./common/queryRestringRows.js";
import { writeCSV } from "./common/writeCSV.js";

const newColumsAttBis = async (headers) => {
  let { type: attName } = await queryParams(
    "list",
    'Selecciona último "Nombre del atributo":',
    headers
  );
  const numbStr = attName.trim().slice(attName.lastIndexOf(" ")).trim();
  const numero = Number(numbStr) + 1;
  let { type: attValue } = await queryParams(
    "list",
    'Selecciona último "Valor(es) del atributo":',
    headers
  );
  let { type: attVisible } = await queryParams(
    "list",
    'Selecciona último "Atributo visible":',
    headers
  );
  let { type: attGlobal } = await queryParams(
    "list",
    'Selecciona último "Atributo global":',
    headers
  );
  attName = attName.trim().replace(numbStr, numero);
  attValue = attValue.trim().replace(numbStr, numero);
  attVisible = attVisible.trim().replace(numbStr, numero);
  attGlobal = attGlobal.trim().replace(numbStr, numero);
  const colums = [attName, attValue, attVisible, attGlobal];
  console.log("Se añadiran las siguientes columnas:");
  console.log(colums);
  return colums;
};

const newColumsAtt = async (headers) => {
  const { type: att } = await queryParams(
    "list",
    "Selecciona ÚLTIMO ATRIBUTO:",
    headers
  );
  const numbStr = att.trim().slice(att.lastIndexOf(" ")).trim();
  const numero = Number(numbStr) + 1;
  const attName = "Nombre del atributo " + numero;
  const attValue = "Valor(es) del atributo " + numero;
  const attVisible = "Atributo visible " + numero;
  const attGlobal = "Atributo global " + numero;
  const colums = [attName, attValue, attVisible, attGlobal];
  console.log("Se añadiran las siguientes columnas:");
  console.log(colums);
  const { type: ok } = await queryParams("list", "Son correctas?:", [
    "Sí",
    "No"
  ]);
  if (ok === "Sí") {
    return colums;
  } else return await newColumsAttBis(headers);
};

const addValuesColumn = async (colums) => {
  const data = [];
  for (let i = 0; i < colums.length; i++) {
    const c = colums[i];
    const { type: value } = await queryParams(
      "text",
      `Escribe un valor para ${c}:`
    );
    data.push(value);
  }
  return data;
};

const addColumns = async (colums, values, e) => {
  for (let i = 0; i < colums.length; i++) {
    e[colums[i]] = values[i];
  }
};

const options = async function (headers, data) {
  const query = await queryRestringRows(headers, data);
  const colums = await newColumsAtt(headers);
  const values = await addValuesColumn(colums);
  for (let i = 0; i < data.length; i++) {
    const e = data[i];
    if (await isRow(e, query)) {
      await addColumns(colums, values, e);
    }
  }
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

export const addSimpleAttribute = async (path, fileName, headers, data) => {
  await start(path, fileName, headers, data);
};
