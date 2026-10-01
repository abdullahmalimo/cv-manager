import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EducationRequest, EducationResponse } from '../models/education.model';
import { environment } from '../../environments/environment';


@Injectable({
    providedIn: 'root'
})
export class EducationService {

    private apiUrl = `${environment.apiUrl}/education`;
    constructor(private http: HttpClient) { }

    getEducations(): Observable<EducationResponse[]> {
        return this.http.get<EducationResponse[]>(this.apiUrl);
    }

    createEducation(e: EducationRequest): Observable<EducationResponse> {
        return this.http.post<EducationResponse>(this.apiUrl, e);
    }

    updateEducation(id: number, e: EducationRequest): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${id}`, e);
    }

    deleteEducation(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}