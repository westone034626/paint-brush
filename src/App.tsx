import styles from './App.module.css';
import { useCanvas } from './hooks';

export enum COLORS {
  BLACK = '#2C2C2C',
  WHITE = 'white',
  RED = '#FF3B30',
  ORANGE = '#FF9500',
  YELLOW = '#FFCC00',
  GREEN = '#4CD963',
  SKYBLUE = '#5AC8FA',
  BLUE = '#0579FF',
  INDIGO = '#5856D6',
}

function App() {
  const colors = [
    '#2C2C2C',
    'white',
    '#FF3B30',
    '#FF9500',
    '#FFCC00',
    '#4CD963',
    '#5AC8FA',
    '#0579FF',
    '#5856D6',
  ] as COLORS[];
  const {
    canvasRef,
    lineWidth,
    isPaintMode,
    color,
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
    save,
    undo,
    redo,
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
        <button onClick={save}>save</button>
        <button onClick={undo}>undo</button>
        <button onClick={redo}>redo</button>
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
        {colors.map((c) => {
          const isSelectedColor = c === color;

          return (
            <li
              key={c}
              className={
                isSelectedColor
                  ? `${styles.color} ${styles.selected}`
                  : styles.color
              }
              style={{ backgroundColor: c }}
              onClick={() => {
                changeColor(c);
              }}
            >
              {isSelectedColor && (
                <div
                  style={{
                    color: c === COLORS.WHITE ? COLORS.BLACK : COLORS.WHITE,
                    fontWeight: 'bold',
                  }}
                >
                  ✓
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;
