import React, { useRef, useEffect } from 'react';
import styles from './AntHill.module.css';

const AntHill = (props) => {
  const canvasRef = useRef(null);
  const { draw } = props;
  useEffect(() => {
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

  }, [draw]);
  return <canvas width={window.innerWidth} height={window.innerHeight} className={styles.canvasSupport} ref={canvasRef}{...props}></canvas>
};

export default AntHill;