import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessagingService } from './services/messaging.service';
import { Auth, authState } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [MessagingService],
})
export class AppComponent implements OnInit {
  title = 'AngularShoppingList';

  private messagingService = inject(MessagingService);
  private auth = inject(Auth);

  ngOnInit(): void {
    // Only request permission after the user is authenticated
    authState(this.auth).subscribe((user) => {
      if (user) {
        this.messagingService.requestPermissionAndSaveToken();
        this.messagingService.listenForMessages();
      }
    });
  }
}
