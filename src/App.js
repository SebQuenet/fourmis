import { v4 as uuidv4 } from "uuid";
import { hex, rgb } from "color-convert";

import "./App.css";
import AntHill from "./components/Anthill";
import { drawAnts } from "./drawAnts";

const DEFAULT_SPEED = 1;
const DEFAULT_ENERGY = 2;

export const SENSOR_AREA = 80;

const HEN_SIDE = "HEN_SIDE";
const VIPER_SIDE = "VIPER_SIDE";
const FOX_SIDE = "FOX_SIDE";

export const sides = {
  [HEN_SIDE]: {
    side: HEN_SIDE,
    color: "#995500",
    canKill: { [VIPER_SIDE]: true },
  },
  [VIPER_SIDE]: {
    side: VIPER_SIDE,
    color: "#44CC44",
    canKill: { [FOX_SIDE]: true },
  },
  [FOX_SIDE]: {
    side: FOX_SIDE,
    color: "#CC4444",
    canKill: { [HEN_SIDE]: true },
  },
};

export let displayAntenna = false;
export let displayWillBreed = false;
export let displaySensorArea = false;
export let displayEyes = true;
export let enablePrey = false;

export const listOfDeaths = [];

const areAntsSameGeneration = (ant, otherAnt) =>
  ant.generation === otherAnt.generation;
const areNotSameAnts = (ant, otherAnt) => ant.id !== otherAnt.id;
const canBothAntsBreed = (ant, otherAnt) => ant.canBreed && otherAnt.canBreed;
const areCloseEnough = (ant, otherAnt) =>
  Math.abs(otherAnt.x - ant.x) < 30 && Math.abs(otherAnt.y - ant.y) < 30;
const areAntsSameSide = (ant, otherAnt) => ant.side === otherAnt.side;

const isContactBetween = (ant, otherAnt) =>
  areCloseEnough(ant, otherAnt) && areNotSameAnts(ant, otherAnt);

const canBothAntsHaveBaby = (ant, otherAnt) =>
  ant.bredRest === 0 && otherAnt.bredRest === 0;

const canAntKillOtherAnt = (ant, otherAnt) =>
  ant.maturity === "adult" && sides[ant.side].canKill[otherAnt.side];

const isAntAdult = (ant) => ant.maturity === "adult";

const randomSide = () => {
  const sidesArray = Object.keys(sides);
  const randomIndex = Math.floor(Math.random() * sidesArray.length);
  return sidesArray[randomIndex];
};

const antFactory = ({ side }) => ({
  id: uuidv4(),
  x: Math.floor(Math.random() * 3600) + 200,
  y: Math.floor(Math.random() * 1600) + 200,
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
  generation: 1,
  side: side ? side : randomSide(),
});

export let ants = [];

for (var i = 0; i < 120; i++) {
  ants.push(antFactory({}));
}

document.addEventListener(
  "keydown",
  (e) => {
    if (e.key === "v") {
      ants.push(antFactory({ side: VIPER_SIDE }));
    }
    if (e.key === "f") {
      ants.push(antFactory({ side: FOX_SIDE }));
    }
    if (e.key === "h") {
      ants.push(antFactory({ side: HEN_SIDE }));
    }
    if (e.key === "b") {
      displayWillBreed = !displayWillBreed;
    }
    if (e.key === "a") {
      displayAntenna = !displayAntenna;
    }
    if (e.key === "s") {
      displaySensorArea = !displaySensorArea;
    }
    if (e.key === "e") {
      displayEyes = !displayEyes;
    }
    if (e.key === "k") {
      enablePrey = !enablePrey;
    }
  },
  false
);

const handleBirthday = () => {
  ants.forEach((ant) => {
    if (ant.bredRest > 0) {
      ant.bredRest = ant.bredRest - 1;
    }
    ant.age = ant.age + 1;
    if (ant.age < 100) {
      ant.maturity = "newborn";
      ant.size = 1;
      ant.speed = 0;
    } else if (ant.age < 200) {
      ant.maturity = "baby";
      ant.size = 2;
      ant.speed = DEFAULT_SPEED;
    } else if (ant.age < 600) {
      ant.maturity = "child";
      ant.size = 3;
      ant.speed = DEFAULT_SPEED + 1;
    } else if (ant.age < 4000) {
      ant.maturity = "adult";
      ant.size = 8;
      ant.canBreed = true;
      ant.speed = DEFAULT_SPEED + 2;
    } else if (ant.age < 5000) {
      ant.maturity = "elderly";
      ant.size = 5;
      ant.canBreed = false;
      ant.speed = 1;
      ant.energy = 5;
      ant.speed = DEFAULT_SPEED;
    } else {
      ant.isDead = true;
    }
  });
};

