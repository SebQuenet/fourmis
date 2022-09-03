import React, { useRef, useEffect } from 'react';
import styles from './AntHill.module.css';

const AntHill = (props) => {
  const canvasRef = useRef(null);

  const draw = (ctx, frameCount) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.fillStyle = '#000000'
    ctx.beginPath()
    ctx.arc(50, 100, 1, 0, 2 * Math.PI)
    ctx.fill()

  }

  useEffect(() => {

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.fillStyle = '#202020';
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);

    let frameCount = 0;
    let animationFrameId;

    const render = () => {
      frameCount++
      draw(context, frameCount)
      animationFrameId = window.requestAnimationFrame(render)
    }
    render()

    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }

  }, [draw]);
  return <canvas className={styles.canvasSupport} ref={canvasRef}{...props}></canvas>
};

export default AntHill;