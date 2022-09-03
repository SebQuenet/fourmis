import './App.css';
import AntHill from './components/Anthill';

const ants = [{
  x: 50,
  y: 50,
  color: '#4444CC',
}, {
  x: 100,
  y: 100,
  color: '#44CC44',
}, {
  x: 150,
  y: 100,
  color: '#CC4444',
},
];

function App() {

  const draw = (ctx, frameCount) => {
    ctx.beginPath()
    ctx.fillStyle = '#202020';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ants.forEach(ant => {
      console.log(ant.color);
      ctx.fillStyle = ant.color;
      ctx.arc(ant.x, ant.y, 1, 0, 2 * Math.PI)
      ctx.fill()
    });
  }

  return (
    <div className="App">
      <AntHill draw={draw} />

    </div>
  );
}

export default App;
