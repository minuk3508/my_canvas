import React, { useState } from "react";
import reactCSS from "reactcss";
import { ColorResult, RGBColor, SketchPicker } from "react-color";

export default function Color() {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [color, setColor] = useState<RGBColor>({
    r: 241,
    g: 112,
    b: 19,
    a: 1,
  });

  const handleClick = () => {
    setDisplayColorPicker((prev) => !prev);
  };

  const handleClose = () => {
    setDisplayColorPicker(false);
  };

  const handleChange = (color: ColorResult) => {
    setColor(color.rgb);
  };
  const styles = reactCSS({
    default: {
      color: {
        width: "36px",
        height: "14px",
        borderRadius: "2px",
        background: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`,
      },
      swatch: {
        padding: "5px",
        background: "#fff",
        borderRadius: "1px",
        boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
        display: "inline-block",
        cursor: "pointer",
      },
      //   popover: {
      //     position: 'absolute',
      //     zIndex: '2',
      //   },
      //   cover: {
      //     position: "fixed",
      //     top: '0px',
      //     right: '0px',
      //     bottom: '0px',
      //     left: '0px',
      //   },
    },
  });

  return (
    <div>
      <div style={styles.swatch} onClick={handleClick}>
        <div style={styles.color} />
      </div>
      {displayColorPicker ? (
        <div>
          <div onClick={handleClose} />
          <SketchPicker color={color} onChange={(color) => handleChange(color)} />
        </div>
      ) : null}
    </div>
  );
}
