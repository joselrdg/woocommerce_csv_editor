import chalk from "chalk";
import { isRow } from "./common/isRow.js";
import { queryParams } from "./common/queryParams.js";
import { queryRestringRows } from "./common/queryRestringRows.js";
import { writeCSV } from "./common/writeCSV.js";

const getHTML = async () => {
  const { type: inicio } = await queryParams(
    "text",
    "Escribe etiqueta de apertura:"
  );
  const { type: cierre } = await queryParams(
    "text",
    "Escribe etiqueta de cierre:"
  );
  return [inicio, cierre];
};

const QPosition = async (goal, type) => {
  switch (goal) {
    case "Palabras":
      return await queryParams("text", "Introduce texto a buscar:");
    case "Linea":
      const linea = await queryParams("text", "Introduce número de linea:");
      return Number(linea);
    case "Nº caracter":
      const char = await queryParams("text", "Introduce número de caracter:");
      return Number(char);
  }
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

const updateForWord = async (e, goal, html, column) => {
  const value = e[column];
  const i = value.indexOf(goal);
  const f = i + goal.length;
  if (i === -1) {
    console.log(chalk.red("No se encontraron couincidencias en la columna"));
    process.exit();
  }
  e[column] =
    value.slice(0, i) + html[0] + value.slice(i, f) + html[1] + value.slice(f);
  return e;
};
const updateForLine = async (e, goal, html, column) => {
  const values = e[column].split("\\n");
  values[goal] = html[0] + values[goal] + html[1];
  e[column] = values.join("\\n");
  return e;
};
const updateForChar = async (e, goal, html, column) => {
  console.log(chalk.red("No esta terminado"));
  process.exit();
};

const updateDataHTML = async (e, goal, html, column) => {
  switch (goal.type) {
    case "Palabras":
      return await updateForWord(e, goal.goal, html, column);
    case "Linea":
      return await updateForLine(e, goal.goal - 1, html, column);
    case "Nº caracter":
      return await updateForChar(e, goal.goal, html, column);
  }
};

const deleteTXTForWord = async (e, goal, column) => {
  const value = e[column];
  const i = value.indexOf(goal);
  if (i === -1) {
    console.log(chalk.red("No se encontraron couincidencias en la columna"));
    process.exit();
  }
  e[column] = value.replace(goal, "");
  return e;
};

const deleteTXTForLine = async (e, goal, column, indexFinal) => {
  const values = e[column].split("\\n");
  console.log(values);
  const valOk = [];
  const fin =
    indexFinal === NaN || indexFinal === 0 ? values.length : indexFinal;
  for (let i = 0; i < values.length; i++) {
    if (i < goal) {
      valOk.push(values[i]);
    } else if (i > fin) {
      valOk.push(values[i]);
    }
  }
  e[column] = valOk.join("\\n");
  console.log(valOk);
  process.exit();
  return e;
};
const deleteTXTForChar = async (e, goal, column, indexFinal) => {
  console.log(chalk.red("No esta terminado"));
  process.exit();
};

const optDeleteTXT = async (e, goal, column) => {
  switch (goal.type) {
    case "Palabras":
      return await deleteTXTForWord(e, goal.goal, column);
    case "Linea":
      const { type: indexLineaFinal } = await queryParams(
        "text",
        "Introduce el número de la última linea hasta la que borrar incluida (0 o dejar en blanco borra hasta el final):"
      );
      return await deleteTXTForLine(
        e,
        goal.goal - 1,
        column,
        Number(indexLineaFinal)
      );
    case "Nº caracter":
      const { type: indexCharFinal } = await queryParams(
        "text",
        "Introduce el número del último caracter hasta el que borrar incluido (0 o dejar en blanco borra hasta el final):"
      );
      return await deleteTXTForChar(
        e,
        goal.goal,
        column,
        Number(indexCharFinal)
      );
  }
};

const deleteTXT = async (headers, data, goal, query, column) => {
  const newData = [];
  for (let i = 0; i < data.length; i++) {
    const e = data[i];
    const is = await isRow(e, query);
    if (is) {
      newData.push(await optDeleteTXT(e, goal, column));
    } else newData.push(e);
  }
  return newData;
};

const insertTXT = async (headers, data, goal, query, column) => {
  console.log(chalk.red("No esta terminado"));
  process.exit();
};

const deleteHTML = async (headers, data, goal, query, column) => {
  console.log(chalk.red("No esta terminado"));
  process.exit();
};

const insertHTML = async (headers, data, goal, query, column) => {
  const html = await getHTML();
  const newData = [];
  for (let i = 0; i < data.length; i++) {
    const e = data[i];
    const is = await isRow(e, query);
    if (is) {
      newData.push(await updateDataHTML(e, goal, html, column));
    } else newData.push(e);
  }
  return newData;
};

const options = async function (headers, data) {
  const query = await queryRestringRows(headers, data);
  const { type: column } = await queryParams(
    "list",
    "Que columna quieres actualizar:",
    headers
  );
  const { type: b } = await queryParams("list", "Que quieres hacer:", [
    "Eliminar contenido",
    "Añadir contenido"
  ]);
  const borrar = b === "Eliminar contenido" ? true : false;

  const { type } = await queryParams("list", "Que quieres modificar:", [
    "HTML",
    "TXT"
  ]);

  const { type: goalType } = await queryParams(
    "list",
    "Con respecto a que o donde queieres insertar:",
    ["Palabras", "Linea", "Nº caracter"]
  );

  const { type: goal } = await QPosition(goalType, type);

  const params = [headers, data, { type: goalType, goal }, query, column];

  if (type === "HTML") {
    if (!borrar) {
      return await insertHTML(...params);
    } else return await deleteHTML(...params);
  } else {
    if (!borrar) {
      return await insertTXT(...params);
    } else return await deleteTXT(...params);
  }
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

export const modifyDescription = async (path, fileName, headers, data) => {
  start(path, fileName, headers, data);
};
