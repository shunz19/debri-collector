import { SocketConstants as sc} from '../utils/Constants.js';

class SocketConnection {
	constructor(socket, debri, c, menu) {
		var canvas = c.canvas;
		this.socket = socket;
		this.debri = debri;
		menu.hidden = 0;
		canvas.hidden = 1;

		socket.on(sc.server.enter, (data) => {
			menu.hidden = 1;
			canvas.hidden = 0;

			debri.pid = data.pid;
			for(var pid in data.players) {
				debri.addPlayer(data.players[pid], pid);
			}

			for(var pid in data.asteroids) {
				debri.addAsteroid(data.asteroids[pid], pid);
			}
		})

		socket.on(sc.server.pdata, (data) => {
			var p = debri.players[data.pid];
			if(!p) return;
			var dt = data.data;
			Object.assign(p, dt);
			p.sin = Math.sin(p.a * Math.PI / 180);
			p.cos = Math.cos(p.a * Math.PI / 180);
		})

		socket.on(sc.server.newplayer, (data) => {
			debri.addPlayer(data.ship, data.pid);
		})

		socket.on(sc.server.newasteroid, (data) => {
			debri.addAsteroid(data.asteroid, data.pid);
		})

		socket.on(sc.server.removeplayer, id => {
			debri.removePlayer(id);
			if(id == debri.pid) {
				socket.disconnect();
				socket.connect();
			}
		})

		socket.on(sc.server.removeasteroid, id => {
			debri.removeAsteroid(id);
		})

		socket.on(sc.server.update, (update) => {
			for(var data of update.p) {
				var p = debri.players[data.pid];
				if(!p) return;
				Object.assign(p, data.data);
			}
			for(var data of update.a) {
				var p = debri.asteroids[data.pid];
				if(!p) return;
				Object.assign(p, data.data);
			}
			c.render();
		})

		socket.on('disconnect', () => {
			debri.stop();
			debri.players = {};
			debri.asteroids = {};
			menu.hidden = 0;
			canvas.hidden = 1;
		})


	}

	enter(name) {
		this.socket.emit(sc.client.enter, name);
	}

	thrust(t) {
		this.socket.emit(sc.client.thrust, t);
	}

	fire(t) {
		this.socket.emit(sc.client.fire, t);
	}

	turn(t) {
		this.socket.emit(sc.client.turn, t);
	}
}

export { SocketConnection }