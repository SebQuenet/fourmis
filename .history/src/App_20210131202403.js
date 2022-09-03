import { v4 as uuidv4 } from 'uuid'

import './App.css';
import AntHill from './components/Anthill';

const ants = [{
  id: '40c9c1e7-42e4-46c2-8ab6-cc447c52d8e8',
  x: 50,
  y: 50,
  direction: Math.PI / 2,
  speed: 1,
  energy: 100,
  isTired: false,
  color: '#4444CC',
  canBreed: true,
  hasBred: false,
}, {
  id: '86dcc793-5c7b-4a81-ba79-235dc66b89e1',
  x: 100,
  y: 100,
  direction: 0,
  speed: 2,
  energy: 100,
  isTired: false,
  color: '#44CC44',
  canBreed: true,
  hasBred: false,
}, {
  id: 'fe167419-9123-4ca1-b2b8-6219a525b424',
  x: 150,
  y: 100,
  direction: 0,
  speed: 1.5,
  energy: 100,
  isTired: false,
  color: '#CC4444',
  canBreed: true,
  hasBred: false,
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
      if (!ant.isTired) {
        ant.x = ant.x + Math.cos(ant.direction) * ant.speed;
        ant.y = ant.y + Math.sin(ant.direction) * ant.speed;
      }
    });

    ants.forEach(ant => {
      if (ant.x > 500) {
        ant.direction = Math.PI;
      }
      if (ant.x < 0) {
        ant.direction = 0;
      }
      if (ant.y > 500) {
        ant.direction = 3 * Math.PI / 2;
      }
      if (ant.y < 0) {
        ant.direction = Math.PI / 2;
      }

      ant.direction = -Math.PI / 18 + Math.random() * Math.PI / 9 + ant.direction
    });

    ants.forEach(ant => {
      if (ant.energy >= 0 && !ant.isTired) {
        ant.energy = ant.energy - ant.speed;
        if (ant.energy <= 0) {
          ant.isTired = true;
        }
      }

      if (ant.isTired && ant.energy <= 100) {
        ant.energy = ant.energy + 1;
        if (ant.energy >= 100) {
          ant.isTired = false;
          ant.hasBred = false;
        }
      }

    });

    ants.forEach(ant => {
      if (ant.isTired && ant.canBreed && !ant.hasBred) {
        ants.forEach(otherAnt => {
          if (ant.id !== otherAnt.id && otherAnt.isTired && otherAnt.canBreed) {
            if (Math.abs(otherAnt.x - ant.x) < 100
              && Math.abs(otherAnt.y - ant.y) < 100
            ) {
              ant.hasBred = true;
              otherAnt.hasBred = true;
              const newAnt = {
                id: uuidv4(),
                x: Math.floor(ant.x + otherAnt.x) / 2,
                y: Math.floor(ant.y + otherAnt.y) / 2,
                direction: 0,
                speed: Math.floor(ant.speed + otherAnt.speed) / 2,
                energy: 0,
                isTired: true,
                color: '#FFFFFF',
                canBreed: false,
                hasBred: false,
              }
              ants.push(newAnt);
            }
          }
        })
      }
    }
    )
  }

  return (
    <div className="App">
      <AntHill draw={draw} />

    </div>
  );
}

export default App;
