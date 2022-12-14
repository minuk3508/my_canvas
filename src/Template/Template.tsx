import React, { useCallback, useEffect, useRef, useState } from "react";
import { ColorResult, RGBColor, SketchPicker } from "react-color";
import styled, { keyframes } from "styled-components";
import { BiEraser } from "react-icons/bi";
import { MdLineWeight } from "react-icons/md";

type ColorPickerProps = {
  color: string;
};
type ModColor = {
  changeColor: string;
};

const DEFAULT_COLOR = { r: 0, g: 0, b: 0, a: 1 };
const DEFAULT_WEIGHT = 1.5;

export default function Template() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [getCtx, setGetCtx] = useState<CanvasRenderingContext2D>();
  const [painting, setPainting] = useState<boolean>(false);
  const [displayColorPicker, setDisplayColorPicker] = useState<boolean>(false);
  const [eraseMode, setEraseMode] = useState<boolean>(false);
  const [weightChange, setWeightChange] = useState<boolean>(false);
  const [color, setColor] = useState<RGBColor>(DEFAULT_COLOR);
  const [weight, setWeight] = useState<number>(DEFAULT_WEIGHT);

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
  const changeWeight = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      ctx.lineWidth = weight;
    },
    [weight]
  );
  useEffect(() => {
    if (canvasRef.current !== null) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (ctx !== null) {
        const customCtx = ctx;
        customCtx.lineCap = "round";
        customCtx.lineJoin = "round";
        changeWeight(customCtx);
        changeColor(customCtx);
        setGetCtx(ctx);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color, eraseMode]);

  useEffect(() => {
    if (getCtx !== undefined) {
      const customCtx = getCtx;
      changeWeight(customCtx);
      setGetCtx(customCtx);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weight]);

  const drawFn = (event: React.SyntheticEvent<HTMLCanvasElement, MouseEvent>) => {
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

  const clicked = (e: React.SyntheticEvent<HTMLDivElement, MouseEvent>) => {
    setWeightChange((prev) => !prev);
    setDisplayColorPicker(false);
  };
  const onChangeNumberWeight = (e: any) => {
    const numbering = Number(e.target.value);
    setWeight(numbering);
  };
  const onChangeRangeWeight = (e: any) => {
    const numbering = Number(e.target.value);
    setWeight(numbering);
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
        <WeightSettingBox>
          <WeightButton onClick={clicked} changeColor={weightChange ? "red" : "white"}>
            <MdLineWeight />
          </WeightButton>

          {weightChange ? (
            <WeightSetting>
              <WeightRange type="range" onChange={onChangeRangeWeight} value={weight} />
              <WeightText type="type" onChange={onChangeNumberWeight} value={weight} />
            </WeightSetting>
          ) : null}
        </WeightSettingBox>
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

const WeightRange = styled.input`
  width: 130px;
`;
const WeightText = styled.input`
  width: 30px;
  -webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  -webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const widthAnimation = keyframes`
  0%{
    width: 0px;
  }
  100%{
    width: 200px;
  }
`;

const WeightSetting = styled.div`
  position: absolute;
  overflow: hidden;
  display: flex;
  justify-content: space-around;
  align-items: center;
  top: 0%;
  left: 150%;
  width: 200px;
  height: 45px;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  animation: ${widthAnimation} 0.2s linear;
  :hover {
    cursor: default;
  }
`;

const WeightSettingBox = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 25px;
  height: 25px;
  font-size: 23px;
  border-radius: 50%;
  transition: 0.3s all;
  :hover {
    cursor: pointer;
  }
`;

const WeightButton = styled.div<ModColor>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  font-size: 25px;
  border-radius: 50%;
  background-color: ${(props) => props.changeColor};
  transition: 0.3s all;
  :hover {
    cursor: pointer;
  }
`;

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
  width: ${window.innerWidth};
  height: ${window.innerHeight};
  background-color: #ededed;
`;

const Toolbar = styled.div`
  position: absolute;
  left: 10px;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  align-items: center;
  width: 40px;
  height: 250px;
  padding: 15px 0px;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
`;
