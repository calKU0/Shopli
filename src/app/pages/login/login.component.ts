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
import { Firestore, doc, setDoc } from '@angular/fire/firestore';

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

  private firestore = inject(Firestore);
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
        this.router.navigate(['']); // Redirect after login
      })
      .catch((error) => {
        console.error('Błąd logowania:', error.message);
      });
  }

  // Handle Email/Password Registration
  onRegister() {
    createUserWithEmailAndPassword(this.auth, this.email, this.password)
      .then(async (userCredential) => {
        // Get user details
        const user = userCredential.user;

        // Save user info to Firestore (in 'users' collection)
        const userDocRef = doc(this.firestore, 'users', user.uid); // Reference to the user's document
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          createdAt: new Date(), // You can add other fields as needed
        });

        // After Firestore update, navigate to another page
        this.router.navigate(['']); // Redirect after registration
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
        const user = userCredential.user;

        // Save user info to Firestore (in 'users' collection)
        const userDocRef = doc(this.firestore, 'users', user.uid); // Reference to the user's document
        setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          createdAt: new Date(), // You can add other fields as needed
        });

        this.router.navigate(['']); // Redirect after Google login
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
