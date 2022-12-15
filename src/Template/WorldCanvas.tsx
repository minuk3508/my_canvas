import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { changeLineColor, changeLineWeight, changeToolMode_erase } from "../Store/Atom";
import Toolbar from "../Component/Toolbar";

export default function WorldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [getCtx, setGetCtx] = useState<CanvasRenderingContext2D>();
  const [getOverlayCtx, setGetOverlayCtx] = useState<CanvasRenderingContext2D>();
  const [painting, setPainting] = useState<boolean>(false);
  const [eraseMode] = useRecoilState(changeToolMode_erase);
  const [color] = useRecoilState(changeLineColor);
  const [weight] = useRecoilState(changeLineWeight);
  const [startPoint, setStartPoint] = useState<number[]>([0, 0]);
  const [endPoint, setEndPoint] = useState<number[]>([0, 0]);

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
        // customCtx.lineWidth = weight;
        // customCtx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
        setGetCtx(customCtx);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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

  useEffect(() => {
    if (getCtx !== undefined) {
      getCtx.lineWidth = weight;
      getCtx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
      getCtx.strokeRect(
        startPoint[0],
        startPoint[1],
        endPoint[0] - startPoint[0],
        endPoint[1] - startPoint[1]
      );
    }
  }, [painting]);
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

  const drawLineFn = (event: React.SyntheticEvent<HTMLCanvasElement, MouseEvent>) => {
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

  // const drawSquareFn = (event: React.SyntheticEvent<HTMLCanvasElement, MouseEvent>) => {
  //   const currentPoint_X = event.nativeEvent.offsetX;
  //   const currentPoint_Y = event.nativeEvent.offsetY;
  //   const customCtx = getCtx;

  //   if (!painting && customCtx !== undefined) {
  //     console.log(startPoint, endPoint);
  //     setStartPoint([currentPoint_X, currentPoint_Y]);
  //     setEndPoint([currentPoint_X, currentPoint_Y]);
  //   } else if (painting && customCtx !== undefined) {
  //     setEndPoint([currentPoint_X, currentPoint_Y]);

  //     customCtx.strokeRect(
  //       startPoint[0],
  //       startPoint[1],
  //       endPoint[0] - startPoint[0],
  //       endPoint[1] - startPoint[1]
  //     );
  //   }
  // };

  return (
    <Container ref={scrollRef}>
      <Toolbar />

      <Canvas
        ref={canvasRef}
        // onMouseDown={() => setPainting(true)}
        // onMouseUp={() => setPainting(false)}
        // onMouseMove={drawLineFn}
        // onMouseLeave={() => setPainting(false)}
      ></Canvas>
      <OverlayCanvas
        ref={overlayCanvasRef}
        onMouseDown={() => setPainting(true)}
        onMouseUp={() => setPainting(false)}
        onMouseMove={overlayDrawSquareFn}
        onMouseLeave={() => setPainting(false)}
      ></OverlayCanvas>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
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
