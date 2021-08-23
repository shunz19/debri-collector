import { Ship } from "./matter/Ship.js";
import { Asteroid } from "./matter/Asteroid.js";
import { Bullet } from "./matter/Bullet.js";
import { Coin } from "./matter/Coin.js";
import { SocketConstants as sc } from "./utils/Constants.js";

var asteroidCount = 0;
var bulletCount = 0;

class DebriGame {
	constructor(io) {
		this.io = io;
		this.players = {};
		this.asteroids = {};
		this.lastUpdate = Date.now();
	}

	addPlayer(data, id) {
		var player = new Ship(data.x, data.y);
		Object.assign(player, data);
		player.pid = id;
		this.players[id] = player;
		return player;
	}

	removePlayer(id) {
		if(this.players[id]) {
			if(this.io) this.io.to("ig").emit(sc.server.removeplayer, id);
			delete this.players[id];
			return true;
		}
		return false;
	}

	spawnAsteroid(data) {
		var asteroid = new Asteroid();
		Object.assign(asteroid, data);
		asteroid.pid = asteroidCount;
		this.asteroids[asteroidCount] = asteroid;
		if(this.io) {
			this.io.to("ig").emit(sc.server.newasteroid, {
				pid: asteroidCount,
				asteroid: asteroid
			})
		}
		++asteroidCount;
		return asteroid;
	}

	spawnBullet(owner) {
		var bullet = new Bullet(owner.x, owner.y, owner.a, owner.pid);
		bullet.pid = asteroidCount;
		this.asteroids[asteroidCount] = bullet;
		if(this.io) {
			this.io.to("ig").emit(sc.server.newasteroid, {
				pid: asteroidCount,
				asteroid: bullet
			})
		}
		setTimeout(() => {
			this.removeAsteroid(bullet.pid);
		}, 3000)
		++asteroidCount;
		return bullet;
	}

	addCoin(x, y) {
		var coin = new Coin(x, y);
		coin.pid = asteroidCount;
		this.asteroids[asteroidCount] = coin;
		if(this.io) {
			this.io.to("ig").emit(sc.server.newasteroid, {
				pid: asteroidCount,
				asteroid: coin
			})
		}
		++asteroidCount;
		return coin;
	}

	addAsteroid(data, id) {
		var asteroid = new Asteroid(data.x, data.y);
		asteroid.pid = id;
		Object.assign(asteroid, data);
		if(this.io) {
			this.io.to("ig").emit(sc.server.newasteroid, {
				pid: id,
				asteroid: asteroid
			})
		}
		this.asteroids[id] = asteroid;
	}

	removeAsteroid(id) {
		if(this.asteroids[id]) {
			if(this.io) this.io.to("ig").emit(sc.server.removeasteroid, id);
			delete this.asteroids[id];
			return true;
		}
		return false;
	}

	start(updateCallback = () => {}, interval = 20) {
		this.updateCallback = updateCallback;
		this.updateInterval = setInterval(() => this.update(), interval);
	}

	update() {
		var all = Object.keys(this.players).map(_=>this.players[_]).concat(Object.keys(this.asteroids).map(_=>this.asteroids[_])), now = Date.now(), delta = (now - this.lastUpdate) / 1000;
		this.lastUpdate = now;
		for(var matter of all) {
			matter.update(delta, now);
			for(var other of all) {
				if(other == matter) continue;
				if(matter.collidesWith(other)) {
					switch(matter.type) {
						case "Asteroid":
							matter.applyForce(other.angleFrom(matter));
							other.applyForce(matter.angleFrom(other));
							if(other.type == "Ship") {
								other.health -= matter.r;
								other.lastDamage = now;
								this.removeAsteroid(matter.pid);
								if(matter.r > 40) {
									var a = this.spawnAsteroid({
										r: matter.r / 2,
										x: matter.x - matter.r,
										y: matter.y
									});
									var b = this.spawnAsteroid({
										r: matter.r / 2,
										x: matter.x + matter.r,
										y: matter.y
									});
								}
								else this.addCoin(matter.x, matter.y);
								if(other.health <= 0) {
									this.removePlayer(other.pid);
								}
							}
						break;
						case "Bullet":
							if(other.type == "Asteroid") {
								this.removeAsteroid(matter.pid);
								other.health -= matter.r;
								if(other.health <= 0) {
									this.removeAsteroid(other.pid);
									if(other.r > 40) {
										var a = this.spawnAsteroid({
											r: other.r / 2,
											x: other.x - other.r,
											y: other.y
										});
										var b = this.spawnAsteroid({
											r: other.r / 2,
											x: other.x + other.r,
											y: other.y
										});
									}
									else this.addCoin(other.x, other.y);
								}
							}
							else if(other.type == "Ship") {
								if(other.pid != matter.ownerpid)  {
									this.removeAsteroid(matter.pid);
									other.applyForce(matter.angleFrom(other), 1);
									other.health -= matter.r;
									other.lastDamage = now;
									if(other.health <= 0) {
										this.addCoin(other.x, other.y);
										this.addCoin(other.x + 10, other.y);
										this.addCoin(other.x - 10, other.y);
										this.addCoin(other.x, other.y + 10);
										this.addCoin(other.x, other.y - 10);
										this.removePlayer(other.pid);
									}
								}
							}
						break;
						case "Coin":
							if(other.type == "Ship") {
								other.coins += 10;
								this.removeAsteroid(matter.pid);
							}
						break;
					}
				}
			}
		}
		this.updateCallback();
	}

	stop() {
		clearInterval(this.updateInterval);
	}

	toData() {
		var p = [];
		for(var pid in this.players) p.push({
			pid,
			data: this.players[pid].toData()
		});
		var a = [];
		for(var pid in this.asteroids) a.push({
			pid,
			data: this.asteroids[pid].toData()
		});
		return {
			p,
			a
		}
	}
}

export { DebriGame }