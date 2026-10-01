
// What Angular SENDS (POST and PUT). Mirrors CVRequestDTO: no id, no dates.
export interface CVRequest {
  title: string;
  description?: string | null;
  templateName: string;
  content: string;
}

// What the API returns for ONE CV (GET /api/CV/{id} and the POST result). Mirrors CVResponseDTO.
export interface CVResponse {
  id: number;
  title: string;
  description: string | null;
  templateName: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// What the dashboard LIST returns (GET /api/CV). Mirrors CVSummaryResponseDTO. No content.
export interface CVSummaryResponse {
  id: number;
  title: string;
  description: string | null;
  templateName: string;
  createdAt: string;
  updatedAt: string;
}



// The structure we save inside CVRequest.content (as JSON text).
// The backend never reads it, so this interface is the only definition of its shape.

export interface CvPersonalDetails {
  fullName: string;
  email: string;
  mobileNumber: string;
  cityName: string;
}

export interface CvExperience {
  companyName: string;
  jobTitle: string;
  description: string | null;
  city: string | null;
  startDate: string;
  endDate: string | null;
}

export interface CvEducation {
  institution: string;
  degree: string;
  studyField: string | null;
  startDate: string;
  endDate: string | null;
}

export interface CvSkill {
  name: string;
  level: number | null;
}

export interface CvProject {
  name: string;
  description: string | null;
  technologies: string | null;
  url: string | null;
  startDate: string | null;
  endDate: string | null;
}

export interface CvCertificate {
  name: string;
  issuer: string;
  description: string | null;
  url: string | null;
  issueDate: string;
}

export interface CvContent {
  personalDetails: CvPersonalDetails;
  summary: string;
  experiences: CvExperience[];
  educations: CvEducation[];
  skills: CvSkill[];
  projects: CvProject[];
  certificates: CvCertificate[];
}