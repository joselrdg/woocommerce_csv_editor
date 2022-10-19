import { queryParams } from "./queryParams.js";

const filterValues = async (data, key) => {
  const r = [];
  console.log(key)
  data.forEach((e) => {
    if (r.indexOf(e[key]) === -1) {
      r.push(e[key]);
    }
  });
  console.log(r)
  return r;
};

const selectValue = async (data, key) => {
  const { type: opt } = await queryParams(
    "list",
    "Introduce valor o selecciona entre los existentes:",
    ["Seleccionar", "Introducir"]
  );
  if (opt === "Seleccionar") {
    return await queryParams(
      "list",
      "Selecciona valor:",
      await filterValues(data, key)
    );
  } else return await queryParams("text", "Escribe un valor:");
};

export const queryRestringRows = async (headers, data) => {
  const query = [];
  let fin = false;
  while (!fin) {
    const { type: key } = await queryParams(
      "list",
      "Selecciona header para restringir:",
      headers
    );
    const { type: value } = await selectValue(data, key);
    // query.push({ key: key.replaceAll('"', ""), value });
    query.push({ key, value });
    const { type: cont } = await queryParams("list", "Terminar:", [
      "Añadir restricción",
      "Terminar"
    ]);
    if (cont === "Terminar") {
      fin = true;
    }
  }
  return query;
};
