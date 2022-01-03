import { useEffect, useRef, useState } from 'react';

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

interface IUseToggle {
  initialValue?: boolean;
}

const useToggle = ({ initialValue }: IUseToggle = {}) => {
  const [value, setValue] = useState(initialValue ?? true);
  const toggle = () => {
    setValue((prev) => !prev);
  };
  return { value, toggle };
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
  const [strokeColor, setStrokeColor] = useState('black');
  const [filledColor, setFilledColor] = useState('white');
  const [lineWidth, setLineWidth] = useState(2.5);
  const { value: isPaintMode, toggle: toggleMode } = useToggle({
    initialValue: true,
  });

  const save = () => {
    const image = canvasRef.current?.toDataURL();
    const link = document.createElement('a');
    link.href = image as string;
    link.download = 'paint-brush';
    link.click();
  };

  const changeColor = (color: string) => {
    isPaintMode ? setStrokeColor(color) : setFilledColor(color);
  };
  const changeWidth = (width: number) => {
    setLineWidth(width);
  };
  const changeMode = () => {
    toggleMode();
  };
  const fillColor = () => {
    if (isPaintMode) return;
    if (canvasRef.current && contextRef.current) {
      contextRef.current.fillRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
    }
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
      contextRef.current.fillStyle = filledColor;
    }
  };
  const setCanvas = () => {
    if (!canvasRef.current) return;
    canvasRef.current.style.touchAction = 'none';
    canvasRef.current.style.width = '100%';
    canvasRef.current.width = canvasRef.current.clientWidth;
    canvasRef.current.height =
      (heightRatio / widthRatio) * canvasRef.current.clientWidth;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = strokeColor;
    ctx.fillStyle = filledColor;
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    contextRef.current = ctx;
  };
  const setCanvasContext = () => {
    if (!contextRef.current) return;
    contextRef.current.lineWidth = 2.5;
    contextRef.current.strokeStyle = strokeColor;
    contextRef.current.fillStyle = filledColor;
    contextRef.current.lineWidth = lineWidth;
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

  useEffect(() => {
    setCanvasContext();
  }, [strokeColor, filledColor, lineWidth]);
  const mouseDraw = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    const {
      nativeEvent: { offsetX, offsetY },
    } = event;
    if (isMouseDrawing && isPaintMode) {
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
    if (isTouchDrawing && isPaintMode) {
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
    isPaintMode,
    lineWidth,
    filledColor,
    strokeColor,
    mouseDraw,
    startMouseDrawing,
    finishMouseDrawing,
    touchDraw,
    startTouchDrawing,
    finishTouchDrawing,
    changeColor,
    changeWidth,
    clear,
    changeMode,
    fillColor,
    save,
  };
};
