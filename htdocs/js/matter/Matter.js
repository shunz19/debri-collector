import { Constants } from '../utils/Constants.js';

class Matter {
	constructor(x = Math.random() * (Constants.worldSize.x - 100) + 100, y = Math.random() * (Constants.worldSize.y - 100) + 100, r = 25, m = "green", a = 180, rs = 0, ac = 0, mv = 0, vx = 0, vy = 0, t = false, td = 0) {
		this.type = "Matter";
		this.x = x;
		this.y = y;
		this.r = r;
		this.m = m;
		this.a = a;
		this.rs = rs;
		this.ac = ac;
		this.mv = mv;
		this.vx = vx;
		this.vy = vy;
		this.t = t;
		this.td = td;
		this.sin = Math.sin(a * Math.PI / 180);
		this.cos = Math.cos(a * Math.PI / 180);
	}

	thruston() {
		this.t = true;
	}

	thrustoff() {
		this.t = false;
	}

	turn(direction) {
		this.td = direction;
	}

	update(delta, now) {
		if(this.maxHealth && this.health < this.maxHealth && now - this.lastDamage > 3000) {
			this.health += delta * 10;
			if(this.maxHealth < this.health) this.health = this.maxHealth
		}

		if(this.td) {
			this.a += delta * this.rs * this.td;
			this.a = this.a % 360;
			this.sin = Math.sin(this.a * Math.PI / 180);
			this.cos = Math.cos(this.a * Math.PI / 180);
		}
		if(this.t) {
			this.vx += this.sin * delta * this.ac;
			this.vy += this.cos * delta * this.ac;
		}
		if(this.vx > this.mv) --this.vx;
		else if(this.vx < -this.mv) ++this.vx;
		if(this.vy > this.mv) --this.vy;
		else if(this.vy < -this.mv) ++this.vy;
		this.x += this.vx;
		this.y -= this.vy;
		if(this.x - this.r < 0) {
			this.x = this.r;
			this.vx = -this.vx;
		}
		if(this.x + this.r > Constants.worldSize.x) {
			this.x = Constants.worldSize.x - this.r;
			this.vx = -this.vx;
		}
		if(this.y - this.r < 0) {
			this.y = this.r;
			this.vy = -this.vy;
		}
		if(this.y + this.r > Constants.worldSize.y) {
			this.y = Constants.worldSize.y - this.r;
			this.vy = -this.vy;
		}
	}

	toData() {
		return {
			x: Math.round(this.x),
			y: Math.round(this.y),
			a: Math.round(this.a),
			health: Math.round(this.health)
		}
	}

	collidesWith(other) {
		return ((this.r + other.r) ** 2 > (this.x - other.x) ** 2 + (this.y - other.y) ** 2);
	}

	distanceFrom(other) {
		return Math.sqrt((this.x - other.x) ** 2 + (this.y - other.y) ** 2);
	}

	angleFrom(other) {
		return Math.atan2(this.y - other.y, this.x - other.x);
	}

	applyForce(rad, speed = this.mv) {
		var sin = Math.sin(rad);
		var cos = Math.cos(rad);
		this.vx -= sin * speed;
		this.vy -= cos * speed;
	}
}

export { Matter };