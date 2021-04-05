import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { SCCanvas } from './styles';


const CanvasCarousel = ({ images }) => {

  const canvas = useRef();

  let ctx = null;
  let startX = null;
  let dragging = false;

  let initialLeftLimit;
  let initialRightLimit;
  
  let imagesContextProps = [];

  // initialize the canvas context
  useEffect(() => {
    // dynamically assign the width and height to canvas
    const canvasEle = canvas.current;
    canvasEle.width = canvasEle.clientWidth;
    canvasEle.height = canvasEle.clientHeight;

    // get context of the canvas
    ctx = canvasEle.getContext("2d");
  }, []);

  useEffect(() => {
    draw();
    registerWindowEvents();

    return () => {
      unregisterDocumentEvents();
    };
  }, []);

  const registerWindowEvents = () => {
    document.addEventListener('mouseup', handleMouseUp);
  };

  const unregisterDocumentEvents = () => {
    document.removeEventListener('mouseup', handleMouseUp);
  };

  // draw images
  const draw = () => {
    ctx.clearRect(0, 0, canvas.current.clientWidth, canvas.current.clientHeight);
    images.map(img => drawImage(img));
  };

  // draw image
  const drawImage = img => {
    let imageObj = new Image();
    imageObj.src = process.env.PUBLIC_URL + '/doggies/' + img;
    
    imageObj.onload = img => {
      let imageAspectRatio = img.target.width / img.target.height;
      let canvasAspectRatio = canvas.current.clientWidth / canvas.current.clientHeight;
      let renderableHeight, renderableWidth, xStart, yStart;

      // If image's aspect ratio is less than canvas's we fit on height
      // and place the image centrally along width
      if(imageAspectRatio < canvasAspectRatio) {
        renderableHeight = canvas.current.clientHeight;
        renderableWidth = img.target.width * (renderableHeight / img.target.height);
        xStart = (canvas.current.clientWidth - renderableWidth) / 2;
        yStart = 0;
      }
      // If image's aspect ratio is greater than canvas's we fit on width
      // and place the image centrally along height
      else if(imageAspectRatio > canvasAspectRatio) {
        renderableWidth = canvas.current.clientWidth;
        renderableHeight = img.target.height * (renderableWidth / img.target.width);
        xStart = 0;
        yStart = (canvas.current.clientHeight - renderableHeight) / 2;
      }
      // keep aspect ratio
      else {
        renderableHeight = canvas.current.clientHeight;
        renderableWidth = canvas.current.clientWidth;
        xStart = 0;
        yStart = 0;
      }

      let imageContextProps = {
        width: renderableWidth,
        height: renderableHeight,
        img: img.target
      }

      if (imagesContextProps.length === 0) {
        imagesContextProps.push({
          ...imageContextProps,
          left: xStart,
          top: yStart
        });

        initialLeftLimit = xStart;
      } else {
        imagesContextProps.push({
          ...imageContextProps,
          left: (imagesContextProps.length * canvas.current.clientWidth) + xStart, 
          top: yStart
        });

        if (imagesContextProps.length === images.length) {
          initialRightLimit = xStart;
        }
      }

      ctx.drawImage(
        img.target,
        imagesContextProps[imagesContextProps.length - 1].left,
        imagesContextProps[imagesContextProps.length - 1].top,
        renderableWidth,
        renderableHeight
      );
    };
  };

  const redraw = () => {
    ctx.clearRect(0, 0, canvas.current.clientWidth, canvas.current.clientHeight);

    imagesContextProps.map((imgContext, i) => ctx.drawImage(imgContext.img, imgContext.left, imgContext.top, imgContext.width, imgContext.height));
  };

  const handleMouseDown = e => {
    startX = parseInt(e.nativeEvent.offsetX - canvas.current.clientLeft);
    dragging = true;
  };

  const handleMouseUp = e => {
    dragging = false;
  };

  const handleMouseMove = e => {
    if (!dragging) return;

    const numElements = imagesContextProps.length;

    const mouseX = parseInt(e.nativeEvent.offsetX - canvas.current.clientLeft);
    let dx = mouseX - startX;

    if (dx > 0 && ((imagesContextProps[0].left + dx) >= initialLeftLimit)) return;
    if (dx < 0 && ((imagesContextProps[numElements - 1].left + dx) <= initialRightLimit)) return;

    startX = mouseX;

    imagesContextProps.map((imgContext, i) => {
      imgContext.left += dx;
    });

    redraw();
  };

  return (
    <SCCanvas
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      ref={canvas}
    />
  );
};

CanvasCarousel.propTypes = {

};

export default CanvasCarousel;
