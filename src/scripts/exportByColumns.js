import { queryParams } from "./common/queryParams.js";
import { queryRestringRows } from "./common/queryRestringRows.js";
import { writeCSV } from "./common/writeCSV.js";





const options = async function (headers, data) {
    const query = await queryRestringRows(headers, data);

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
  
  export const exportByColumns = async (path, fileName, headers, data) => {
    await start(path, fileName, headers, data);
  };