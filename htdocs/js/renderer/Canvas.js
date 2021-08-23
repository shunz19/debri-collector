import { Constants } from "../utils/Constants.js";

class Canvas {
	constructor(debri, main) {
		this.images = {};
		this.canvas = document.createElement("canvas");
		this.ctx = this.canvas.getContext("2d");
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.debri = debri;

		var keydowns = {};

		window.addEventListener("resize", () => {
			this.canvas.width = window.innerWidth;
			this.canvas.height = window.innerHeight;
		})

		this.keydown = (e) => {
			if(this.canvas.hidden) return;
			var key = e.key.toLowerCase();
			if(keydowns[key]) return;
			keydowns[key] = true;

			switch(key.toLowerCase()) {
				case "w":
					main.socketConnection.thrust(1);
				break;
				case "a":
					main.socketConnection.turn(-1);
				break;
				case "d":
					main.socketConnection.turn(1);
				break;
				case " ":
					main.socketConnection.fire(1);
				break;
			}
		}

		this.keyup = (e) => {
			if(this.canvas.hidden) return;
			var key = e.key.toLowerCase();
			if(!keydowns[key]) return;
			delete keydowns[key]


			switch(key.toLowerCase()) {
				case "w":
					main.socketConnection.thrust(0);
				break;
				case "a":
				case "d":
					if(!keydowns["a"] && !keydowns["d"]) main.socketConnection.turn(0);
				break;
				case " ":
					main.socketConnection.fire(0);
				break;
			}
		}

		window.addEventListener("keydown", this.keydown)

		window.addEventListener("keyup", this.keyup)

		this.loadImage("ship", "img/ship.png");
		this.loadImage("asteroid", "img/asteroid.png");
		this.loadImage("bullet", "img/bullet.png");
		this.loadImage("coin", "img/coin.png");
	}

	loadImage(name, img) {
		if(this.images[name]) return this.images[name];
		var s = new Image();;
		s.src = img;
		this.images[name] = s;
		return s;
	}

	render() {
		const { debri, ctx, canvas } = this;
		var self = debri.players[debri.pid];
		if(!self) return;
		document.body.style.backgroundPosition = -self.x + "px " + -self.y + "px";
		ctx.fillStyle = "white";
		ctx.font = "30px Arial";
		ctx.lineWidth = 5;
		ctx.strokeStyle = "white";
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.translate(canvas.width / 2 - self.x, canvas.height / 2 - self.y);
		ctx.strokeRect(0, 0, Constants.worldSize.x, Constants.worldSize.y);

		for(var p in debri.asteroids) {
			var player = debri.asteroids[p];
			if(player.x > self.x - canvas.width && player.x < self.x + canvas.width && 
				player.y > self.y - canvas.height && player.y > self.y - canvas.height) {
				var img = this.images[player.m];
				if(img) {
					ctx.save();
					ctx.translate(player.x, player.y);
					ctx.rotate(player.a *  Math.PI / 180)
					ctx.drawImage(img, -player.r, -player.r, player.r * 2, player.r * 2)
					ctx.restore();
				}
				else {
					ctx.beginPath();
					ctx.arc(player.x, player.y, player.r, 0, 2 * Math.PI);
					ctx.fillStyle = player.m;
					ctx.fill();
				}
			}
		}
		for(var p in debri.players) {
			var player = debri.players[p];
			if(player.x > self.x - canvas.width && player.x < self.x + canvas.width && 
				player.y > self.y - canvas.height && player.y > self.y - canvas.height) {
				var img = this.images[player.m];
				if(img) {
					ctx.save();
					ctx.translate(player.x, player.y);
					ctx.rotate(player.a *  Math.PI / 180)
					ctx.drawImage(img, -player.r, -player.r, player.r * 2, player.r * 2)
					ctx.fillStyle = "green";
					ctx.fillRect(-player.health / 2, player.r + 10, player.health, 10);
					ctx.restore();
				}
				else {
					ctx.beginPath();
					ctx.arc(player.x, player.y, player.r, 0, 2 * Math.PI);
					ctx.fillStyle = player.m;
					ctx.fill();
				}
			}
		}
		ctx.setTransform(1, 0, 0, 1, 0, 0);
	}
}

export { Canvas }