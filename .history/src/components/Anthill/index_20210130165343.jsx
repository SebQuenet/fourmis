import React, { useRef, useEffect } from 'react';
import styles from './AntHill.module.css';

const AntHill = (props) => {
  const canvasRef = useRef(null);

  const draw = ctx => {
    ctx.fillStyle = '#0000ff';
    ctx.beginPath();
    ctx.arc(50, 100, 20, 0, 2 * Math.Pi);
    ctx.fill();
  }

  useEffect(() => {

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.fillStyle = '#000000';
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);

    draw(context);
  });
  return <canvas className={styles.canvasSupport} ref={canvasRef}{...props}></canvas>
};

export default AntHill;