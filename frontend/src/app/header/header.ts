import { Component, inject } from "@angular/core";
import { AuthService } from "../services/auth-service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-header',
  template:`
    <header class="navbar">
      <h1 class="nav-logo">Device Manager</h1>

      <div class="user-section">
        @if(authService.isLoggedIn()){
          <span class="welcome-msg">Welcome, <strong>{{ authService.user?.fullName }}</strong>!</span>
          <button (click)="onLogout()">Logout</button>
        }
        @else {
          <button (click)="onLogin()">Login</button>
        }
      </div>
    </header>
  `,
  styleUrls: ['header.css']
})
export class HeaderComponent{
  authService = inject(AuthService);
  router = inject(Router);

  onLogout(){
    this.authService.logout();
    this.router.navigate(['/auth']);
  }

  onLogin(){
    this.router.navigate(['/auth']);
  }
}
