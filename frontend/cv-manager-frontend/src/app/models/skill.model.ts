// What Angular sends (POST and PUT). Mirrors SkillRequestDTO.
export interface SkillRequest {
  name: string;
  level: number | null;
}

// What the API returns. Mirrors SkillResponseDTO.
export interface SkillResponse {
  id: number;
  name: string;
  level: number | null;
}