import { Component, inject, OnInit } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  deleteDoc,
  doc,
} from '@angular/fire/firestore';
import { Auth, User, onAuthStateChanged } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms'; // Add FormsModule here for ngModel support
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shopping-list',
  standalone: true,
  imports: [FormsModule, CommonModule], // Import FormsModule here
  templateUrl: './shopping-list.component.html', // Reference to external HTML template
  styleUrls: ['./shopping-list.component.scss'],
})
export class ShoppingListComponent implements OnInit {
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  shoppingItems$!: Observable<any[]>;

  // For new item form
  newItemName: string = '';
  newItemQuantity: number = 1;

  ngOnInit() {
    // Replace 'authState' with 'onAuthStateChanged'
    onAuthStateChanged(this.auth, (user: User | null) => {
      // Use `onAuthStateChanged` method
      if (user) {
        // Fetch the shopping list for the logged-in user
        const itemsCollection = collection(
          this.firestore,
          'shoppingLists',
          user.uid,
          'items'
        );
        this.shoppingItems$ = collectionData(itemsCollection, {
          idField: 'id',
        });
      } else {
        console.error('User is not logged in');
      }
    });
  }

  // Add item to the shopping list
  addItem() {
    const user = this.auth.currentUser;
    if (user) {
      const newItem = {
        name: this.newItemName,
        quantity: this.newItemQuantity,
      };
      const itemsCollection = collection(
        this.firestore,
        'shoppingLists',
        user.uid,
        'items'
      );
      addDoc(itemsCollection, newItem)
        .then(() => {
          console.log('Item added!');
          // Reset the form after adding the item
          this.newItemName = '';
          this.newItemQuantity = 1;
        })
        .catch((error) => {
          console.error('Error adding item:', error);
        });
    } else {
      console.error('User is not logged in');
    }
  }

  // Remove item from the shopping list
  removeItem(itemId: string) {
    const user = this.auth.currentUser;
    if (user) {
      const itemDoc = doc(
        this.firestore,
        'shoppingLists',
        user.uid,
        'items',
        itemId
      );
      deleteDoc(itemDoc)
        .then(() => {
          console.log('Item removed!');
        })
        .catch((error) => {
          console.error('Error removing item:', error);
        });
    } else {
      console.error('User is not logged in');
    }
  }
}
