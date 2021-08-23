const Constants = {
	worldSize: {
		x: 10000,
		y: 10000
	}
}

const SocketConstants = {
	client: {
		enter: 'enter',
		thrust: 't',
		turn: 'tr',
		fire: "f",
	},
	server: {
		enter: 'enter',
		pdata: 'pd',
		newplayer: "np",
		removeplayer: "rp",
		removeasteroid: "ra",
		newasteroid: "na",
		update: 'u',
	}
}

export { Constants, SocketConstants }