const handleDirectionChange = () => {
  ants.forEach((ant) => {
    const neighbors = ants.filter(
      (otherAnt) =>
        Math.abs(otherAnt.x - ant.x) < SENSOR_AREA &&
        Math.abs(otherAnt.y - ant.y) < SENSOR_AREA &&
        otherAnt.id !== ant.id
    );
    const adultNeighbors = neighbors.filter(
      (otherAnt) => isAntAdult(otherAnt) && otherAnt.id !== ant.id
    );

    const threats = adultNeighbors.filter((otherAnt) =>
      canAntKillOtherAnt(otherAnt, ant)
    );
    if (threats.length > 0) {
      const threat = threats[0];
      ant.direction = Math.PI + Math.atan2(threat.y - ant.y, threat.x - ant.x);
    }

    const mates = adultNeighbors.filter(
      (otherAnt) =>
        areAntsSameSide(ant, otherAnt) &&
        canBothAntsHaveBaby(ant, otherAnt) &&
        isAntAdult(ant)
    );
    if (mates.length > 0) {
      const mate = mates[0];
      ant.direction = Math.atan2(mate.y - ant.y, mate.x - ant.x);
    }

    if (enablePrey) {
      const preys = neighbors.filter((otherAnt) =>
        canAntKillOtherAnt(ant, otherAnt)
      );
      if (preys.length > 0) {
        const prey = preys[0];
        ant.direction = Math.atan2(prey.y - ant.y, prey.x - ant.x);
      }
    }

    if (ant.x > 4000) {
      ant.direction = Math.PI;
    }
    if (ant.x < 0) {
      ant.direction = 0;
    }
    if (ant.y > 2000) {
      ant.direction = (3 * Math.PI) / 2;
    }
    if (ant.y < 0) {
      ant.direction = Math.PI / 2;
    }

    ant.direction =
      -Math.PI / 18 + (Math.random() * Math.PI) / 9 + ant.direction;
  });
};

const handleMoveAnts = () => {
  ants.forEach((ant) => {
    if (!ant.isTired) {
      ant.x = ant.x + Math.cos(ant.direction) * ant.speed;
      ant.y = ant.y + Math.sin(ant.direction) * ant.speed;
    }
  });
};

const handleFatigue = () => {
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
};

function handleBirth(ant, otherAnt) {
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
    energy: DEFAULT_ENERGY,
    color: `#${rgb.hex(rgbNewAnt)}`,
    canBreed: false,
    hasBred: false,
    size: 1,
    age: 0,
    bredRest: 0,
    generation: ant.generation + 1,
    side: ant.side,
  };
  ants.push(newAnt);
}

const handleContacts = () => {
  ants.forEach((ant) => {
    ants.forEach((otherAnt) => {
      if (isContactBetween(ant, otherAnt)) {
        if (
          areAntsSameSide(ant, otherAnt) &&
          canBothAntsBreed(ant, otherAnt) &&
          canBothAntsHaveBaby(ant, otherAnt)
        ) {
          handleBirth(ant, otherAnt);
        } else {
          if (!areAntsSameSide(ant, otherAnt)) {
            if (canAntKillOtherAnt(ant, otherAnt) && isAntAdult(ant)) {
              otherAnt.isDead = true;
              listOfDeaths.push({ x: otherAnt.x, y: otherAnt.y });
            }
          }
        }
      }
    });
  });
};

const handleDeaths = () => {
  ants = ants.filter((ant) => !ant.isDead);
};

function App() {
  const draw = (ctx, frameCount) => {
    ctx.beginPath();
    ctx.fillStyle = "#202020";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.fillStyle = "#ffffff";
    ctx.fillText(frameCount, 10, 10);
    handleBirthday();
    handleDeaths();
    drawAnts(ctx, ants);
    handleDirectionChange();
    handleMoveAnts();
    handleContacts();
  };

  return (
    <div className="App">
      <AntHill draw={draw} />
    </div>
  );
}

export default App;
