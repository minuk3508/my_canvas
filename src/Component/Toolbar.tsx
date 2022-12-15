import React, { useState, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import { BiEraser, BiSquare } from "react-icons/bi";
import { MdLineWeight } from "react-icons/md";
import { useRecoilState } from "recoil";
import { changeLineColor, changeLineWeight, changeToolMode } from "../Store/Atom";
import { ColorResult, SketchPicker } from "react-color";

type ColorPickerProps = {
  color: string;
};
type ModColor = {
  changeColor: string;
};

export default function Toolbar() {
  const [mode, setMode] = useRecoilState(changeToolMode);
  const [color, setColor] = useRecoilState(changeLineColor);
  const [weight, setWeight] = useRecoilState(changeLineWeight);
  const [displayColorPicker, setDisplayColorPicker] = useState<boolean>(false);
  const [weightChange, setWeightChange] = useState<boolean>(false);

  const handleClick = useCallback(() => {
    setDisplayColorPicker((prev) => !prev);
  }, []);

  const handleChange = useCallback((color: ColorResult) => {
    setColor(color.rgb);
  }, []);

  const transformToEraseMode = () => {
    setMode({ mode: "erase" });
    setDisplayColorPicker(false);
  };
  const transformToSquareMode = () => {
    if (mode.mode !== "square") {
      setMode({ mode: "square" });
      setDisplayColorPicker(false);
    } else {
      setMode({ mode: "line" });
    }
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
      <ColorPickerBox>
        <NowColor color={`${color.r}, ${color.g}, ${color.b}`} onClick={handleClick} />
        {displayColorPicker ? (
          <ColorChoiceBox>
            <SketchPicker color={color} onChange={(color) => handleChange(color)} />
          </ColorChoiceBox>
        ) : null}
      </ColorPickerBox>
      <EraserBox
        onClick={transformToEraseMode}
        changeColor={mode.mode === "erase" ? "red" : "white"}
      >
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
      <SquareModeButtonBox
        onClick={transformToSquareMode}
        changeColor={mode.mode === "square" ? "red" : "white"}
      >
        <BiSquare />
      </SquareModeButtonBox>
    </Container>
  );
}

const SquareModeButtonBox = styled.div<ModColor>`
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
const Container = styled.div`
  position: fixed;
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
  z-index: 2;
`;

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
