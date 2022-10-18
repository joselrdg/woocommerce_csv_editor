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

const insertTXT = async (headers, data, goal, restring) => {};
const insertHTML = async (headers, data, goal, restring) => {
  const html = await getHTML();
  const newData = data.map((e) => {
    let is = 0;
    query.forEach((q) => {
      if (e[q.key] === q.value) {
        is++;
      }
    });
    if (query.length ? true : false) {
      
    }
    return e;
  });
};

const options = async function (headers, data) {
  const restring = await queryRestringRows(headers, data);
  console.log(restring);
  const { type } = await queryParams("list", "Que quieres insertar:", [
    "HTML",
    "TXT"
  ]);
  const { type: goalType } = await queryParams(
    "list",
    "Con respecto a que o donde queieres insertar:",
    ["Palabras", "Linea", "Nº caracter", "Principio", "Fnal"]
  );

  const { type: goal } = await QPosition(goal, type);
  console.log(index);

  if (type === "HTML") {
    return await insertHTML(headers, data, { type: goalType, goal }, restring);
  } else {
    return await insertTXT(headers, data, { type: goalType, goal }, restring);
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
