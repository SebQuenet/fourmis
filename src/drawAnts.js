import { hex, hsl } from "color-convert";
import {
  sides,
  listOfDeaths,
  displayWillBreed,
  displayAntenna,
  displaySensorArea,
  displayEyes,
  displayFood,
  maturities,
  NORMAL_MODE,
  FLEEING_MODE,
  HUNTING_MODE,
  MATING_MODE,
} from "./App";

const drawSensorArea = (ctx, ant) => {
  ctx.lineWidth = 0.25;
  ctx.strokeRect(
    ant.x - ant.sensorArea / 2,
    ant.y - ant.sensorArea / 2,
    ant.sensorArea,
    ant.sensorArea
  );
  ctx.font = "16px monospace";
  ctx.fillStyle = sides[ant.side].color;
  ctx.fillText(
    `${Math.floor(ant.sensorArea)}`,
    ant.x - ant.sensorArea / 2,
    ant.y - ant.sensorArea / 2
  );
  ctx.fillText(
    `${Math.floor(ant.speed * 10)}`,
    ant.x + ant.sensorArea / 2 - 12,
    ant.y - ant.sensorArea / 2
  );
  ctx.fillText(
    `${Math.floor(ant.generation)}`,
    ant.x,
    ant.y - ant.sensorArea / 2
  );
};

const drawEyes = (ctx, ant) => {
  const [h, s, l] = hex.hsl(sides[ant.side].color.substring(1));

  const eyeSize = 4;
  ctx.beginPath();
  //  ctx.fillStyle = `#${hsl.hex(h, s, l + 30)}`;
  ctx.fillStyle = "#ffffff";
  ctx.arc(
    ant.x +
      Math.cos(ant.direction + Math.PI / 6) *
        maturities[ant.maturity].size *
        ant.size,
    ant.y +
      Math.sin(ant.direction + Math.PI / 6) *
        maturities[ant.maturity].size *
        ant.size,
    eyeSize,
    0,
    2 * Math.PI
  );
  ctx.arc(
    ant.x +
      Math.cos(ant.direction - Math.PI / 6) *
        maturities[ant.maturity].size *
        ant.size,
    ant.y +
      Math.sin(ant.direction - Math.PI / 6) *
        maturities[ant.maturity].size *
        ant.size,
    eyeSize,
    0,
    2 * Math.PI
  );
  ctx.fill();

  ctx.beginPath();
  const pupilSize = ant.mode === NORMAL_MODE ? 2 : 3;
  let pupilColor;
  switch (ant.mode) {
    case NORMAL_MODE:
      pupilColor = "#000000";
      break;
    case FLEEING_MODE:
      pupilColor = "#008000";
      break;
    case HUNTING_MODE:
      pupilColor = "#ff0000";
      break;
    case MATING_MODE:
      pupilColor = "#ff00ff";
      break;
    default:
      pupilColor = "#000000";
  }

  /// ctx.fillStyle = `#${hsl.hex(h, s, l - 30)}`;
  ctx.fillStyle = pupilColor;
  ctx.arc(
    ant.x +
      Math.cos(ant.direction + Math.PI / 6) *
        maturities[ant.maturity].size *
        ant.size,
    ant.y +
      Math.sin(ant.direction + Math.PI / 6) *
        maturities[ant.maturity].size *
        ant.size,
    pupilSize,
    0,
    2 * Math.PI
  );
  ctx.arc(
    ant.x +
      Math.cos(ant.direction - Math.PI / 6) *
        maturities[ant.maturity].size *
        ant.size,
    ant.y +
      Math.sin(ant.direction - Math.PI / 6) *
        maturities[ant.maturity].size *
        ant.size,
    pupilSize,
    0,
    2 * Math.PI
  );
  ctx.fill();
};

