// What Angular sends (POST and PUT). Mirrors EducationRequestDTO.
export interface EducationRequest {
  institution:string;
  degree:string;
  studyField:string | null;
  startDate: string;          // "yyyy-MM-dd"
  endDate: string | null;     // null = current job
}

// What the API returns. Mirrors EducationResponseDTO.
export interface EducationResponse {
  id: number;
  institution: string;  
  degree:string;
  studyField:string | null;
  startDate: string;          // "2025-06-01T00:00:00"
  endDate: string | null;
}