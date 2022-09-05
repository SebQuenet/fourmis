import { v4 as uuidv4 } from "uuid";
import { hex, rgb } from "color-convert";

import generateStupidName from "sillyname";

import "./App.css";
import AntHill from "./components/Anthill";
import { drawAnts } from "./drawAnts";
import { displayHelp } from "./displayHelp";

const DEFAULT_SPEED = 1;
const DEFAULT_ENERGY = 2;
const DEFAULT_FOOD = 4000;
const DEFAULT_HIT_POINTS = 100;
const DEFAULT_STRENGTH = 40;
const DEFAULT_REACH = 30;
const DEFAULT_DR = 5;

export const DEFAULT_SENSOR_AREA = 80;

export const NORMAL_MODE = "NORMAL_MODE";
export const FLEEING_MODE = "FLEEING_MODE";
export const HUNTING_MODE = "HUNTING_MODE";
export const MATING_MODE = "MATING_MODE";

export const HEN_SIDE = "HEN_SIDE";
export const VIPER_SIDE = "VIPER_SIDE";
export const FOX_SIDE = "FOX_SIDE";

const NUMBER_PER_SIDE = 30;

const FOOD_LOW = 1000;
const FOOD_BOOST_NEWBORN = 600;

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

export const maturities = {
  newborn: {
    size: 2,
  },
  baby: {
    size: 4,
  },
  child: {
    size: 5,
  },
  adult: {
    size: 8,
  },
  elderly: {
    size: 7,
  },
};

export let displayAnts = true;
export let displayAntenna = false;
export let displayWillBreed = false;
export let displaySensorArea = false;
export let displayEyes = true;
export let displayWalls = true;
export let enablePrey = false;
export let enableGate = false;
export let enableSenescence = true;
export let enableDieOnFood = true;
export let displayDebug = false;
export let displayFood = false;
export let enableChildKills = false;
export let isPaused = false;

const WALL_TEMPLATES = [
  [],
  [
    { x: 100, y: 1400, width: 3800, height: 10 },
    { x: 2000, y: 100, width: 10, height: 1300 },
  ],
  [
    { x: 1900, y: 0, width: 200, height: 950 },
    { x: 1900, y: 1050, width: 200, height: 950 },
  ],
  [
    { x: 2000, y: 0, width: 10, height: 2000, isGate: true },
    { x: 0, y: 1000, width: 4000, height: 10, isGate: true },
  ],
  [
    { x: 2000, y: 0, width: 10, height: 2000, isGate: true },
    { x: 1000, y: 1000, width: 2000, height: 10, isGate: true },
    { x: 1600, y: 1000, width: 800, height: 10 },
    { x: 1000, y: 600, width: 10, height: 800 },
    { x: 3000, y: 600, width: 10, height: 800 },
    { x: 1600, y: 400, width: 800, height: 10 },
    { x: 1600, y: 1600, width: 800, height: 10 },
    { x: 0, y: 600, width: 1000, height: 10 },
    { x: 3000, y: 1400, width: 1000, height: 10 },
  ],
];

export const listOfWalls =
  WALL_TEMPLATES[Math.floor(Math.random() * WALL_TEMPLATES.length)];

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

const canAntKillOtherAnt = (ant, otherAnt) => {
  if (
    !enableChildKills &&
    (otherAnt.maturity === "newborn" ||
      otherAnt.maturity === "baby" ||
      otherAnt.maturity === "child")
  ) {
    return false;
  }
  if (
    Math.sqrt((ant.x - otherAnt.x) ** 2 + (ant.y - otherAnt.y) ** 2) > ant.reach
  ) {
    return false;
  }
  return ant.maturity === "adult" && sides[ant.side].canKill[otherAnt.side];
};
const isAntAdult = (ant) => ant.maturity === "adult";

const randomSide = () => {
  const sidesArray = Object.keys(sides);
  const randomIndex = Math.floor(Math.random() * sidesArray.length);
  return sidesArray[randomIndex];
};

const antFactory = ({ side }) => ({
  id: uuidv4(),
  name: generateStupidName(),
  x: Math.floor(Math.random() * 3600) + 200,
  y: Math.floor(Math.random() * 1600) + 200,
  direction: Math.PI / 2,
  food: DEFAULT_FOOD,
  speed: DEFAULT_SPEED,
  energy: DEFAULT_ENERGY,
  hitPoints: DEFAULT_HIT_POINTS,
  strength: DEFAULT_STRENGTH,
  reach: DEFAULT_REACH,
  damageReduction: DEFAULT_DR,
  sensorArea: DEFAULT_SENSOR_AREA,
  isTired: false,
  color: "#44CCCC",
  canBreed: false,
  bredRest: 0,
  size: maturities["baby"].size,
  age: 1,
  maturity: "child",
  generation: 1,
  side: side ? side : randomSide(),
});

