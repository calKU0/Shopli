import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessagingService } from './services/messaging.service';

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

  ngOnInit(): void {
    this.messagingService.requestPermissionAndSaveToken();
    this.messagingService.listenForMessages();
  }
}
