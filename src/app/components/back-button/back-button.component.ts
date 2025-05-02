import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth'; // Import Firebase Auth
import { inject } from '@angular/core';

@Component({
  selector: 'app-back-button',
  standalone: true,
  template: `
    <button class="btn btn-outline-secondary mb-3" (click)="goBack()">
      ← Back
    </button>
  `,
})
export class BackButtonComponent {
  private auth = inject(Auth); // Inject Firebase Auth

  constructor(private location: Location, private router: Router) {}

  goBack() {
    // Use authState to check the user's authentication state
    authState(this.auth).subscribe((user) => {
      if (user) {
        // If the user is logged in, redirect to the home page
        this.router.navigate(['']);
      } else {
        // If the user is not logged in, go back to the previous page
        this.location.back();
      }
    });
  }
}
