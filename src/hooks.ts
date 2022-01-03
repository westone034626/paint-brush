import { useEffect, useLayoutEffect, useRef, useState } from 'react';

export const useInput = (initialState?: string) => {
  const [value, setValue] = useState<string>(initialState ?? '');
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value: v },
    } = event;

    setValue(v);
  };
  return { value, onChange };
};

export const useCanvas = (aspectRatio?: string) => {
  const [widthRatio, heightRatio] = (aspectRatio ?? '1 / 1')
    .split('/')
    .map((wAndH) => Number(wAndH.trim()));
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isMouseDrawing, setIsMouseDrawing] = useState(false);
  const [isTouchDrawing, setIsTouchDrawing] = useState(false);
  const changeColor = (color: string) => {
    if (contextRef.current) contextRef.current.strokeStyle = color;
  };
  const changeWidth = (width: number) => {
    if (contextRef.current) contextRef.current.lineWidth = width;
  };
  const setCanvas = () => {
    if (canvasRef.current) {
      canvasRef.current.style.touchAction = 'none';
      canvasRef.current.style.width = '100%';
      canvasRef.current.width = canvasRef.current.clientWidth;
      canvasRef.current.height =
        (heightRatio / widthRatio) * canvasRef.current.clientWidth;
      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.lineWidth = 2.5;
        context.strokeStyle = 'black';
        contextRef.current = context;
      }
    }
  };
  useEffect(() => {
    window.addEventListener('resize', setCanvas);
    return () => window.removeEventListener('resize', setCanvas);
  }, []);
  useLayoutEffect(() => {
    setCanvas();
  }, []);
  const mouseDraw = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    const {
      nativeEvent: { offsetX, offsetY },
    } = event;
    if (isMouseDrawing) {
      contextRef.current?.lineTo(offsetX, offsetY);
      contextRef.current?.stroke();
    }
  };
  const startMouseDrawing = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    setIsMouseDrawing(true);
    const {
      nativeEvent: { offsetX, offsetY },
    } = event;
    contextRef.current?.beginPath();
    contextRef.current?.moveTo(offsetX, offsetY);
  };
  const finishMouseDrawing = () => {
    if (contextRef.current) contextRef.current.closePath();
    setIsMouseDrawing(false);
  };
  const touchDraw = (event: React.TouchEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const { pageX, pageY } = event.nativeEvent.touches[0];
    const offsetX = pageX - rect.left;
    const offsetY = pageY - rect.top;
    if (isTouchDrawing) {
      contextRef.current?.lineTo(offsetX, offsetY);
      contextRef.current?.stroke();
    }
  };
  const startTouchDrawing = (event: React.TouchEvent<HTMLCanvasElement>) => {
    setIsTouchDrawing(true);
    const rect = event.currentTarget.getBoundingClientRect();
    const { pageX, pageY } = event.nativeEvent.touches[0];
    const offsetX = pageX - rect.left;
    const offsetY = pageY - rect.top;
    contextRef.current?.beginPath();
    contextRef.current?.moveTo(offsetX, offsetY);
  };
  const finishTouchDrawing = () => {
    if (contextRef.current) contextRef.current.closePath();
    setIsTouchDrawing(false);
  };
  return {
    canvasRef,
    contextRef,
    mouseDraw,
    startMouseDrawing,
    finishMouseDrawing,
    touchDraw,
    startTouchDrawing,
    finishTouchDrawing,
    changeColor,
    changeWidth,
  };
};
