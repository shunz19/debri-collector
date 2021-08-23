import { Matter } from "./Matter.js";

class Ship extends Matter {
	constructor(x, y) {
		super(x, y);
		this.type = "Ship";
		this.r = 25;
		this.coins = 0;
		this.rs = 270;
		this.ac = 20;
		this.mv = 10;
		this.lastDamage = Date.now();
		this.health = 100;
		this.maxHealth = 100;
		this.m = "ship";
	}
}

export { Ship }