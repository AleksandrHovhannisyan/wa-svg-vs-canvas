//
// TEST: TOUCAN
//
import React from "react";
import styled from "styled-components";

import { normalize, random } from "../../utils";
import useInnerSize from "../../hooks/use-inner-size";

import ControlPanel from "../../components/ControlPanel";
import { StateContext } from "../../components/StateProvider";

function ReactCanvas() {
  const ref = React.useRef<HTMLCanvasElement>(null);
  const animationFrame = React.useRef<number | null>(null);
  const { density, sensitivity, jitter, useRequestAnimationFrame } =
    React.useContext(StateContext);

  const devicePixelRatio = window.devicePixelRatio || 1;
  const innerSize = useInnerSize();

  React.useEffect(() => {
    let context: CanvasRenderingContext2D | null = null;
    let mouseX: number = window.innerWidth / 2;
    let mouseY: number = window.innerHeight / 2;

    function repaintCanvas() {
      const canvas = ref.current;

      if (!canvas) {
        return;
      }

      if (!context) {
        context = canvas.getContext("2d");
        if (!context) {
          // Stupid TS
          return;
        }

        context.scale(devicePixelRatio, devicePixelRatio);
      }

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "red";

      for (let rowIndex = 0; rowIndex <= density; rowIndex++) {
        for (let colIndex = 0; colIndex <= density; colIndex++) {
          context.beginPath();
          const xJitter = random(-jitter, jitter, { rounded: false });
          const yJitter = random(-jitter, jitter, { rounded: false });

          const cx =
            normalize(rowIndex, 0, density, 0, innerSize) +
            normalize(
              mouseX,
              0,
              innerSize * devicePixelRatio,
              -sensitivity * 2,
              sensitivity * 2
            ) +
            xJitter;
          const cy =
            normalize(colIndex, 0, density, 0, innerSize) +
            normalize(
              mouseY,
              0,
              innerSize * devicePixelRatio,
              -sensitivity * 2,
              sensitivity * 2
            ) +
            yJitter +
            32;

          context.arc(cx, cy, (innerSize / density) * 0.4, 0, Math.PI * 2);

          context.fill();
          context.closePath();
        }
      }
    }

    function animate() {
      animationFrame.current = window.requestAnimationFrame(() => {
        repaintCanvas();
        animate();
      })
    }

    function handlePointerMove(event: Partial<MouseEvent>) {
      mouseX = event.clientX!;
      mouseY = event.clientY!;
      if (!useRequestAnimationFrame) {
        repaintCanvas();
      }
    }

    // If the checkbox is checked, fire off a continuous rAF animation loop
    // that repaints the canvas at the current (x, y), synced with the device's refresh rate.
    if (useRequestAnimationFrame) {
      animate();
    } else {
      // Initial paint for non-rAF version
      repaintCanvas();
    }

    // Always do this to update the (x, y) coordinate of the mouse
    window.addEventListener("pointermove", handlePointerMove);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      if (typeof animationFrame.current === 'number') {
        window.cancelAnimationFrame(animationFrame.current);
      }
      context?.scale(1 / window.devicePixelRatio, 1 / window.devicePixelRatio);
    };
  }, [density, sensitivity, jitter, devicePixelRatio, innerSize, useRequestAnimationFrame]);

  return (
    <>
      <h1>Toucan</h1>

      <Wrapper>
        <Canvas
          ref={ref}
          style={{
            width: innerSize,
            height: innerSize,
          }}
          width={innerSize * devicePixelRatio}
          height={innerSize * devicePixelRatio}
        />
      </Wrapper>
      <ControlPanel />
    </>
  );
}

const Canvas = styled.canvas`
  display: block;
  touch-action: none;
`;

const Wrapper = styled.div`
  border: 3px solid red;
  width: fit-content;
  height: fit-content;
  border-radius: 5px;
`;

export default ReactCanvas;
