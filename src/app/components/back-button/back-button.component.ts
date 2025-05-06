import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { inject } from '@angular/core';

@Component({
  selector: 'app-back-button',
  standalone: true,
  template: `
    <button class="btn btn-secondary mt-4 rounded-3" (click)="goBack()">
      ← Back
    </button>
  `,
})
export class BackButtonComponent {
  private auth = inject(Auth);

  constructor(private location: Location, private router: Router) {}

  goBack() {
    authState(this.auth).subscribe((user) => {
      if (user) {
        this.router.navigate(['']);
      } else {
        this.location.back();
      }
    });
  }
}
