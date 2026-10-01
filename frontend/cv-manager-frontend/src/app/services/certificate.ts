import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CertificateRequest, CertificateResponse } from '../models/certificate.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CertificateService {

    private apiUrl = `${environment.apiUrl}/certificate`;

    constructor(private http: HttpClient) { }

    getCertificates(): Observable<CertificateResponse[]> {
        return this.http.get<CertificateResponse[]>(this.apiUrl);
    }

    createCertificate(
        c: CertificateRequest
    ): Observable<CertificateResponse> {
        return this.http.post<CertificateResponse>(this.apiUrl, c);
    }

    updateCertificate(
        id: number,
        c: CertificateRequest
    ): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${id}`, c);
    }

    deleteCertificate(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}