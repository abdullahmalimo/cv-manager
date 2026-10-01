import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProfileRequest, ProfileResponse } from '../models/profile.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ProfileService {

    private apiUrl = `${environment.apiUrl}/profile`;

    constructor(private http: HttpClient) { }

    getProfile(): Observable<ProfileResponse> {
        return this.http.get<ProfileResponse>(this.apiUrl);
    }

    createProfile(profile: ProfileRequest): Observable<ProfileResponse> {
        return this.http.post<ProfileResponse>(this.apiUrl, profile);
    }

    // The API answers 204 No Content
    updateProfile(profile: ProfileRequest): Observable<void> {
        return this.http.put<void>(this.apiUrl, profile);
    }
}