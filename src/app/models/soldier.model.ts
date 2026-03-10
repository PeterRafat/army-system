export interface Soldier {
  id: string;
  serial_number: string;
  name: string;
  normalized_name: string;
  police_number: string;
  governorate: string;
  qualification: string;
  current_unit: string;
  batch: string;
  assigned_date: string;
  created_at: string;
}

export interface Recommendation {
  id: string;
  soldier_id: string;
 recommended_to?: string; // Optional - no longer used in UI
 recommended_by: string;
  target_unit: string;
  created_at: string;
  soldier?: Soldier;
}
