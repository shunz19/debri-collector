import { Matter } from "./matter.js";

class Coin extends Matter {
	constructor(x, y) {
		super(x, y, 15, "coin");
		this.type = "Coin";
	}
}

export { Coin }