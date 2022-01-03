import { useEffect, useLayoutEffect, useRef, useState } from 'react';

interface IUseInput {
  initialState?: string;
}

export const useInput = ({ initialState }: IUseInput = {}) => {
  const [value, setValue] = useState<string>(initialState ?? '');
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value: v },
    } = event;

    setValue(v);
  };
  return { value, onChange };
};

interface IUseCanvas {
  aspectRatio?: string;
}

export const useCanvas = ({ aspectRatio }: IUseCanvas = {}) => {
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
  const clear = () => {
    if (canvasRef.current && contextRef.current) {
      contextRef.current.fillStyle = 'white';
      contextRef.current.fillRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
    }
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
        context.fillStyle = 'white';
        context.fillRect(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        contextRef.current = context;
      }
    }
  };
  useEffect(() => {
    let windowWidth = window.innerWidth;
    window.addEventListener('resize', () => {
      if (windowWidth !== window.innerWidth) setCanvas();
    });
    return () =>
      window.removeEventListener('resize', () => {
        if (windowWidth !== window.innerWidth) setCanvas();
      });
  }, []);
  useEffect(() => {
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
    mouseDraw,
    startMouseDrawing,
    finishMouseDrawing,
    touchDraw,
    startTouchDrawing,
    finishTouchDrawing,
    changeColor,
    changeWidth,
    clear,
  };
};
