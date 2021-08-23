import { Matter } from "./Matter.js";

class Asteroid extends Matter {
	constructor(x, y) {
		super(x, y);
		this.type = "Asteroid";
		this.r = Math.random() * 40 + 40;
		this.health = this.r;
		this.rs = Math.random() * 180;
		this.td = Math.random();
		if(Math.random() > 0.5) this.td = -this.td;
		this.m = "asteroid";
		this.mv = (80 - this.r) / 10;
		this.vx = Math.random() * this.mv / 2;
		this.vy = Math.random() * this.mv / 2;
	}
}

export { Asteroid }