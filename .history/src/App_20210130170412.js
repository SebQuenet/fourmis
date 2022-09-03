import './App.css';
import AntHill from './components/Anthill';

function App() {


  const draw = (ctx, frameCount) => {
    ctx.beginPath()
    ctx.fillStyle = '#202020';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.fillStyle = '#4444CC'
    ctx.arc(50 + frameCount, 100, 1, 0, 2 * Math.PI)
    ctx.fill()
  }

  return (
    <div className="App">
      <AntHill draw={draw} />

    </div>
  );
}

export default App;
