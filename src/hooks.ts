import { useLayoutEffect, useRef, useState } from 'react';

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

export const useCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const prepareCanvas = () => {
    if (canvasRef.current) {
      canvasRef.current.width = 500;
      canvasRef.current.height = 500;
      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.lineWidth = 2.5;
        context.strokeStyle = 'black';
        contextRef.current = context;
      }
    }
  };
  const draw = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const {
      nativeEvent: { offsetX, offsetY },
    } = event;
    if (isDrawing) {
      contextRef.current?.lineTo(offsetX, offsetY);
      contextRef.current?.stroke();
    }
  };
  const startDrawing = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    setIsDrawing(true);
    const {
      nativeEvent: { offsetX, offsetY },
    } = event;
    contextRef.current?.beginPath();
    contextRef.current?.moveTo(offsetX, offsetY);
  };
  const finishDrawing = () => {
    if (contextRef.current) contextRef.current.closePath();
    setIsDrawing(false);
  };
  useLayoutEffect(() => {
    prepareCanvas();
  }, []);
  return { canvasRef, contextRef, draw, startDrawing, finishDrawing };
};
