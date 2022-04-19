import { AffordabilityProgram } from "./affordability-program";

export interface Statistics {
	program: AffordabilityProgram;
	unitCount: number;
	affordableUnitCount: number;
	projectCount: number;
}
