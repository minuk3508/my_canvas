import { RGBColor } from "react-color";
import { atom } from "recoil";
const DEFAULT_COLOR = { r: 0, g: 0, b: 0, a: 1 };
const DEFAULT_WEIGHT = 1.5;

export interface toolMode {
  mode: "line" | "erase" | "square" | "circle";
}

export const changeToolMode = atom<toolMode>({
  key: "changeToolMode",
  default: { mode: "line" },
});

export const changeLineColor = atom({
  key: "changeLineColor",
  default: DEFAULT_COLOR as RGBColor,
});

export const changeLineWeight = atom({
  key: "changeLineWeight",
  default: DEFAULT_WEIGHT as number,
});
