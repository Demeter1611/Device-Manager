import { Component, inject } from "@angular/core";
import { AuthService } from "../services/auth-service";
import { FormControl, FormGroup, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: 'app-authentication',
  imports: [ReactiveFormsModule],
  template: `
    <div class="authentication-page">
      <div class="form-container">
        <h3>{{mode.toUpperCase()}}</h3>
        @if(mode === 'login'){
          <form [formGroup]="loginForm">
            <div class="form-field">
              <label for="login-email">Email</label>
              <input class="text-input" id="login-email" type="email" formControlName="email">
              @if(isInvalid("email")){
                <span class="error-text">Field required</span>
              }
            </div>
            <div class="form-field">
              <label for="login-password">Password</label>
              <input class="text-input" id="login-password" type="password" formControlName="password">
              @if(isInvalid("password")){
                <span class="error-text">Field required</span>
              }
            </div>
            <button class="submit-btn" (click)="onLogin()">Login</button>
            <span class="nav-text" (click)="toggleMode()">Create your account</span>
          </form>
        }
        @if(mode === 'register'){
          <form [formGroup]="registerForm">
            <div class="form-field">
              <label for="reg-email">Email</label>
              <input class="text-input" id="reg-email" formControlName="email">
              @if(isInvalid("email")){
                <span class="error-text">Field required</span>
              }
            </div>
            <div class="form-field">
              <label for="full-name">Full name</label>
              <input class="text-input" id="full-name" type="text" formControlName="fullName">
              @if(isInvalid("fullName")){
                <span class="error-text">Field required</span>
              }
            </div>
            <div class="form-field">
              <label for="reg-password">Password</label>
              <input class="text-input" id="reg-password" type="password" formControlName="password">
              @if(isInvalid("password")){
                <span class="error-text">Field required</span>
              }
            </div>
            <button class="submit-btn" (click)="onRegister()">Register</button>
            <div class="footer-text">
              Already have an account?
              <span class="nav-text" (click)="toggleMode()">Sign in</span>
            </div>
          </form>
        }
      </div>
    </div>
  `,
  styleUrls: ['authentication.css'],
})
export class AuthenticationComponent{
  authService = inject(AuthService);
  router = inject(Router);
  mode: string = "login";

  loginForm!: FormGroup;
  registerForm!: FormGroup;

  ngOnInit(){
    this.loginForm = new FormGroup(
      {
        email: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required])
      }
    )

    this.registerForm = new FormGroup(
      {
        fullName: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required])
      }
    )
  }

  toggleMode() {
    this.mode = this.mode === 'login' ? 'register' : 'login';
  }

  onRegister() {
    if(this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    const user = this.registerForm.value;
    this.authService.register(user).subscribe({
      next: () => {
        this.toggleMode();
        this.loginForm.patchValue({email: user.email})
      },
      error: (err) => alert(`Registration failed: ${err.message}`)
    });
  }

  onLogin() {
    if(this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    const user = this.loginForm.value;
    this.authService.login(user).subscribe({
      next: () => {
        this.router.navigate(['']);
      },
      error: (err) => alert(`Login failed: ${err.message}`)
    })
  }

  isInvalid(field: string){
    let control;
    if(this.mode === 'login'){
      control = this.loginForm.get(field);
    }
    else{
      control = this.registerForm.get(field);
    }
    return !!(control && control.invalid && control.touched);
  }
}
