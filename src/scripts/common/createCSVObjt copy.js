import fs from "fs";

const formatLine = (line) => {
  let strF = line;
  let count = strF.indexOf('"');
  let formatRow = "";
  while (count > -1) {
    formatRow += strF.slice(0, count);
    strF = strF.slice(count + 1);
    count = strF.indexOf('"');
    formatRow += strF.slice(0, count).replaceAll(",", "[AaMm]");
    strF = strF.slice(count + 1);
    count = strF.indexOf('"');
  }
  return (formatRow += strF);
};

const createCSVOjtR = async (data) => {
  const dataVariables = [];
  const allRows = data.toString().split(/\r?\n|\r/);
  const headers = allRows[0].replaceAll('"', "").split(",");
  // const headers = allRows[0].split(",");

  const totalHead = headers.length;
  console.log("Total de Headers: " + totalHead);

  for (var singleRow = 1; singleRow < allRows.length; singleRow++) {
    // console.log(singleRow + "\n");
    if (allRows[singleRow]) {
      const formatRow = formatLine(allRows[singleRow]);
      const dataRow = formatRow.split(",");
      const totalRow = dataRow.length;
      const datosTubo = {};
      for (let column = 0; column < totalHead; column++) {
        const header = headers[column];
        // const header = headers[column].replaceAll('"', "");
        datosTubo[header] = dataRow[column]
          ? dataRow[column].replaceAll("[AaMm]", ",")
          : "";
      }
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
