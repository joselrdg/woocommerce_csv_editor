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
      return await queryParams("text", "Introduce número de linea:");
    case "Nº caracter":
      return await queryParams("text", "Introduce número de caracter:");
    case "Principio" || "Fnal":
      return 0;
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

// const isRow = async (e, query) => {
//   let is = 0;
//   query.forEach((q) => {
//     if (e[q.key] === q.value) {
//       e[q.key] && is++;
//     }
//   });
//   return is === query.length ? true : false;
// };

const insertTXT = async (headers, data, goal, query, column) => {};
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
  const { type } = await queryParams("list", "Que quieres insertar:", [
    "HTML",
    "TXT"
  ]);
  const typesTxt =
    type === "TXT"
      ? ["Palabras", "Linea", "Nº caracter", "Principio", "Fnal"]
      : ["Palabras", "Linea", "Nº caracter"];
  const { type: goalType } = await queryParams(
    "list",
    "Con respecto a que o donde queieres insertar:",
    typesTxt
  );

  const { type: goal } = await QPosition(goalType, type);

  if (type === "HTML") {
    return await insertHTML(
      headers,
      data,
      { type: goalType, goal: Number(goal) },
      query,
      column
    );
  } else {
    return await insertTXT(
      headers,
      data,
      { type: goalType, goal: Number(goal) },
      query,
      column
    );
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
