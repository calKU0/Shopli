import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from '@angular/fire/auth';
import { inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule], // Add FormsModule here for ngModel
  templateUrl: './login.component.html', // Reference the HTML file here
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  isLoginMode: boolean = true; // Toggle between Login and Registration forms

  private auth = inject(Auth);
  private router = inject(Router);

  onSubmit() {
    if (this.isLoginMode) {
      this.onLogin();
    } else {
      this.onRegister();
    }
  }

  // Handle Email/Password Login
  onLogin() {
    signInWithEmailAndPassword(this.auth, this.email, this.password)
      .then((userCredential) => {
        console.log('Zalogowano pomyślnie:', userCredential);
        this.router.navigate(['/list']); // Redirect after login
      })
      .catch((error) => {
        console.error('Błąd logowania:', error.message);
      });
  }

  // Handle Email/Password Registration
  onRegister() {
    createUserWithEmailAndPassword(this.auth, this.email, this.password)
      .then((userCredential) => {
        console.log('Zarejestrowano pomyślnie:', userCredential);
        this.router.navigate(['/list']); // Redirect after registration
      })
      .catch((error) => {
        console.error('Błąd rejestracji:', error.message);
      });
  }

  // Handle Google Login
  loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(this.auth, provider)
      .then((userCredential) => {
        console.log('Zalogowano przez Google:', userCredential);
        this.router.navigate(['/list']); // Redirect after Google login
      })
      .catch((error) => {
        console.error('Błąd logowania przez Google:', error.message);
      });
  }

  // Toggle between Login and Register mode
  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
  }
}
