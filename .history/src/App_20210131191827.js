import './App.css';
import AntHill from './components/Anthill';

const ants = [{
  x: 50,
  y: 50,
  direction: 0,
  speed: 1,
  color: '#4444CC',
}, {
  x: 100,
  y: 100,
  direction: 0,
  speed: 2,
  color: '#44CC44',
}, {
  x: 150,
  y: 100,
  direction: 0,
  speed: 1.5,
  color: '#CC4444',
},
];

function App() {

  const draw = (ctx, frameCount) => {
    ctx.beginPath()
    ctx.fillStyle = '#202020';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ants.forEach(ant => {
      ctx.beginPath();
      ctx.fillStyle = ant.color;
      ctx.arc(ant.x, ant.y, 1, 0, 2 * Math.PI);
      ctx.fill()
    });

    ants.forEach(ant => {
      ant.x = ant.x + Math.cos(ant.direction);
      ant.y = ant.y + Math.sin(ant.direction);
    });

    ants.forEach(ant => {
      if (ant.x > 500) {
        ant.direction = Math.PI;
      }
      if (ant.x < 0) {
        ant.direction = 0;
      }
    });
  }

  return (
    <div className="App">
      <AntHill draw={draw} />

    </div>
  );
}

export default App;
