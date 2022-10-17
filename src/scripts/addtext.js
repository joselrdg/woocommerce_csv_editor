const options = async function (headers, data) {
  const { type: tarea } = await queryParams("list", "Que quieres hacer:", [
    "Actualizar valor en todos los productos",
    "Actualizar valor por key",
    "Eliminar fila"
  ]);
  if (tarea === "Eliminar fila") {
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
      await writeCSV(path, newData, "-updated-" + getdate() + "-" + fileName);
      fin = true;
    }
  }
};

export const addtext = async (path, fileName, headers, data) => {
  start(path, fileName, headers, data);
};
