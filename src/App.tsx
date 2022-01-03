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
  const range = useInput('2.5');
  const {
    canvasRef,
    mouseDraw,
    startMouseDrawing,
    finishMouseDrawing,
    touchDraw,
    startTouchDrawing,
    finishTouchDrawing,
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
        className={styles.canvas}
        width={500}
        height={500}
      ></canvas>
      <div className={styles.buttons}>
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
          ></li>
        ))}
      </ul>
    </div>
  );
}

export default App;
