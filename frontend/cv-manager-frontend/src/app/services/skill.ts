import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SkillRequest, SkillResponse } from '../models/skill.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SkillService {

    private apiUrl = `${environment.apiUrl}/skill`;

    constructor(private http: HttpClient) { }

    getSkills(): Observable<SkillResponse[]> {
        return this.http.get<SkillResponse[]>(this.apiUrl);
    }

    createSkill(s: SkillRequest): Observable<SkillResponse> {
        return this.http.post<SkillResponse>(this.apiUrl, s);
    }

    updateSkill(id: number, s: SkillRequest): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${id}`, s);
    }

    deleteSkill(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}