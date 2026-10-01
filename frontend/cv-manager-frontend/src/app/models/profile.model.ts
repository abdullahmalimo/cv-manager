// What Angular sends (POST and PUT). Mirrors ProfileRequestDTO.
export interface ProfileRequest {
  fullName: string;
  contactEmail: string;
  mobileNumber: string;
  cityName: string | null;
  summary: string | null;
}

// What the API returns (GET and the POST result). Mirrors ProfileResponseDTO.
export interface ProfileResponse {
  fullName: string;
  contactEmail: string;
  mobileNumber: string;
  cityName: string | null;
  summary: string | null;
}