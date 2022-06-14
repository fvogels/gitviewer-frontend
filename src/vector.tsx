export class Vector
{
  constructor(public readonly x: number, public readonly y: number)
  {
    // NOP
  }

  norm() : number
  {
    const x = this.x;
    const y = this.y;

    return Math.sqrt(x * x + y * y);
  }

  add(v : Vector): Vector
  {
    const x = this.x + v.x;
    const y = this.y + v.y;

    return new Vector(x, y);
  }

  neg() : Vector
  {
    const x = -this.x;
    const y = -this.y;

    return new Vector(x, y);
  }

  sub(v : Vector) : Vector
  {
    return this.add(v.neg());
  }

  mul(n : number) : Vector
  {
    const x = this.x * n;
    const y = this.y * n;

    return new Vector(x, y);
  }

  normalize() : Vector
  {
    return this.mul(1 / this.norm());
  }

  rotateLeft() : Vector
  {
    const x = this.x;
    const y = this.y;

    return new Vector(y, -x);
  }

  rotateRight() : Vector
  {
    return this.rotateLeft().neg();
  }

  to(v : Vector) : Vector
  {
    return v.sub(this);
  }
}