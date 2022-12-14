import React, { useCallback, useEffect, useRef, useState } from "react";
import reactCSS from "reactcss";
import { ColorResult, RGBColor, SketchPicker } from "react-color";
import styled from "styled-components";

export default function Template() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [getCtx, setGetCtx] = useState<CanvasRenderingContext2D>();
  const [painting, setPainting] = useState<boolean>(false);
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [color, setColor] = useState<RGBColor>({
    r: 0,
    g: 0,
    b: 0,
    a: 1,
  });

  const handleClick = useCallback(() => {
    setDisplayColorPicker((prev) => !prev);
  }, []);

  const handleClose = useCallback(() => {
    setDisplayColorPicker(false);
  }, []);

  const handleChange = useCallback((color: ColorResult) => {
    setColor(color.rgb);
  }, []);
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
  const changeColor = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
    },
    [color]
  );
  useEffect(() => {
    if (canvasRef.current !== null) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = 700;
      canvas.height = 700;

      if (ctx !== null) {
        const customCtx = ctx;
        customCtx.lineJoin = "round";
        customCtx.lineWidth = 5;
        changeColor(customCtx);
        setGetCtx(ctx);
      }
    }
  }, []);

  useEffect(() => {
    if (getCtx !== undefined) {
      const customCtx = getCtx;
      changeColor(customCtx);
      setGetCtx(customCtx);
    }
  }, [color]);

  const drawFn = (event: React.SyntheticEvent<HTMLCanvasElement, MouseEvent>) => {
    console.log(event.nativeEvent);
    const mouseX = event.nativeEvent.offsetX;
    const mouseY = event.nativeEvent.offsetY;

    if (!painting && getCtx !== undefined) {
      getCtx.beginPath();
      getCtx.moveTo(mouseX, mouseY);
    } else if (painting && getCtx !== undefined) {
      getCtx.lineTo(mouseX, mouseY);
      getCtx.stroke();
    }
  };

  return (
    <Container>
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

      <Canvas
        ref={canvasRef}
        onMouseDown={() => setPainting(true)}
        onMouseUp={() => setPainting(false)}
        onMouseMove={drawFn}
        onMouseLeave={() => setPainting(false)}
      ></Canvas>
    </Container>
  );
}
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
`;
const Canvas = styled.canvas`
  box-sizing: content-box;
  width: 700px;
  height: 700px;
  border: 5px solid black;
`;
