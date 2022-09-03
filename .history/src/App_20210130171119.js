import './App.css';
import AntHill from './components/Anthill';

const ants = [{
  x: 50,
  y: 50,
}, {
  x: 100,
  y: 100,
},
];

function App() {

  const draw = (ctx, frameCount) => {
    ctx.beginPath()
    ctx.fillStyle = '#202020';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.fillStyle = '#4444CC'
    ctx.arc(ants[0].x, ants[0].y, 1, 0, 2 * Math.PI)
    ctx.arc(ants[1].x, ants[1].y, 1, 0, 2 * Math.PI)
    ctx.fill()
  }

  return (
    <div className="App">
      <AntHill draw={draw} />

    </div>
  );
}

export default App;
