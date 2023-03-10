/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { changeLineColor, changeLineWeight, changeToolMode, toolMode } from "../Store/Atom";
import Toolbar from "../Component/Toolbar";

export default function WorldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const [getCtx, setGetCtx] = useState<CanvasRenderingContext2D>();
  const [getOverlayCtx, setGetOverlayCtx] = useState<CanvasRenderingContext2D>();
  const [painting, setPainting] = useState<boolean>(false);
  const [originalPaintingTrigger, setOriginalPaintingTrigger] = useState(false);
  const [mode] = useRecoilState(changeToolMode);
  const [color] = useRecoilState(changeLineColor);
  const [weight] = useRecoilState(changeLineWeight);
  const [startPoint, setStartPoint] = useState<number[]>([0, 0]);
  const [endPoint, setEndPoint] = useState<number[]>([0, 0]);

  const overlayDrawLineFn = (event: React.SyntheticEvent<HTMLCanvasElement, MouseEvent>) => {
    const currentPoint_X = event.nativeEvent.offsetX;
    const currentPoint_Y = event.nativeEvent.offsetY;

    if (!painting && getOverlayCtx !== undefined && getCtx !== undefined) {
      setStartPoint([currentPoint_X, currentPoint_Y]);
      getOverlayCtx.beginPath();
      getCtx.beginPath();
      getOverlayCtx.lineWidth = weight;
      getCtx.lineWidth = weight;
      getOverlayCtx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
      getCtx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
      getOverlayCtx.moveTo(startPoint[0], startPoint[1]);
      getCtx.moveTo(startPoint[0], startPoint[1]);
      setEndPoint([currentPoint_X, currentPoint_Y]);
    } else if (painting && getOverlayCtx !== undefined && getCtx !== undefined) {
      setEndPoint([currentPoint_X, currentPoint_Y]);
      getOverlayCtx.clearRect(0, 0, 3500, 2500);
      getOverlayCtx.lineTo(endPoint[0], endPoint[1]);
      getCtx.lineTo(endPoint[0], endPoint[1]);
      getOverlayCtx.stroke();
      getCtx.stroke();
    }
  };
  const overlayDrawSquareFn = (event: React.SyntheticEvent<HTMLCanvasElement, MouseEvent>) => {
    const currentPoint_X = event.nativeEvent.offsetX;
    const currentPoint_Y = event.nativeEvent.offsetY;
    const customCtx = getOverlayCtx;

    if (!painting && customCtx !== undefined && getCtx !== undefined) {
      customCtx.clearRect(0, 0, 3500, 2500);
      setStartPoint([currentPoint_X, currentPoint_Y]);
      setEndPoint([currentPoint_X, currentPoint_Y]);
      customCtx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
      customCtx.lineWidth = weight;
    } else if (painting && customCtx !== undefined && getCtx !== undefined) {
      setEndPoint([currentPoint_X, currentPoint_Y]);
      customCtx.clearRect(0, 0, 3500, 2500);
      customCtx.strokeRect(
        startPoint[0],
        startPoint[1],
        endPoint[0] - startPoint[0],
        endPoint[1] - startPoint[1]
      );
    }
  };
  const overlayDrawCircleFn = (event: React.SyntheticEvent<HTMLCanvasElement, MouseEvent>) => {
    const currentPoint_X = event.nativeEvent.offsetX;
    const currentPoint_Y = event.nativeEvent.offsetY;
    const customCtx = getOverlayCtx;

    if (!painting && customCtx !== undefined && getCtx !== undefined) {
      customCtx.clearRect(0, 0, 3500, 2500);
      setStartPoint([currentPoint_X, currentPoint_Y]);
      setEndPoint([currentPoint_X, currentPoint_Y]);
      customCtx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
      customCtx.lineWidth = weight;
    } else if (painting && customCtx !== undefined && getCtx !== undefined) {
      setEndPoint([currentPoint_X, currentPoint_Y]);
      customCtx.clearRect(0, 0, 3500, 2500);
      customCtx.beginPath();
      customCtx.arc(
        startPoint[0],
        startPoint[1],
        Math.abs(endPoint[0] - startPoint[0]) / 2,
        0,
        2 * Math.PI
      );
      customCtx.stroke();
    }
  };
  const originalCanvasDrawCircleFn = (context: CanvasRenderingContext2D) => {
    if (context !== undefined) {
      context.lineWidth = weight;
      context.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
      context.beginPath();
      context.arc(
        startPoint[0],
        startPoint[1],
        Math.abs(endPoint[0] - startPoint[0]) / 2,
        0,
        2 * Math.PI
      );
      context.stroke();
    }
  };
  const originalCanvasDrawSquareFn = (context: CanvasRenderingContext2D) => {
    if (context !== undefined) {
      context.lineWidth = weight;
      context.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
      context.strokeRect(
        startPoint[0],
        startPoint[1],
        endPoint[0] - startPoint[0],
        endPoint[1] - startPoint[1]
      );
    }
  };

  //????????? ?????? ??????
  useEffect(() => {
    if (canvasRef.current !== null) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = 3500;
      canvas.height = 2500;
      if (ctx !== null) {
        const customCtx = ctx;
        customCtx.lineCap = "round";
        customCtx.lineJoin = "round";
        setGetCtx(customCtx);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //overlay??? ????????? ??????
  useEffect(() => {
    if (overlayCanvasRef.current !== null) {
      const canvas = overlayCanvasRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = 3500;
      canvas.height = 2500;
      if (ctx !== null) {
        const customCtx = ctx;
        customCtx.lineCap = "round";
        customCtx.lineJoin = "round";
        customCtx.lineWidth = weight;
        customCtx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
        setGetOverlayCtx(customCtx);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //original canvas??? ?????????
  useEffect(() => {
    let toolMode = mode.mode;

    if (getCtx !== undefined)
      switch (toolMode) {
        case "square":
          originalCanvasDrawSquareFn(getCtx);
          break;
        case "circle":
          originalCanvasDrawCircleFn(getCtx);
          break;
      }
  }, [originalPaintingTrigger]);

  const modeChanger = (
    toolMode: toolMode,
    event: React.SyntheticEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    let mode = toolMode.mode;

    switch (mode) {
      case "line":
        overlayDrawLineFn(event);
        break;
      case "square":
        overlayDrawSquareFn(event);
        break;
      case "circle":
        overlayDrawCircleFn(event);
        break;
      case "erase":
        console.log("Mangoes and papayas are $2.79 a pound.");
        break;
      default:
        overlayDrawLineFn(event);
    }
  };
  const onMouseDown = () => {
    setPainting(true);
  };
  const onMouseUp = () => {
    setPainting(false);
    setOriginalPaintingTrigger((prev) => !prev);
  };
  const onMouseLeave = () => {
    setPainting(false);
  };

  return (
    <Container>
      <Toolbar />
      <Canvas ref={canvasRef}></Canvas>
      <OverlayCanvasWrapper ref={containerRef}>
        <OverlayCanvas
          ref={overlayCanvasRef}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
          onMouseMove={(event) => {
            modeChanger(mode, event);
          }}
        ></OverlayCanvas>
      </OverlayCanvasWrapper>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
`;
const OverlayCanvasWrapper = styled.div`
  position: absolute;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: content-box;
  width: 3500px;
  height: 2500px;
  background-color: rgba(255, 255, 255, 0);
`;
const OverlayCanvas = styled.canvas`
  position: absolute;
  box-sizing: content-box;
  width: 3500px;
  height: 2500px;
  background-color: rgba(255, 255, 255, 0);
`;
const Canvas = styled.canvas`
  position: absolute;
  box-sizing: content-box;
  width: 3500px;
  height: 2500px;
  background-color: #ededed;
`;
