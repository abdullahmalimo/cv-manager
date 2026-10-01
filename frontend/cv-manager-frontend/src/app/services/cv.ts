import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface PersonalInformation {
  id: number;
  fullName: string;
  cityName?: string;
  email: string;
  mobileNumber: string;
}

export interface ExperienceInformation {
  id: number;
  companyName: string;
  city?: string;
  companyField?: string;
}

export interface CV {
  id: number;
  name: string;
  personalInformation: PersonalInformation;
  experienceInformation: ExperienceInformation;
}

@Injectable({
  providedIn: 'root'
})
export class CvService {
  private apiUrl = 'https://localhost:5001/api/cv';


  constructor(private http: HttpClient) {}

  getCVs(): Observable<CV[]> {
    return this.http.get<CV[]>(this.apiUrl);
  }

  getCV(id: number): Observable<CV> {
    return this.http.get<CV>(`${this.apiUrl}/${id}`);
  }

  postCV(cv: CV): Observable<CV> {
    return this.http.post<CV>(this.apiUrl, cv);
  }

  putCV(id: number, cv: CV): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, cv);
  }

  deleteCV(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
