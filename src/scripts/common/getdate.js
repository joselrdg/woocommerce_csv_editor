export const getdate = () => {
  const date = new Date();
  const fecha = date.toJSON().slice(0, 19);;
  return fecha;
};