export let ants = [];

for (let i = 0; i < NUMBER_PER_SIDE; i++) {
  ants = [...ants, antFactory({ side: VIPER_SIDE })];
}
for (let i = 0; i < NUMBER_PER_SIDE; i++) {
  ants = [...ants, antFactory({ side: HEN_SIDE })];
}
for (let i = 0; i < NUMBER_PER_SIDE; i++) {
  ants = [...ants, antFactory({ side: FOX_SIDE })];
}

document.addEventListener(
  "keydown",
  (e) => {
    if (e.key === "v") {
      ants = [...ants, antFactory({ side: VIPER_SIDE })];
    }
    if (e.key === "f") {
      ants = [...ants, antFactory({ side: FOX_SIDE })];
    }
    if (e.key === "h") {
      ants = [...ants, antFactory({ side: FOX_SIDE })];
    }
    if (e.key === "b") {
      displayWillBreed = !displayWillBreed;
    }
    if (e.key === "a") {
      displayAnts = !displayAnts;
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
    if (e.key === "w") {
      displayWalls = !displayWalls;
    }
    if (e.key === "d") {
      displayDebug = !displayDebug;
    }
    if (e.key === "g") {
      enableGate = !enableGate;
    }
    if (e.key === "o") {
      displayFood = !displayFood;
    }
    if (e.key === "x") {
      enableDieOnFood = !enableDieOnFood;
    }
    if (e.key === "c") {
      enableSenescence = !enableSenescence;
    }
    if (e.key === "i") {
      enableChildKills = !enableChildKills;
    }
    if (e.key === " ") {
      isPaused = !isPaused;
    }
  },
  false
);

const handleBirthday = (frameCount) => {
  ants.forEach((ant) => {
    ant.oscillator = Math.cos(frameCount / 10);
    if (ant.bredRest > 0) {
      ant.bredRest = ant.bredRest - 1;
    }
    ant.age = ant.age + 1;
    if (ant.age < 200) {
      ant.maturity = "newborn";
    } else if (ant.age < 400) {
      ant.maturity = "baby";
    } else if (ant.age < 1200) {
      ant.maturity = "child";
    } else if (ant.age < 8000) {
      ant.maturity = "adult";
      ant.canBreed = true;
    } else if (ant.age < 10000 && enableSenescence) {
      ant.maturity = "elderly";
      ant.canBreed = false;
      ant.energy = 5;
    } else if (enableSenescence) {
      ant.isDead = true;
    }
  });
};

const handleDirectionChange = () => {
  ants.forEach((ant) => {
    if (ant.isTired) {
      return;
    }
    ant.mode = NORMAL_MODE;
    const neighbors = ants.filter(
      (otherAnt) =>
        Math.abs(otherAnt.x - ant.x) < ant.sensorArea &&
        Math.abs(otherAnt.y - ant.y) < ant.sensorArea &&
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
      ant.mode = FLEEING_MODE;
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
      ant.mode = MATING_MODE;
    }

    if (enablePrey || ant.food < FOOD_LOW) {
      const preys = neighbors.filter((otherAnt) =>
        canAntKillOtherAnt(ant, otherAnt)
      );
      if (preys.length > 0) {
        const prey = preys[0];
        ant.direction = Math.atan2(prey.y - ant.y, prey.x - ant.x);
        ant.mode = HUNTING_MODE;
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
    if (ant.isTired) {
      return;
    }
    let speedFactor;
    switch (ant.maturity) {
      case "newborn":
        speedFactor = 0;
        break;
      case "baby":
        speedFactor = 1;
        break;
      case "child":
        speedFactor = 2;
        break;
      case "adult":
        speedFactor = 3;
        break;
      case "elderly":
        speedFactor = 1;
        break;
      default:
        speedFactor = 1;
    }
    const wantedX = ant.x + Math.cos(ant.direction) * ant.speed * speedFactor;
    const wantedY = ant.y + Math.sin(ant.direction) * ant.speed * speedFactor;

    let isAntInsideWall = false;
    listOfWalls.forEach((wall) => {
      if (wall.isGate && !enableGate) {
        ant.x = wantedX;
        ant.y = wantedY;
        return;
      }
      if (
        wantedX >= wall.x &&
        wantedX <= wall.x + wall.width &&
        wantedY >= wall.y &&
        wantedY <= wall.y + wall.height
      ) {
        // ant.direction = Math.PI + Math.atan2(wall.y - ant.y, wall.x - ant.x);
        ant.direction = Math.PI + ant.direction;
        isAntInsideWall = true;
      }
    });

    if (!isAntInsideWall) {
      ant.x = wantedX;
      ant.y = wantedY;
    }
  });
};

const handleFatigue = () => {
  ants.forEach((ant) => {
    if (ant.brood > 0) {
      ant.brood = ant.brood - 1;
      ant.isTired = true;
    } else {
      ant.isTired = false;
    }
  });
};

function handleBirth(ant, otherAnt) {
  ant.bredRest = 400;
  otherAnt.bredRest = 400;

  const [r1, g1, b1] = hex.rgb(ant.color.substring(1));
  const [r2, g2, b2] = hex.rgb(otherAnt.color.substring(1));

  ant.brood = 100;
  otherAnt.brood = 100;

  const rgbNewAnt = [
    Math.floor(Math.sqrt((r1 * r1 + r2 * r2) / 2)),
    Math.floor(Math.sqrt((g1 * g1 + g2 * g2) / 2)),
    Math.floor(Math.sqrt((b1 * b1 + b2 * b2) / 2)),
  ];

  const speed =
    Math.floor(ant.speed + otherAnt.speed) / 2 - 0.5 + Math.random();
  const sensorArea = Math.floor(
    Math.floor(ant.sensorArea + otherAnt.sensorArea) / 2 - 4 + Math.random() * 8
  );
  const newAnt = {
    id: uuidv4(),
    name: generateStupidName(),
    x: Math.floor(ant.x + otherAnt.x) / 2,
    y: Math.floor(ant.y + otherAnt.y) / 2,
    direction: 0,
    brood: 0,
    sensorArea:
      sensorArea > DEFAULT_SENSOR_AREA ? sensorArea : DEFAULT_SENSOR_AREA,
    speed: speed > DEFAULT_SPEED ? speed : DEFAULT_SPEED,
    energy: DEFAULT_ENERGY,
    hitPoints: Math.floor(
      (ant.hitPoints + otherAnt.hitPoints) / 2 + Math.random() * 10 - 5
    ),
    strength: Math.floor(
      (ant.strength + otherAnt.strength) / 2 + Math.random() * 4 - 2
    ),
    reach: Math.floor((ant.reach + otherAnt.reach) / 2 + Math.random() * 4 - 2),
    damageReduction: Math.floor(
      (ant.damageReduction + otherAnt.damageReduction) / 2
    ),
    color: `#${rgb.hex(rgbNewAnt)}`,
    canBreed: false,
    hasBred: false,
    mode: NORMAL_MODE,
    size: maturities["baby"].size,
    age: 0,
    bredRest: 0,
    generation:
      ant.generation > otherAnt.generation
        ? ant.generation + 1
        : otherAnt.generation + 1,
    food: Math.floor(ant.food + otherAnt.food) / 2 + FOOD_BOOST_NEWBORN,
    side: ant.side,
  };
  ants = [...ants, newAnt];
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
              otherAnt.hitPoints = otherAnt.hitPoints - ant.strength;
              if (otherAnt.hitPoints <= 0) {
                otherAnt.isDead = true;
              }
              listOfDeaths.push({ x: otherAnt.x, y: otherAnt.y });
              ant.food = ant.food + otherAnt.food / 2;
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
const drawWalls = (ctx) => {
  if (displayWalls) {
    listOfWalls.forEach((wall) => {
      if (wall.isGate && !enableGate) {
        ctx.fillStyle = "#333333";
      } else {
        ctx.fillStyle = "#888888";
      }
      ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
    });
  }
};

const handleFood = () => {
  ants
    //    .filter((ant) => ant.maturity === "adult" || ant.maturity === "elderly")
    .forEach((ant) => {
      ant.food = ant.food - 1;
      if (ant.food <= 0 && enableDieOnFood) {
        ant.isDead = true;
      }
    });
};

const handleClick = ({ canvasX, canvasY }) => {
  ants.forEach((ant) => ant.isSelected === false);
  ants.forEach((ant) => {
    if (!ant.maturity) {
      return;
    }
    if (
      canvasX >= ant.x - maturities[ant.maturity].size * 3 &&
      canvasX <= ant.x + maturities[ant.maturity].size * 3 &&
      canvasY >= ant.y - maturities[ant.maturity].size * 3 &&
      canvasY <= ant.y + maturities[ant.maturity].size * 3
    ) {
      console.log(ant);
      ant.isSelected = true;
    }
  });
};

function App() {
  const draw = (ctx, frameCount) => {
    if (!isPaused) {
      ctx.beginPath();
      ctx.fillStyle = "#202020";
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      displayHelp(ctx);
      handleBirthday(frameCount);
      handleFood();
      handleDeaths();
      drawWalls(ctx);
      if (displayAnts) {
        drawAnts(ctx, ants);
      }
      handleFatigue(ants);
      handleDirectionChange();
      handleMoveAnts();
      handleContacts();
    }
  };
  return (
    <div className="App">
      <AntHill draw={draw} handleClick={handleClick} />
    </div>
  );
}

export default App;
