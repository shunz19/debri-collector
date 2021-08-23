import { Canvas } from './renderer/Canvas.js';
import { SocketConnection } from './socket/connection.js';
import { DebriGame } from './debri.js';

var main = {

}

var debri = new DebriGame();
var canvas = new Canvas(debri, main);
document.body.appendChild(canvas.canvas);
var socketConnection = new SocketConnection(io(), debri, canvas, document.querySelector(".menu"));

main.socketConnection = socketConnection;

var nameDOM = document.getElementById("m-name");
var enterButton = document.getElementById("m-enter");

enterButton.addEventListener("click", () => {
	socketConnection.enter(nameDOM.value);
})

document.getElementById("w").addEventListener("touchstart", (e) => e.preventDefault() &canvas.keydown({key:"w"}));
document.getElementById("w").addEventListener("touchend", (e) => e.preventDefault() &canvas.keyup({key:"w"}));
document.getElementById("a").addEventListener("touchstart", (e) => e.preventDefault() &canvas.keydown({key:"a"}));
document.getElementById("a").addEventListener("touchend", (e) => e.preventDefault() &canvas.keyup({key:"a"}));
document.getElementById("s").addEventListener("touchstart", (e) => e.preventDefault() &canvas.keydown({key:" "}));
document.getElementById("s").addEventListener("touchend", (e) => e.preventDefault() &canvas.keyup({key:" "}));
document.getElementById("d").addEventListener("touchstart", (e) => e.preventDefault() &canvas.keydown({key:"d"}));
document.getElementById("d").addEventListener("touchend", (e) => e.preventDefault() &canvas.keyup({key:"d"}));

document.getElementById("w").addEventListener("mousedown", (e) => e.preventDefault() &canvas.keydown({key:"w"}));
document.getElementById("w").addEventListener("mouseup", (e) => e.preventDefault() &canvas.keyup({key:"w"}));
document.getElementById("a").addEventListener("mousedown", (e) => e.preventDefault() &canvas.keydown({key:"a"}));
document.getElementById("a").addEventListener("mouseup", (e) => e.preventDefault() &canvas.keyup({key:"a"}));
document.getElementById("s").addEventListener("mousedown", (e) => e.preventDefault() &canvas.keydown({key:" "}));
document.getElementById("s").addEventListener("mouseup", (e) => e.preventDefault() &canvas.keyup({key:" "}));
document.getElementById("d").addEventListener("mousedown", (e) => e.preventDefault() &canvas.keydown({key:"d"}));
document.getElementById("d").addEventListener("mouseup", (e) => e.preventDefault() &canvas.keyup({key:"d"}));

window.debri = debri;