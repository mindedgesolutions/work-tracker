import { nanoid } from "nanoid";

export const projectModes = [
  {
    id: nanoid(),
    value: 1,
    text: `New Development`,
  },
  {
    id: nanoid(),
    value: 2,
    text: `Maintenance`,
  },
];

export const projectDepartments = [
  {
    id: nanoid(),
    value: 1,
    text: `West Bengal Labour Commission`,
  },
];

export const timeUnits = [
  { id: nanoid(), value: "day", text: "Day/s" },
  { id: nanoid(), value: "hr", text: "Hour/s" },
];
