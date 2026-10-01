import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CVRequest, CVResponse, CVSummaryResponse } from '../models/cv.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CvService {

  private apiUrl = `${environment.apiUrl}/cv`;

  constructor(private http: HttpClient) { }

  // Dashboard list: summaries only, no content
  getCVs(): Observable<CVSummaryResponse[]> {
    return this.http.get<CVSummaryResponse[]>(this.apiUrl);
  }

  // One full CV, for editing or previewing
  getCV(id: number): Observable<CVResponse> {
    return this.http.get<CVResponse>(`${this.apiUrl}/${id}`);
  }

  // Send a request shape, get back the saved CV (with its new id)
  postCV(cv: CVRequest): Observable<CVResponse> {
    return this.http.post<CVResponse>(this.apiUrl, cv);
  }

  // The API answers 204 No Content, so there's nothing to read
  putCV(id: number, cv: CVRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, cv);
  }

  deleteCV(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}