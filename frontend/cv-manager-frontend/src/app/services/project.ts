import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProjectRequest, ProjectResponse } from '../models/project.model';
import { environment } from '../../environments/environment';



@Injectable({
    providedIn: 'root'
})
export class ProjectService {

    private apiUrl = `${environment.apiUrl}/project`;

    constructor(private http: HttpClient) { }

    getProjects(): Observable<ProjectResponse[]> {
        return this.http.get<ProjectResponse[]>(this.apiUrl);
    }

    createProject(p: ProjectRequest): Observable<ProjectResponse> {
        return this.http.post<ProjectResponse>(this.apiUrl, p);
    }

    updateProject(id: number, p: ProjectRequest): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${id}`, p);
    }

    deleteProject(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}