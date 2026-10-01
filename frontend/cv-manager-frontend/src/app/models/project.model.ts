// What Angular sends (POST and PUT). Mirrors ProjectRequestDTO.
export interface ProjectRequest {
  name: string;
  description: string | null;
  technologies: string | null;
  url: string | null;
  startDate: string | null;
  endDate: string | null;
}

// What the API returns. Mirrors ProjectResponseDTO.
export interface ProjectResponse {
  id: number;
  name: string;
  description: string | null;
  technologies: string | null;
  url: string | null;
  startDate: string | null;
  endDate: string | null;
}