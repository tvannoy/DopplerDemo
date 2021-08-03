import { useEffect, useState } from 'react';
import { useWindowSize } from '@react-hook/window-size';
import TouchManager from './touches';
import Simulation from './simulation';

const appTouches = new TouchManager();
const appSimulation = new Simulation();

function App() {
  const [ width, height ] = useWindowSize();
  const [ touches, setTouches ] = useState([]);
  const [ circles, setCircles ] = useState([]);

  useEffect(() => {
    const onStart = (e) => {
      appTouches.touch(e);
      setTouches(appTouches.getTouches());
    };
    const onMove = (e) => {
      appTouches.touch(e);
      setTouches(appTouches.getTouches());
    };
    const onEnd = (e) => {
      appTouches.touch(e);
      setTouches(appTouches.getTouches());
    };
    const onMouseDown = (e) => {
      appTouches.mouseDown(e);
      setTouches(appTouches.getTouches());
    };
    const onMouseMove = (e) => {
      appTouches.mouseMove(e);
      setTouches(appTouches.getTouches());
    };
    const onMouseUp = (e) => {
      appTouches.mouseUp(e);
      setTouches(appTouches.getTouches());
    };
    let timerID;
    let lastUpdate = performance.now();
    const update = () => {
      const now = performance.now();
      const dt = (now-lastUpdate)/1000;
      appSimulation.next(dt);
      setCircles(appSimulation.getCircles());
      timerID = window.requestAnimationFrame(update);
      lastUpdate = now;
    };

    let pulseID;
    const pulsePeriod = 250;
    const pulse = () => {
      const touches = appTouches.getTouches();
      for(let touch of touches) {
        appSimulation.addCircle(touch.lastX, touch.lastY, 0, touch.vx, touch.vy, 100);
      }
      pulseID = setTimeout(pulse, pulsePeriod);
    };
    console.log("Adding...");
    document.addEventListener('mousedown', onMouseDown, { passive: false });
    document.addEventListener('mousemove', onMouseMove, { passive: false });
    document.addEventListener('mouseup', onMouseUp, { passive: false });
    document.addEventListener('touchstart', onStart, { passive: false })
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onEnd, { passive: false });
    timerID = window.requestAnimationFrame(update);

    pulseID = setTimeout(pulse, pulsePeriod);

    return () => {
      console.log("Removing...");
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('touchstart', onStart);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onEnd);
      window.cancelAnimationFrame(timerID);
      clearTimeout(pulseID);
    }
  }, []);
  return (
  <svg width={width} height={height} viewport={"0 0 " + width + " " + height}>
  {/* touches.map((touch, idx) => <text key={touch.id} x={10} y={20+20*idx}>{touch.id} - {touch.lastX},{touch.lastY},{touch.vx},{touch.vy}</text>) */}
  { circles.map((circle) => <circle key={circle.id} cx={circle.x} cy={circle.y} r={circle.r} fill="none" stroke="black" opacity={((5-circle.time)/5)*((5-circle.time)/5)}/>) }
  </svg>
  );
}

export default App;
