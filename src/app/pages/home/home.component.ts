import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink], // Add RouterLink here for routing
  templateUrl: './home.component.html', // Reference the HTML file here
})
export class HomeComponent {}
