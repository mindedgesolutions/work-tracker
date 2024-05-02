import date from "date-and-time";

export const generateRandomNumber = () => {
  const min = 100000;
  const max = 999999;
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNumber;
};

export const serialNo = (page) => {
  const slNo = Number(page) === 1 || !page ? 1 : (Number(page) - 1) * 10 + 1;
  return slNo;
};

export const dateFormat = (value) => {
  const formatted = new Date(value);
  return date.format(formatted, "DD-MM-YYYY");
};

export const dateFormatFancy = (value) => {
  const formatted = new Date(value);
  return date.format(formatted, "ddd, MMM DD YYYY");
};

export const datePickerFormat = (value) => {
  const formatted = new Date(value);
  return date.format(formatted, "YYYY-MM-DD");
};

export const getFileExtension = (fileName) => {
  return fileName.split(".").pop();
};

export const randomBadgeBg = () => {
  const colorArray = ["azure", "purple", "pink", "yellow", "green", "cyan"];
  const randomIndex = Math.floor(Math.random() * colorArray.length);
  return colorArray[randomIndex];
};

export const roleBadge = (value) => {
  let badge;
  switch (value) {
    case "Super Admin":
      badge = "success";
      break;
    case "Admin":
      badge = "danger";
      break;
    case "Project Manager":
      badge = "purple";
      break;
    case "Team Leader":
      badge = "indigo";
      break;
    case "Web Developer":
      badge = "yellow";
      break;
    case "Web Designer":
      badge = "green";
      break;
    case "Mobile App Developer":
      badge = "cyan";
      break;

    default:
      badge = "warning";
      break;
  }
  return badge;
};

export const priorityBadge = (value) => {
  let badge;
  switch (value) {
    case 1:
      badge = "success";
      break;
    case 2:
      badge = "warning";
      break;
    case 3:
      badge = "primary";
      break;
    default:
      badge = "success";
      break;
  }
  return badge;
};

export const priorityTextColor = (value) => {
  let textClass = "";
  switch (value) {
    case "High":
      textClass = `text-danger`;
      break;
    case "Medium":
      textClass = `text-primary`;
      break;
    case "Low":
      textClass = `text-success`;
      break;

    default:
      textClass = `text-success`;
      break;
  }
  return <span className={`ms-1 fw-bolder ${textClass}`}>({value})</span>;
};
