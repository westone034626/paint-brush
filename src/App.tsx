import styles from './App.module.css';
import { useCanvas } from './hooks';

function App() {
  const colors = [
    'white',
    'black',
    'red',
    'green',
    'blue',
    'yellow',
    'teal',
    'tomato',
  ];
  const {
    canvasRef,
    lineWidth,
    isPaintMode,
    strokeColor,
    filledColor,
    mouseDraw,
    startMouseDrawing,
    finishMouseDrawing,
    touchDraw,
    startTouchDrawing,
    finishTouchDrawing,
    changeColor,
    changeWidth,
    changeMode,
    clear,
    fillColor,
  } = useCanvas();

  return (
    <div className={styles.container}>
      <canvas
        ref={canvasRef}
        onMouseMove={mouseDraw}
        onMouseDown={startMouseDrawing}
        onMouseUp={finishMouseDrawing}
        onTouchStart={startTouchDrawing}
        onTouchEnd={finishTouchDrawing}
        onTouchMove={touchDraw}
        onClick={fillColor}
        className={styles.canvas}
      ></canvas>
      <div className={styles.buttons}>
        <button onClick={clear}>clear</button>
        <button onClick={changeMode}>{isPaintMode ? 'fill' : 'paint'}</button>
        <button>save</button>
      </div>
      <input
        type="range"
        min={0.1}
        max={5}
        step={0.1}
        value={lineWidth}
        onChange={(e) => {
          const {
            target: { value },
          } = e;
          changeWidth(Number(value));
        }}
      />
      <ul className={styles.colors}>
        {colors.map((color) => (
          <li
            key={color}
            className={
              (isPaintMode && strokeColor === color) ||
              (!isPaintMode && filledColor === color)
                ? `${styles.color} ${styles.selected}`
                : styles.color
            }
            style={{ backgroundColor: color }}
            onClick={() => {
              changeColor(color);
            }}
          ></li>
        ))}
      </ul>
    </div>
  );
}

export default App;
