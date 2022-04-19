import { AffordabilityProgram } from "./affordability-program";

export interface Statistics {
	program: AffordabilityProgram;
	constructedUnits: number;
	constructedAffordableUnits: number;
	constructedProjects: number;
	inProgressProjects: number;
	inProgressUnits: number;
	feeInLieu: number;
}