const drawAntenna = (ctx, ant) => {
  ctx.strokeStyle = sides[ant.side].color;
  ctx.fillStyle = sides[ant.side].color;
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(ant.x, ant.y);
  ctx.lineTo(
    ant.x +
      Math.cos(ant.direction - Math.PI / 6) *
        maturities[ant.maturity].size *
        ant.size *
        10,
    ant.y +
      Math.sin(ant.direction - Math.PI / 6) *
        maturities[ant.maturity].size *
        ant.size *
        10
  );
  ctx.lineWidth = 1;
  ctx.strokeStyle = sides[ant.side].color;
  ctx.stroke();

  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(ant.x, ant.y);
  ctx.lineTo(
    ant.x +
      Math.cos(ant.direction + Math.PI / 6) *
        maturities[ant.maturity].size *
        ant.size *
        10,
    ant.y +
      Math.sin(ant.direction + Math.PI / 6) *
        maturities[ant.maturity].size *
        ant.size *
        10
  );
  ctx.lineWidth = 1;
  ctx.strokeStyle = sides[ant.side].color;
  ctx.stroke();
};

export const drawAnts = (ctx, ants) => {
  ctx.strokeStyle = "#331111";
  listOfDeaths.forEach((point) => {
    ctx.beginPath();
    ctx.fillRect(point.x, point.y, 1, 1);
  });
  ants.forEach((ant) => {
    ctx.beginPath();
    if (ant.maturity === "elderly") {
      const [h, s, l] = hex.hsl(sides[ant.side].color.substring(1));
      ctx.fillStyle = `#${hsl.hex(h, s / 2, l - 10)}`;
    } else {
      ctx.fillStyle = sides[ant.side].color;
    }
    ctx.ellipse(
      ant.x,
      ant.y,
      maturities[ant.maturity].size * ant.size * 2,
      maturities[ant.maturity].size * ant.size +
        maturities[ant.maturity].size * ant.size * Math.abs(ant.oscillator),
      ant.direction,
      0,
      2 * Math.PI
    );
    ctx.fill();
    if (displayWillBreed && ant.bredRest > 0) {
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    if (displayFood) {
      if (ant.food < 500) {
        ctx.strokeStyle = "#ff0000";
        ctx.lineWidth = 3;
        ctx.stroke();
      } else if (ant.food < 1000) {
        ctx.strokeStyle = "#ffff00";
        ctx.lineWidth = 3;
        ctx.stroke();
      } else if (ant.food < 2000) {
        ctx.strokeStyle = "#00ff00";
        ctx.lineWidth = 3;
        ctx.stroke();
      }
    }
    if (ant.isInjuried) {
      ctx.beginPath();
      ctx.fillStyle = "#ff0000";
      ctx.ellipse(
        ant.x,
        ant.y,
        maturities[ant.maturity].size * ant.size * 2,
        maturities[ant.maturity].size * ant.size +
          maturities[ant.maturity].size * ant.size * Math.abs(ant.oscillator),
        ant.direction,
        Math.PI - Math.PI / 3,
        Math.PI + Math.PI / 3
      );
      ctx.fill();
    }

    ctx.beginPath();
    ctx.moveTo(ant.x, ant.y);
    ctx.lineTo(
      ant.x +
        Math.cos(ant.direction) * maturities[ant.maturity].size * ant.size * 2,
      ant.y +
        Math.sin(ant.direction) * maturities[ant.maturity].size * ant.size * 2
    );
    ctx.lineWidth = 1;
    ctx.strokeStyle = sides[ant.side].color;
    ctx.stroke();

    if (displayAntenna) {
      drawAntenna(ctx, ant);
    }
    if (
      displayEyes &&
      (ant.maturity === "adult" ||
        ant.maturity === "elderly" ||
        ant.maturity === "child" ||
        ant.maturity === "baby")
    ) {
      drawEyes(ctx, ant);
    }

    if (displaySensorArea) {
      drawSensorArea(ctx, ant);
    }
    if (ant.isSelected) {
      ctx.beginPath();
      ctx.strokeStyle = "#ff8888";
      ctx.fillStyle = "#ffffff";
      ctx.lineWidth = 3;
      ctx.arc(
        ant.x,
        ant.y,
        maturities[ant.maturity].size * ant.size * 3,
        0,
        2 * Math.PI
      );
      ctx.stroke();
    }
  });
};
