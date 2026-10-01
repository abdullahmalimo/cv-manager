// What Angular sends (POST and PUT). Mirrors ExperienceRequestDTO.
export interface ExperienceRequest {
  companyName: string;
  jobTitle: string;
  description: string | null;
  city: string | null;
  startDate: string;          // "yyyy-MM-dd"
  endDate: string | null;     // null = current job
}

// What the API returns. Mirrors ExperienceResponseDTO.
export interface ExperienceResponse {
  id: number;
  companyName: string;
  jobTitle: string;
  description: string | null;
  city: string | null;
  startDate: string;          // "2025-06-01T00:00:00"
  endDate: string | null;
}