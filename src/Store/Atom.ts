import { RGBColor } from "react-color";
import { atom } from "recoil";
const DEFAULT_COLOR = { r: 0, g: 0, b: 0, a: 1 };
const DEFAULT_WEIGHT = 1.5;

export const changeToolMode_erase = atom({
  key: "changeToolMode_erase",
  default: false,
});

export const changeLineColor = atom({
  key: "changeLineColor",
  default: DEFAULT_COLOR as RGBColor,
});

export const changeLineWeight = atom({
  key: "changeLineWeight",
  default: DEFAULT_WEIGHT as number,
});
