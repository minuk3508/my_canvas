import React, { useCallback, useEffect, useRef, useState } from "react";
import { ColorResult, RGBColor, SketchPicker } from "react-color";
import styled from "styled-components";
import { BiEraser } from "react-icons/bi";

type ColorPickerProps = {
  color: string;
};
type ModColor = {
  changeColor: string;
};

const DEFAULT_COLOR = { r: 0, g: 0, b: 0, a: 1 };

export default function Template() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [getCtx, setGetCtx] = useState<CanvasRenderingContext2D>();
  const [painting, setPainting] = useState<boolean>(false);
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [eraseMode, setEraseMode] = useState(false);
  const [color, setColor] = useState<RGBColor>(DEFAULT_COLOR);

  const handleClick = useCallback(() => {
    setDisplayColorPicker((prev) => !prev);
  }, []);

  const handleChange = useCallback((color: ColorResult) => {
    setColor(color.rgb);
  }, []);

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
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      if (ctx !== null) {
        const customCtx = ctx;
        customCtx.lineJoin = "round";
        customCtx.lineWidth = 1.5;
        changeColor(customCtx);
        setGetCtx(ctx);
      }
    }
  }, []);

  useEffect(() => {
    if (getCtx !== undefined && eraseMode) {
      const customCtx = getCtx;
      customCtx.strokeStyle = `rgba( 237, 237, 237, 1 )`;
      setGetCtx(customCtx);
    } else if (getCtx !== undefined) {
      const customCtx = getCtx;
      changeColor(customCtx);
      setGetCtx(customCtx);
    }
  }, [color, eraseMode]);

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
  const transformToEraseMode = () => {
    setEraseMode((prev) => !prev);
    setDisplayColorPicker(false);
  };
  return (
    <Container>
      <Toolbar>
        <ColorPickerBox>
          <NowColor color={`${color.r}, ${color.g}, ${color.b}`} onClick={handleClick} />
          {displayColorPicker ? (
            <ColorChoiceBox>
              <SketchPicker color={color} onChange={(color) => handleChange(color)} />
            </ColorChoiceBox>
          ) : null}
        </ColorPickerBox>
        <EraserBox onClick={transformToEraseMode} changeColor={eraseMode ? "red" : "white"}>
          <BiEraser />
        </EraserBox>
      </Toolbar>

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
const EraserBox = styled.div<ModColor>`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 25px;
  height: 25px;
  font-size: 25px;
  border-radius: 50%;
  background-color: ${(props) => props.changeColor};
  transition: 0.3s all;
  :hover {
    cursor: pointer;
  }
`;
const ColorPickerBox = styled.div`
  position: relative;
  width: 25px;
  height: 25px;
  border-radius: 50%;
`;
const NowColor = styled.div<ColorPickerProps>`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: rgb(${(props) => props.color});
  transition: 0.3s all;
  :hover {
    cursor: pointer;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  }
`;
const ColorChoiceBox = styled.div`
  position: absolute;
  top: 0%;
  left: 150%;
`;
const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
`;
const Canvas = styled.canvas`
  box-sizing: content-box;
  width: 100%;
  height: 100%;
  background-color: #ededed;
`;

const Toolbar = styled.div`
  position: absolute;
  left: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 40px;
  height: 250px;
  padding: 15px 0px;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
`;
