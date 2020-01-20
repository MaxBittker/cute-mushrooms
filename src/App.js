import React, { Fragment } from "react";
import { pointsToString } from "./utils.js";
import { random } from "node-forge";
let width = window.innerWidth;
let height = window.innerHeight;

function makeMushroom(start = [width / 2, height], startAngle = Math.PI) {
  let a = startAngle;
  let da = 0;
  // Math.random() * 2 * Math.PI;
  let n = 30 + 80 * Math.random();

  let points = [start];
  let current = start;
  let step_size = 4.0;

  for (let i = 0; i < n; i++) {
    let newx = current[0];
    let newy = current[1];

    newx += Math.sin(a) * step_size;
    newy += Math.cos(a) * step_size;

    a += da;
    da += (Math.random() - 0.5) * 0.01;
    da *= 0.95;
    // console.log(a);

    let nextPoint = [newx, newy];

    points.push(nextPoint);
    current = nextPoint;
  }
  return points;
}

function Mushroom({ start, startAngle }) {
  let points = makeMushroom(start, startAngle);
  let [headx, heady] = points[points.length - 1];
  return (
    <Fragment>
      <polyline
        points={pointsToString(points)}
        fill="none"
        stroke={`hsl(45, ${60 + Math.random() * 30}%, ${85 +
          Math.random() * 5}%)`}
        strokeWidth={20 + points.length / 10}
      />
      <circle
        cx={headx}
        cy={heady}
        r={30}
        fill={`hsl(25, ${50 + Math.random() * 80}%, 86%)`}
      ></circle>
    </Fragment>
  );
}

function Clump({ n }) {
  let ms = new Array(n).fill("");
  return (
    <Fragment>
      {ms.map((_, i) => {
        // let ci = i - n / 2;
        let ni = i / n;
        ni *= 0.25;
        ni += 0.38;
        let r = 100;
        let sx = width / 2;
        let sy = height - 30;
        sx += r * Math.sin(ni * 2 * Math.PI);
        sy += r * Math.cos(ni * 2 * Math.PI);
        let startAngle = ni * 2 * Math.PI;
        return <Mushroom start={[sx, sy]} startAngle={startAngle}></Mushroom>;
      })}
    </Fragment>
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { t: 0 };
    window.requestAnimationFrame(this.update);
  }
  maxFPS = 60;
  frameCount = 0;
  update = () => {
    this.frameCount++;
    if (this.frameCount >= Math.round(this.maxFPS / 12)) {
      this.setState(previous => {
        return {
          t: previous.t + 1
        };
      });
      this.frameCount = 0;
    }
    window.requestAnimationFrame(this.update);
  };
  render() {
    return (
      <div>
        {/* <h2>{this.state.t}</h2> */}
        <svg height={height} width={width}>
          <Clump n={30} />
        </svg>
      </div>
    );
  }
}

export default App;
