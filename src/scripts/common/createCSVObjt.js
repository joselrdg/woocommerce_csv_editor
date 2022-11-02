import fs from "fs";

const formatLine = (line) => {
  let strF = line;
  let count = strF.indexOf('"');
  let formatRow = "";
  while (count > -1) {
    formatRow += strF.slice(0, count + 1).replace('"', "'");
    strF = strF.slice(count + 1);
    count = strF.indexOf('"');
    formatRow += strF.slice(0, count).replaceAll(",", "[AaMm]");
    strF = strF.slice(count).replace('"', "'");
    count = strF.indexOf('"');
  }
  return (formatRow += strF).replaceAll("'", '"');
};

const createCSVOjtR = async (data) => {
  const dataVariables = [];
  const allRows = data.toString().split(/\r?\n|\r/);
  const headers = allRows[0].replaceAll('"', "").split(",");

  const totalHead = headers.length;
  console.log("Total de Headers: " + totalHead);

  let line = "";
  let rowOk = true;

  for (var singleRow = 1; singleRow < allRows.length; singleRow++) {
    let formatRow = formatLine(
      line + (rowOk ? "" : "\n") + allRows[singleRow]
    );
    const dataRow = formatRow.split(",");
    const totalRow = dataRow.length;
    if (totalHead !== totalRow) {
      rowOk = false;
      line = formatRow;
    } else {
      rowOk = true;
      line = "";
      const datosTubo = {};
      for (let column = 0; column < totalHead; column++) {
        const header = headers[column];
        // const header = headers[column].replaceAll('"', "");
        datosTubo[header] = dataRow[column]
          ? dataRow[column].replaceAll("[AaMm]", ",")
          : "";
      }
      console.log(datosTubo);
      process.exit();
      dataVariables.push(datosTubo);
    }
  }
  return { headers, data: dataVariables };
};

const start = async (data) => {
  return await createCSVOjtR(data);
};

export function createCSVObjt(path, fileName) {
  return new Promise((resolve) => {
    const dataa = [];
    fs.readFile(path + fileName, "utf-8", (err, data) => {
      if (err) console.log(err);
      else {
        resolve(start(data, path, fileName));
      }
    });
  });
}
