import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RegisterRequest {
    email: string;
    password: string;
    username: string;
    confirmpassword: string;
}


export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    message: string;
    token: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private apiUrl = 'https://localhost:5001/api/Auth';

    constructor(private http: HttpClient) { }

    register(registerRequest: RegisterRequest): Observable<any> {
        return this.http.post(
            `${this.apiUrl}/register`,
            registerRequest
        );
    }

    login(loginRequest: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(
            `${this.apiUrl}/login`,
            loginRequest
        );
    }
    logout(): void {
        localStorage.removeItem('token');
    }
}