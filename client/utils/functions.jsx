import date from "date-and-time";
import dayjs from "dayjs";

// ------
export const generateRandomNumber = () => {
  const min = 100000;
  const max = 999999;
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNumber;
};

// ------
export const serialNo = (page) => {
  const slNo = Number(page) === 1 || !page ? 1 : (Number(page) - 1) * 10 + 1;
  return slNo;
};

// ------
export const dateFormat = (value) => {
  const formatted = new Date(value);
  return date.format(formatted, "DD-MM-YYYY");
};

// ------
export const dateFormatFancy = (value) => {
  const formatted = new Date(value);
  return date.format(formatted, "ddd, MMM DD YYYY");
};

// ------
export const datePickerFormat = (value) => {
  const formatted = new Date(value);
  return date.format(formatted, "YYYY-MM-DD");
};

// ------
export const getFileExtension = (fileName) => {
  return fileName.split(".").pop();
};

// ------
export const currentDate = () => {
  return dayjs(new Date()).format("YYYY-MM-DD");
};

// ------
export const compareFormatDate = (value) => {
  return dayjs(value).format("YYYY-MM-DD");
};

// ------
export const randomBadgeBg = () => {
  const colorArray = [
    "blue",
    "azure",
    "indigo",
    "purple",
    "pink",
    "red",
    "orange",
    "yellow",
    "lime",
    "green",
    "teal",
    "cyan",
  ];
  const randomIndex = Math.floor(Math.random() * colorArray.length);
  return colorArray[randomIndex];
};

// ------
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

// ------
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

// ------
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

// ------
export const titleExtension = (value) => {
  let title = "";
  switch (value) {
    case "/admin":
      title = import.meta.env.VITE_ADMIN_TITLE;
      break;
    case "/lead":
      title = import.meta.env.VITE_LEAD_TITLE;
      break;
    case "/user":
      title = import.meta.env.VITE_USER_TITLE;
      break;
    default:
      title = import.meta.env.VITE_COMMON_TITLE;
      break;
  }
  return title;
};

// ------
export const initials = (value) => {
  const arr = value.split(" ");
  let word = "";
  if (arr.length > 1) {
    arr.map((i) => {
      word += i[0];
    });
  } else {
    word = value.substr(0, 2);
  }
  return word;
};

// ------
export const timeDifference = (startTime, endTime) => {
  const start = dayjs(`2024-01-01 ${startTime}`);
  const end = dayjs(`2024-01-01 ${endTime}`);

  const differ = end.diff(start, "minutes", true);
  let hours, minutes, label;

  if (differ >= 60) {
    hours = Math.floor(differ / 60);
    minutes = differ % 60;
    label = hours + ` Hr ` + (minutes ? minutes + ` Min` : ``);
  } else {
    label = differ + ` Min`;
  }
  return label;
};

// ------
export const lastSixMonths = () => {
  const currentDate = dayjs();
  let result = [];
  for (let i = 5; i >= 0; i--) {
    const date = currentDate.subtract(i, "month");
    result.push(date.format("MMM"));
  }
  return result;
};
