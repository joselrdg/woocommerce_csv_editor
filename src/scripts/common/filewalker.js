import readdirp from "readdirp";

export function filewalker(dir, props) {
  return new Promise((resolve) => {
    const data = [];
    readdirp(dir, props)
      .on("data", (entry) => {
        const {
          path,
          // stats: { size },
        } = entry;
        data.push(path);
      })
      .on("warn", (error) => console.error("non-fatal error", error))
      .on("error", (error) => console.error("fatal error", error))
      .on("end", () => resolve(data));
  });
}
