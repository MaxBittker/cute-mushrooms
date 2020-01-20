import React, { Fragment } from "react";
import { pointsToString } from "./utils.js";
import { noise } from "./perlin.js";
noise.seed(Math.random());

console.log(noise);
let width = window.innerWidth;
let height = window.innerHeight;

function makeMushroom(
  mi,
  t,
  start = [width / 2, height],
  startAngle = Math.PI
) {
  let a = startAngle;
  let da = 0;
  // Math.random() * 2 * Math.PI;
  let n = 70 + 40 * noise.simplex2(mi / 20, t);
  // Math.random();

  let points = [start];
  let current = start;
  let step_size = 4.0;

  for (let i = 0; i < n; i++) {
    let newx = current[0];
    let newy = current[1];

    newx += Math.sin(a) * step_size;
    newy += Math.cos(a) * step_size;

    a += da;
    da += noise.simplex2(0.4 + mi * 6234, i * 966.555 + t * 3.1) * 0.02;
    da *= 0.9;

    let nextPoint = [newx, newy];

    points.push(nextPoint);
    current = nextPoint;
  }
  return points;
}

function Mushroom({ i, t, start, startAngle }) {
  let points = makeMushroom(i, t, start, startAngle);
  let [headx, heady] = points[points.length - 1];
  let cn = noise.simplex2(i * 88.88, 0);
  return (
    <Fragment>
      <polyline
        points={pointsToString(points)}
        fill="none"
        stroke={`hsl(35, ${60 + 10 * cn}%, ${85 + 5 * cn}%)`}
        strokeWidth={20 + points.length / 10}
      />
      <circle
        cx={headx}
        cy={heady}
        r={30}
        fill={`hsl(25, ${80 + 10 * cn}%, ${80 + 5 * cn}%)`}
      ></circle>
    </Fragment>
  );
}

function Clump({ n, t }) {
  let ms = new Array(n).fill("");
  return (
    <Fragment>
      {ms.map((_, i) => {
        let ci = i - n / 2;
        let ni = i / n;
        ni *= 0.25;
        ni += 0.38;
        let r = 100;
        let sx = width / 2;
        let sy = height;
        // sx += r * Math.sin(ni * 2 * Math.PI);
        // sy += r * Math.cos(ni * 2 * Math.PI);
        // let startAngle = ni * 2 * Math.PI;
        sx += ci * 25;
        let startAngle = Math.PI;
        return (
          <Mushroom
            i={i}
            t={t}
            start={[sx, sy]}
            startAngle={startAngle}
          ></Mushroom>
        );
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
    if (this.frameCount >= Math.round(this.maxFPS / 24)) {
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
          <Clump n={20} t={this.state.t / 60} />
        </svg>
      </div>
    );
  }
}

export default App;
