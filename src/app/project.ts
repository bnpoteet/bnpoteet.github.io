export interface Project {
	project_id: string;
	developer: string;
	project_name: string;
	market_rate_units: number;
	affordable_units: number;
	total_units: number;
	council_district: number;
	zip_code: number;
	development_status: string;
	longitude: number;
	latitude: number;
	address: string;
	affordability_start_date: string;
	affordability_unlocked: string;
	calculated_fee_in_lieu: number;
	fee_in_lieu_status: string;
}
