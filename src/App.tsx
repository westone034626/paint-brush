import styles from './App.module.css';
import { useCanvas, useInput } from './hooks';

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
  const range = useInput({ initialState: '2.5' });
  const {
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
  } = useCanvas();
  changeWidth(Number(range.value));
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
        className={styles.canvas}
      ></canvas>
      <div className={styles.buttons}>
        <button onClick={clear}>clear</button>
        <button>fill</button>
        <button>save</button>
      </div>
      <input type="range" min={0.1} max={5} step={0.1} {...range} />
      <ul className={styles.colors}>
        {colors.map((color) => (
          <li
            key={color}
            className={styles.color}
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
