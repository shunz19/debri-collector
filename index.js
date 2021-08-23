import {default as express } from "express";
import * as http from 'http';
import { Server } from "socket.io";
import { SocketConstants as sc } from "./htdocs/js/utils/Constants.js";
import { DebriGame } from './htdocs/js/debri.js';

var app = express();
var httpServer = http.Server(app);
var io = new Server(httpServer);
var game = new DebriGame(io);
game.start(undefined);
var pid = 0;
var sockets = {};

httpServer.listen(process.env.PORT || 918, () => {
	console.log("Game listening at 918");
})

for(var i = 0; i < 200; ++i) {
	game.spawnAsteroid();
}

setInterval(() => {
	io.to("ig").volatile.emit(sc.server.update, game.toData());
}, 20);

io.on("connection", (socket) => {
	socket.pid = pid;
	sockets[pid] = socket;
	socket.lastFire = Date.now();
	++pid;
	socket.on(sc.client.enter, (name) => {
		if(socket.playing) return;
		socket.playing = true;
		var ship = game.addPlayer({x: 100, y: 100, name}, socket.pid);
		socket.ship = ship;
		io.to("ig").emit(sc.server.newplayer, {
			pid: socket.pid,
			ship
		})
		socket.join("ig");
		socket.emit(sc.server.enter, {
			pid: socket.pid,
			players: game.players,
			asteroids: game.asteroids,
		})
	})

	socket.on(sc.client.thrust, t => {
		if(!socket.ship) return;
		if(t) socket.ship.thruston();
		else socket.ship.thrustoff();
	})

	socket.on(sc.client.turn, t => {
		if(!socket.ship) return;
		switch(t) {
			case 0:
			case 1:
			case -1:
				socket.ship.turn(t);
			break;
		}
	})

	socket.on(sc.client.fire, t => {
		if(!socket.ship) return;
		if(t) {
			var a = () => {
				var now = Date.now();
				if(now - socket.lastFire >= 333) {
					socket.lastFire = now;
					game.spawnBullet(socket.ship);
				}
			};
			a();
			socket.fireInterval = setInterval(a, 333)
		}
		else {
			clearInterval(socket.fireInterval);
		}
	})

	socket.on("disconnect", () => {
		delete sockets[socket.pid];
		game.removePlayer(socket.pid)
	})
})

app.use('/', express.static('htdocs'))