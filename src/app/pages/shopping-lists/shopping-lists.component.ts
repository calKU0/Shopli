import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import { Observable, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AddShoppingListComponent } from '../../components/add-shopping-list/add-shopping-list.component';

@Component({
  selector: 'app-shopping-lists',
  standalone: true,
  imports: [CommonModule, AddShoppingListComponent],
  templateUrl: './shopping-lists.component.html',
})
export class ShoppingListsComponent implements OnInit {
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private router = inject(Router);
  shoppingLists$!: Observable<any[]>;
  user: User | null = null;
  showAddModal = false;

  ngOnInit() {
    onAuthStateChanged(this.auth, user => {
      if (!user) return;
      this.user = user;
      const colRef = collection(this.firestore, 'shoppingLists', user.uid, 'lists');
      this.shoppingLists$ = collectionData(colRef, { idField: 'id' }).pipe(
        map(lists => lists.map(list => ({
          ...list,
          itemCount: Array.isArray((list as any)['items']) ? (list as any)['items'].length : 0
        })))
      );
    });
  }

  goToList(listId: string) {
    this.router.navigate(['/list', listId]);
  }

  openAddListModal() {
    this.showAddModal = true;
  }

  closeAddListModal() {
    this.showAddModal = false;
  }
}
