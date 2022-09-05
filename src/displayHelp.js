import {
  ants,
  FOX_SIDE,
  VIPER_SIDE,
  HEN_SIDE,
  displayDebug,
  enablePrey,
  enableGate,
  displayAnts,
  displayFood,
  enableDieOnFood,
  enableSenescence,
  displaySensorArea,
  enableChildKills,
} from "./App";

export const displayHelp = (ctx) => {
  ctx.font = "36px serif";
  ctx.fillStyle = "#ffffff";
  const nbFoxes = ants.filter((ant) => ant.side === FOX_SIDE).length;
  const nbVipers = ants.filter((ant) => ant.side === VIPER_SIDE).length;
  const nbHens = ants.filter((ant) => ant.side === HEN_SIDE).length;
  if (displayDebug) {
    ctx.fillStyle = "#00FF00";
    ctx.fillText("Display debug (D) enabled", 30, 40);
    ctx.fillStyle = "#CC4444";
    ctx.fillText(`${nbFoxes} foxes, (F) to add`, 30, 80);
    ctx.fillStyle = "#995500";
    ctx.fillText(`${nbHens} hens, (H) to add`, 30, 120);
    ctx.fillStyle = "#44CC44";
    ctx.fillText(`${nbVipers} vipers, (V) to add`, 30, 160);
    if (enablePrey) {
      ctx.fillStyle = "#FF0000";
      ctx.fillText("Prey mode (K) enabled", 30, 200);
    } else {
      ctx.fillStyle = "#808080";
      ctx.fillText("Prey mode (K) disabled", 30, 200);
    }
    if (enableGate) {
      ctx.fillStyle = "#CCCCCC";
      ctx.fillText("Gate (G) enabled", 30, 240);
    } else {
      ctx.fillStyle = "#808080";
      ctx.fillText("Gate (G) disabled", 30, 240);
    }
    if (displayAnts) {
      ctx.fillStyle = "#CCCCCC";
      ctx.fillText("Ants (A) displayed", 30, 280);
    } else {
      ctx.fillStyle = "#808080";
      ctx.fillText("Ants (A) hidden", 30, 280);
    }
    if (displayFood) {
      ctx.fillStyle = "#CCCCCC";
      ctx.fillText("Food (O) displayed", 30, 320);
    } else {
      ctx.fillStyle = "#808080";
      ctx.fillText("Food (O) hidden", 30, 320);
    }
    if (enableDieOnFood) {
      ctx.fillStyle = "#FF0000";
      ctx.fillText("Die on starvation (X) enabled", 30, 360);
    } else {
      ctx.fillStyle = "#808080";
      ctx.fillText("Die on starvation (X) disabled", 30, 360);
    }
    if (enableSenescence) {
      ctx.fillStyle = "#FF0000";
      ctx.fillText("Die on aging (C) enabled", 30, 400);
    } else {
      ctx.fillStyle = "#808080";
      ctx.fillText("Die on aging (C) disabled", 30, 400);
    }
    if (displaySensorArea) {
      ctx.fillStyle = "#CCCC33";
      ctx.fillText("Sensor (S) displayed", 30, 440);
    } else {
      ctx.fillStyle = "#808080";
      ctx.fillText("Sensor (S) displayed", 30, 440);
    }
    if (enableChildKills) {
      ctx.fillStyle = "#FF0000";
      ctx.fillText("Allow to kill children (I) enabled", 30, 480);
    } else {
      ctx.fillStyle = "#808080";
      ctx.fillText("Allow to kill children (I) disabled", 30, 480);
    }
  } else {
    ctx.fillStyle = "#808080";
    ctx.fillText("Display debug (D) disabled", 30, 40);
  }
};
