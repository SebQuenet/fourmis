import React, { useRef, useEffect } from 'react';
import styles from './AntHill.module.css';

const AntHill = (props) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const draw = (ctx, frameCount) => {

      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      ctx.fillStyle = '#4444CC'
      ctx.beginPath()
      ctx.arc(50 + frameCount, 100, 1, 0, 2 * Math.PI)
      ctx.fill()
    }


    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

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

  }, []);
  return <canvas className={styles.canvasSupport} ref={canvasRef}{...props}></canvas>
};

export default AntHill;