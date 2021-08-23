import { Matter } from "./matter.js";

class Bullet extends Matter {
	constructor(x, y, a, ownerpid) {
		super(x, y, 10, "bullet", a);
		this.thruston();
		this.ownerpid = ownerpid;
		this.mv = 20;
		this.ac = 20;
		this.type = "Bullet";
	}
}

export { Bullet }