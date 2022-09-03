import React, { useRef } from 'react';

const AntHill = (props) => {
  const canvasRef = useRef(null);
  return <canvas ref={canvasRef}{...props}></canvas>
};

export default AntHill;