export type Lifecycle = "singleton" | "transient";

export interface ServiceId<T> {
	readonly id: symbol;
	readonly name: string;
	// Phantom marker: keeps T referenced so resolve() infers the return type. Never set at runtime.
	readonly _type?: T;
}

export const defineService = <T>(name: string): ServiceId<T> => ({
	id: Symbol(name),
	name,
});

type Factory<T> = (container: DiContainer) => T;

interface Registration {
	factory: Factory<unknown>;
	lifecycle: Lifecycle;
}

/**
 *
 * - `singleton`: 싱글턴 객체.
 * - `transient`: 매 호출마다 새로운 인스턴스를 생성.
 */
export class DiContainer {
	private registrations: Map<symbol, Registration>;
	private singletons: Map<symbol, unknown>;

	constructor() {
		this.registrations = new Map();
		this.singletons = new Map();
	}

	register<T>(serviceId: ServiceId<T>, factory: Factory<T>, lifecycle: Lifecycle = "singleton"): this {
		this.registrations.set(serviceId.id, { factory: factory as Factory<unknown>, lifecycle });
		return this;
	}

	resolve<T>(serviceId: ServiceId<T>): T {
		const registration = this.registrations.get(serviceId.id);
		if (!registration) {
			throw new Error(`No binding registered for service "${serviceId.name}"`);
		}

		if (registration.lifecycle === "singleton" && this.singletons.has(serviceId.id)) {
			return this.singletons.get(serviceId.id) as T;
		}

		const instance = registration.factory(this);
		if (registration.lifecycle === "singleton") {
			this.singletons.set(serviceId.id, instance);
		}
		return instance as T;
	}
}
