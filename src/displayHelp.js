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
  enableBreed,
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
    ctx.fillText("Display debug (d) enabled", 30, 40);
    ctx.fillStyle = "#CC4444";
    ctx.fillText(`${nbFoxes} foxes, (f) to add (F) on cursor`, 30, 80);
    ctx.fillStyle = "#995500";
    ctx.fillText(`${nbHens} hens, (h) to add (H) on cursor`, 30, 120);
    ctx.fillStyle = "#44CC44";
    ctx.fillText(`${nbVipers} vipers, (v) to add (V) on cursor`, 30, 160);
    if (enablePrey) {
      ctx.fillStyle = "#FF0000";
      ctx.fillText("Prey mode (k) enabled", 30, 200);
    } else {
      ctx.fillStyle = "#808080";
      ctx.fillText("Prey mode (k) disabled", 30, 200);
    }
    if (enableGate) {
      ctx.fillStyle = "#CCCCCC";
      ctx.fillText("Gate (g) enabled", 30, 240);
    } else {
      ctx.fillStyle = "#808080";
      ctx.fillText("Gate (g) disabled", 30, 240);
    }
    if (displayAnts) {
      ctx.fillStyle = "#CCCCCC";
      ctx.fillText("Ants (a) displayed", 30, 280);
    } else {
      ctx.fillStyle = "#808080";
      ctx.fillText("Ants (a) hidden", 30, 280);
    }
    if (displayFood) {
      ctx.fillStyle = "#CCCCCC";
      ctx.fillText("Food (o) displayed", 30, 320);
    } else {
      ctx.fillStyle = "#808080";
      ctx.fillText("Food (o) hidden", 30, 320);
    }
    if (enableDieOnFood) {
      ctx.fillStyle = "#FF0000";
      ctx.fillText("Die on starvation (x) enabled", 30, 360);
    } else {
      ctx.fillStyle = "#808080";
      ctx.fillText("Die on starvation (x) disabled", 30, 360);
    }
    if (enableSenescence) {
      ctx.fillStyle = "#FF0000";
      ctx.fillText("Die on aging (c) enabled", 30, 400);
    } else {
      ctx.fillStyle = "#808080";
      ctx.fillText("Die on aging (c) disabled", 30, 400);
    }
    if (displaySensorArea) {
      ctx.fillStyle = "#CCCC33";
      ctx.fillText("Sensor (s) displayed", 30, 440);
    } else {
      ctx.fillStyle = "#808080";
      ctx.fillText("Sensor (s) displayed", 30, 440);
    }
    if (enableChildKills) {
      ctx.fillStyle = "#FF0000";
      ctx.fillText("Allow to kill children (i) enabled", 30, 480);
    } else {
      ctx.fillStyle = "#808080";
      ctx.fillText("Allow to kill children (i) disabled", 30, 480);
    }
    if (enableBreed) {
      ctx.fillStyle = "#00FF00";
      ctx.fillText("Allow to breed (B) enabled", 30, 520);
    } else {
      ctx.fillStyle = "#FF0000";
      ctx.fillText("Allow to breed (B) disabled", 30, 520);
    }
    ctx.fillStyle = "#880000";
    ctx.fillText(`Kill everybody, (K)`, 30, 560);
    ctx.fillStyle = "#808080";
    ctx.fillText(`Randomize walls, (>)`, 30, 600);
    ctx.fillStyle = "#880000";
    ctx.fillText(`Snap, (S)`, 30, 640);
  } else {
    ctx.fillStyle = "#808080";
    ctx.fillText("Display debug (d) disabled", 30, 40);
  }
};
