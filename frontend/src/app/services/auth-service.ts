import { HttpClient } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { Observable, tap } from "rxjs";
import { AuthResponse } from "../interfaces/user";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5164/api/auth';
  currentUser = signal<any>(this.getUserFromLocalStorage());

  constructor(private http: HttpClient){}

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(credentials: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.currentUser.set(response.user);
      })
    )
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }

  isLoggedIn(): boolean {
    return !!this.currentUser();
  }

  private getUserFromLocalStorage() {
    const userJson = localStorage.getItem("user");
    try{
      return userJson ? JSON.parse(userJson) : null;
    } catch {
      return null;
    }
  }

  get user(){
    return this.currentUser();
  }
}
