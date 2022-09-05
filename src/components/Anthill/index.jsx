import React, { useRef, useEffect } from 'react';
import styles from './AntHill.module.css';

const CANVAS_WIDTH = 4000;
const CANVAS_HEIGHT = 2000;

const AntHill = (props) => {
  const canvasRef = useRef(null);
  const { draw, handleClick } = props;
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    let frameCount = 0;
    let animationFrameId;

    canvas.addEventListener('click', (e) => {

      const canvasWidth = canvas.getBoundingClientRect().width;
      const canvasHeight = canvas.getBoundingClientRect().height;
      const canvasX = e.clientX*CANVAS_WIDTH/canvasWidth;
      const canvasY = e.clientY*CANVAS_HEIGHT/canvasHeight;
      handleClick({canvasX, canvasY});
    }, false);

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
  console.log(window.innerWidth / 2);
  console.log(window.innerHeight/ 2);
  return <canvas width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className={styles.canvasSupport} ref={canvasRef}{...props}></canvas>
};

export default AntHill;