import { useRef, useEffect, useState, useCallback } from "react";

import "./App.css";

const rectangle = {
  x: 0,
  y: 0,
  width: 100,
  height: 50,
};

function App() {
  const canvas = useRef();
  const [position, setPosition] = useState(rectangle);
  const [ctx, setCtx] = useState(null);
  const [isDown, setIsDown] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartY, setDragStartY] = useState(0);

  const handleMouseOut = (e) => {
    handleMouseUp(e);
  };

  const handleMouseUp = (e) => {
    setIsDown(false);
    setDragStartX(0);
    setDragStartY(0);
  };

  const clearCanvas = useCallback(() => {
    ctx.clearRect(
      0,
      0,
      canvas.current.clientWidth,
      canvas.current.clientHeight
    );
  }, [ctx]);

  const handleMouseMove = (e) => {
    if (!isDown) return;

    const mouseX = parseInt(e.nativeEvent.offsetX - canvas.current.clientLeft);
    const mouseY = parseInt(e.nativeEvent.offsetY - canvas.current.clientTop);
    const dx = mouseX - dragStartX;
    const dy = mouseY - dragStartY;

    setDragStartX(mouseX);
    setDragStartY(mouseY);

    handlePositionChange({ x: position.x + dx, y: position.y + dy });
  };

  const hitBox = (x, y) => {
    let isTarget = false;
    if (
      x >= position.x &&
      x <= position.x + position.width &&
      y >= position.y &&
      y <= position.y + position.height
    ) {
      isTarget = true;
    }

    return isTarget;
  };

  const handleMouseDown = (e) => {
    setDragStartX(parseInt(e.nativeEvent.offsetX - canvas.current.clientLeft));
    setDragStartY(parseInt(e.nativeEvent.offsetY - canvas.current.clientTop));

    setIsDown(
      hitBox(
        parseInt(e.nativeEvent.offsetX - canvas.current.clientLeft),
        parseInt(e.nativeEvent.offsetY - canvas.current.clientTop)
      )
    );
  };

  const draw = useCallback(() => {
    if (!ctx) return;
    clearCanvas();

    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.fillRect(position.x, position.y, rectangle.width, rectangle.height);
  }, [position, ctx, clearCanvas]);

  const handlePositionChange = useCallback(
    (props) => {
      let { x, y } = props;

      setPosition({
        ...position,
        x: x ? x : position.x,
        y: y ? y : position.y,
      });
    },
    [position]
  );

  useEffect(() => {
    canvas.current.width = 600;
    canvas.current.height = 600;

    setCtx(canvas.current.getContext("2d"));
  }, []);

  useEffect(() => {
    draw();
  }, [position, draw]);

  return (
    <div className="App">
      <h2>Frontend Engineer Position</h2>
      <h5>Homework</h5>
      <div>
        <canvas
          ref={canvas}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseOut={handleMouseOut}
        ></canvas>
      </div>
      <div>
        <label>
          X Axis:{" "}
          <input
            type={"number"}
            value={position.x}
            onChange={(e) => {
              handlePositionChange({ x: parseInt(e.target.value) });
            }}
          />
        </label>
        <label>
          Y Axis:{" "}
          <input
            type={"number"}
            value={position.y}
            onChange={(e) =>
              handlePositionChange({ y: parseInt(e.target.value) })
            }
          />
        </label>
      </div>
    </div>
  );
}

export default App;
