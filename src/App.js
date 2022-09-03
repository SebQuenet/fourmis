import { v4 as uuidv4 } from "uuid";
import { hex, rgb } from "color-convert";

import "./App.css";
import AntHill from "./components/Anthill";

const DEFAULT_SPEED = 1;
const DEFAULT_ENERGY = 2;

let ants = [
  {
    id: "73948400-5866-49c0-8f61-af44f17b3a87",
    x: 60,
    y: 110,
    direction: Math.PI / 2,
    speed: DEFAULT_SPEED,
    energy: DEFAULT_ENERGY,
    isTired: false,
    color: "#44CCCC",
    canBreed: false,
    bredRest: 0,
    size: 1,
    age: 1,
    maturity: "child",
  },
  {
    id: "73a97ab7-7328-4823-9469-68832d0d08d8",
    x: 110,
    y: 60,
    direction: Math.PI / 2,
    speed: DEFAULT_SPEED,
    energy: DEFAULT_ENERGY,
    isTired: false,
    color: "#CCCC44",
    canBreed: false,
    bredRest: 0,
    size: 1,
    age: 1,
    maturity: "child",
  },
  {
    id: "d00c60d3-523f-4f7f-a59d-72a6ce8335cb",
    x: 60,
    y: 60,
    direction: Math.PI / 2,
    speed: DEFAULT_SPEED,
    energy: DEFAULT_ENERGY,
    isTired: false,
    color: "#CC44CC",
    canBreed: false,
    bredRest: 0,
    size: 1,
    age: 1,
    maturity: "child",
  },
  {
    id: "40c9c1e7-42e4-46c2-8ab6-cc447c52d8e8",
    x: 50,
    y: 50,
    direction: Math.PI / 2,
    speed: DEFAULT_SPEED,
    energy: DEFAULT_ENERGY,
    isTired: false,
    color: "#4444CC",
    canBreed: false,
    bredRest: 0,
    size: 1,
    age: 1,
    maturity: "child",
  },
  {
    id: "86dcc793-5c7b-4a81-ba79-235dc66b89e1",
    x: 10,
    y: 10,
    direction: 0,
    speed: DEFAULT_SPEED,
    energy: DEFAULT_ENERGY,
    isTired: false,
    color: "#44CC44",
    canBreed: false,
    bredRest: 0,
    size: 2,
    age: 1,
    maturity: "child",
  },
  {
    id: "fe167419-9123-4ca1-b2b8-6DEFAULT_ENERGY9a525b424",
    x: 150,
    y: 10,
    direction: 0,
    speed: DEFAULT_SPEED,
    energy: DEFAULT_ENERGY,
    isTired: false,
    color: "#CC4444",
    canBreed: false,
    bredRest: 0,
    size: 1,
    age: 1,
    maturity: "child",
  },
];

function App() {
  const draw = (ctx, frameCount) => {
    ctx.beginPath();
    ctx.fillStyle = "#202020";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ants.forEach((ant) => {
      ant.age = ant.age + 1;
      if (ant.age < 200) {
        ant.maturity = "baby";
        ant.size = 1;
      } else if (ant.age < 600) {
        ant.maturity = "child";
        ant.size = 2;
      } else if (ant.age < 4000) {
        ant.maturity = "adult";
        ant.size = 3;
        ant.canBreed = true;
      } else if (ant.age < 5000) {
        ant.maturity = "elderly";
        ant.size = 2;
        ant.canBreed = false;
        ant.speed = 1;
        ant.energy = 5;
      } else {
        ant.isDead = true;
      }
    });

    ants = ants.filter((ant) => !ant.isDead);
    ants.forEach((ant) => {
      ctx.beginPath();
      ctx.fillStyle = ant.color;
      ctx.strokeStyle = "#ffffff";
      ctx.arc(ant.x, ant.y, ant.size, 0, 2 * Math.PI);
      ctx.fill();
      if (ant.bredRest > 0) {
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });

    ants.forEach((ant) => {
      if (!ant.isTired) {
        ant.x = ant.x + Math.cos(ant.direction) * ant.speed;
        ant.y = ant.y + Math.sin(ant.direction) * ant.speed;
      }
    });

    ants.forEach((ant) => {
      if (ant.x > 500) {
        ant.direction = Math.PI;
      }
      if (ant.x < 0) {
        ant.direction = 0;
      }
      if (ant.y > 500) {
        ant.direction = (3 * Math.PI) / 2;
      }
      if (ant.y < 0) {
        ant.direction = Math.PI / 2;
      }

      ant.direction =
        -Math.PI / 18 + (Math.random() * Math.PI) / 9 + ant.direction;

      if (ant.bredRest > 0) {
        ant.bredRest = ant.bredRest - 1;
      }
    });

    ants.forEach((ant) => {
      if (ant.energy >= 0 && !ant.isTired) {
        ant.energy = ant.energy - ant.speed;
        if (ant.energy <= 0) {
          ant.isTired = true;
        }
      }

      if (ant.isTired && ant.energy <= 10) {
        ant.energy = ant.energy + 1;
        if (ant.energy >= 10) {
          ant.isTired = false;
        }
      }
    });

    ants.forEach((ant) => {
      if (ant.isTired && ant.canBreed && ant.bredRest === 0) {
        ants.forEach((otherAnt) => {
          if (
            ant.id !== otherAnt.id &&
            otherAnt.isTired &&
            otherAnt.canBreed &&
            otherAnt.bredRest === 0
          ) {
            if (
              Math.abs(otherAnt.x - ant.x) < 30 &&
              Math.abs(otherAnt.y - ant.y) < 30
            ) {
              ant.bredRest = 800;
              otherAnt.bredRest = 800;

              const [r1, g1, b1] = hex.rgb(ant.color.substring(1));
              const [r2, g2, b2] = hex.rgb(otherAnt.color.substring(1));

              const rgbNewAnt = [
                Math.floor(Math.sqrt((r1 * r1 + r2 * r2) / 2)),
                Math.floor(Math.sqrt((g1 * g1 + g2 * g2) / 2)),
                Math.floor(Math.sqrt((b1 * b1 + b2 * b2) / 2)),
              ];

              const newAnt = {
                id: uuidv4(),
                x: Math.floor(ant.x + otherAnt.x) / 2,
                y: Math.floor(ant.y + otherAnt.y) / 2,
                direction: 0,
                speed: Math.floor(ant.speed + otherAnt.speed) / 2,
                energy: 0,
                isTired: true,
                color: `#${rgb.hex(rgbNewAnt)}`,
                canBreed: false,
                hasBred: false,
                size: 1,
                age: 0,
              };
              ants.push(newAnt);
            }
          }
        });
      }
    });
  };

  return (
    <div className="App">
      <AntHill draw={draw} />
    </div>
  );
}

export default App;
