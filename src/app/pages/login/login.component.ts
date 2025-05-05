import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  isLoginMode: boolean = true;
  fullName: string = '';

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

  onLogin() {
    signInWithEmailAndPassword(this.auth, this.email, this.password)
      .then((userCredential) => {
        this.router.navigate(['']);
      })
      .catch((error) => {
        console.error('Błąd logowania:', error.message);
      });
  }

  onRegister() {
    createUserWithEmailAndPassword(this.auth, this.email, this.password)
      .then(async (userCredential) => {
        const user = userCredential.user;

        const userDocRef = doc(this.firestore, 'users', user.uid);
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          fullName: this.fullName,
          createdAt: new Date(),
        });

        this.router.navigate(['']);
      })
      .catch((error) => {
        console.error('Registration error:', error.message);
      });
  }

  loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(this.auth, provider)
      .then(async (userCredential) => {
        const user = userCredential.user;
        const displayName = user.displayName || '';
        const fullName = user.displayName || '';

        const userDocRef = doc(this.firestore, 'users', user.uid);
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          fullName: fullName,
          createdAt: new Date(),
        });

        this.router.navigate(['']);
      })
      .catch((error) => {
        console.error('Google login error:', error.message);
      });
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
  }
}
