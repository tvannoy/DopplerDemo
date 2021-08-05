import { useEffect, useState } from 'react';
import { useWindowSize } from '@react-hook/window-size';
import TouchManager from './touches';
import Simulation from './simulation';
import spectrum from './spectrum.json';

const transformSpectrum = (stops) => {
  const spec = [];
  for(let i = 14; i < stops.length-20; i++) {
    const {
      offset, color
    } = stops[i];
// we could transform the color here too, but leaving it for now
    spec.push({ offset: (offset-.189189)/(0.729730-.18918), color });
  }
  /*
  for(let i = stops.length-2; i >= 0; i--) {
    const {
      offset, color
    } = stops[i];
// we could transform the color here too, but leaving it for now
    spec.push({ offset: .5+(1-offset)*.5, color });
  }
  */

  return spec;
};

const transformedSpectrum = transformSpectrum(spectrum);

const appTouches = new TouchManager();
const appSimulation = new Simulation();

function App() {
  const [ width, height ] = useWindowSize();
//  const [ touches, setTouches ] = useState([]);
  const [ circles, setCircles ] = useState([]);

//  const setCircles = () => {};
//  const circles = [ { x: 100, y: 100, vx: 0, vy: 0, vr: 10, r: 100, time: 0 } ];
  

  useEffect(() => {
    const onStart = (e) => {
      appTouches.touch(e);
      //setTouches(appTouches.getTouches());
    };
    const onMove = (e) => {
      appTouches.touch(e);
      //setTouches(appTouches.getTouches());
    };
    const onEnd = (e) => {
      appTouches.touch(e);
      //setTouches(appTouches.getTouches());
    };
    const onMouseDown = (e) => {
      appTouches.mouseDown(e);
      //setTouches(appTouches.getTouches());
    };
    const onMouseMove = (e) => {
      appTouches.mouseMove(e);
      //setTouches(appTouches.getTouches());
    };
    const onMouseUp = (e) => {
      appTouches.mouseUp(e);
      //setTouches(appTouches.getTouches());
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
        appSimulation.addCircle(touch.lastX, touch.lastY, 0, touch.vx, touch.vy, 300);
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
  <linearGradient id="spectrum">
    { transformedSpectrum.map(({ offset, color }) => <stop key={offset} offset={offset} style={ { stopColor: "rgb(" + color[0]*255 + "," + color[1]*255 + "," + color[2]*255 + ")" } }/>) }
  </linearGradient>
  {/* touches.map((touch, idx) => <text key={touch.id} x={10} y={20+20*idx}>{touch.id} - {touch.lastX},{touch.lastY},{touch.vx},{touch.vy}</text>) */}
  { circles.map((circle) => {
      let angle = 180;
      if((circle.vx*circle.vx+circle.vy*circle.vy) > .00001) {
        angle = Math.atan2(circle.vy, circle.vx)*180/Math.PI+180;
      }
      return <circle key={circle.id} cx={circle.x} cy={circle.y} r={circle.r} fill="none" stroke="url(#spectrum)" opacity={((2-circle.time)/2)*((2-circle.time)/2)} strokeWidth={10} transform={"rotate(" + angle + "," + circle.x + "," + circle.y + ")"} />
    }) }
  </svg>
  );
}

export default App;
