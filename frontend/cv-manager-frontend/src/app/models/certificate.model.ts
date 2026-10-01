// What Angular sends (POST and PUT). Mirrors CertificateRequestDTO.
export interface CertificateRequest {
  name: string;
  issuer: string;
  description: string | null;
  url: string | null;
  issueDate: string; // "yyyy-MM-dd"
}

// What the API returns. Mirrors CertificateResponseDTO.
export interface CertificateResponse {
  id: number;
  name: string;
  issuer: string;
  description: string | null;
  url: string | null;
  issueDate: string; // "2025-06-01T00:00:00"
}