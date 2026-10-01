import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExperienceRequest, ExperienceResponse } from '../models/experience.model';
import { environment } from '../../environments/environment';


@Injectable({
    providedIn: 'root'
})
export class ExperienceService {

    private apiUrl = `${environment.apiUrl}/experience`;

    constructor(private http: HttpClient) { }

    getExperiences(): Observable<ExperienceResponse[]> {
        return this.http.get<ExperienceResponse[]>(this.apiUrl);
    }

    createExperience(e: ExperienceRequest): Observable<ExperienceResponse> {
        return this.http.post<ExperienceResponse>(this.apiUrl, e);
    }

    updateExperience(id: number, e: ExperienceRequest): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${id}`, e);
    }

    deleteExperience(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}