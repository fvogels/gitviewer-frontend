import React from "react";
import { Vector } from "vector";


export function Arrow(props: { from: Vector, to: Vector })
{
  const {from, to} = props;
  const direction = from.to(to).normalize();

  const headLength = 20;
  const headWidth = 20;
  const base = to.sub(direction.mul(headLength));
  const left = base.add(direction.rotateLeft().mul(headWidth / 2));
  const right = base.add(direction.rotateRight().mul(headWidth / 2));

  return (
    <React.Fragment>
      <line x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke='black'
            strokeWidth={2} />
      <line x1={left.x}
            y1={left.y}
            x2={to.x}
            y2={to.y}
            stroke='black'
            strokeWidth={2} />
      <line x1={right.x}
            y1={right.y}
            x2={to.x}
            y2={to.y}
            stroke='black'
            strokeWidth={2} />
    </React.Fragment>
  );
}
