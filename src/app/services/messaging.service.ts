import { Injectable } from '@angular/core';
import { getToken, onMessage, Messaging } from '@angular/fire/messaging';
import { inject } from '@angular/core';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { environment } from '../enviroment';

@Injectable({ providedIn: 'root' })
export class MessagingService {
  private messaging = inject(Messaging);
  private firestore = inject(Firestore);
  private auth = inject(Auth);

  async requestPermissionAndSaveToken() {
    try {
      const registration = await navigator.serviceWorker.register(
        '/AngularShoppingList/firebase-messaging-sw.js'
      );

      const token = await getToken(this.messaging, {
        vapidKey: environment.firebase.vapidKey,
        serviceWorkerRegistration: registration,
      });

      const user = this.auth.currentUser;
      if (user && token) {
        const ref = doc(this.firestore, `users/${user.uid}`);
        await setDoc(ref, { fcmToken: token }, { merge: true });
      }
    } catch (err) {
      console.error('Unable to get notification permission:', err);
    }
  }

  listenForMessages() {
    onMessage(this.messaging, (payload) => {
      console.log('FCM Message received:', payload);
    });
  }
}
