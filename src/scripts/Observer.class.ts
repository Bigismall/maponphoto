import type { Message } from "./Message.type";
import { log } from "./console.ts";

export default abstract class Observer {
	protected constructor() {}

	update(publication: Message) {
		log("Publication [Observer]", publication);
	}
}
