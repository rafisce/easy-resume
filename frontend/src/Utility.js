import moment from "moment";

export const formatToIL = (input) => {
  const output = moment(new Date(input), "LLLL", "he").format("DD/MM/YYYY");
  return output;
};

export const getData = (url) => {};
