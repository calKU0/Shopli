import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  Firestore,
  collection,
  collectionData,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from '@angular/fire/firestore';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import { Observable, of, forkJoin, from } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { AddShoppingListComponent } from '../../components/add-shopping-list/add-shopping-list.component';
import { BackButtonComponent } from '../../components/back-button/back-button.component';

@Component({
  selector: 'app-shopping-lists',
  standalone: true,
  imports: [CommonModule, AddShoppingListComponent, BackButtonComponent],
  templateUrl: './shopping-lists.component.html',
})
export class ShoppingListsComponent implements OnInit {
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private router = inject(Router);
  shoppingLists$: Observable<any[]> = of([]);
  user: User | null = null;
  showAddModal = false;

  ngOnInit() {
    onAuthStateChanged(this.auth, (user) => {
      if (!user) return;
      this.user = user;
      this.loadShoppingLists(user);
    });
  }

  // Fetch shopping lists and count the number of items in each list
  loadShoppingLists(user: User) {
    const colRef = collection(this.firestore, 'shoppingLists');
    const userListsQuery = query(colRef, where('userId', '==', user.uid));

    this.shoppingLists$ = collectionData(userListsQuery, {
      idField: 'id',
    }).pipe(
      switchMap((lists) => {
        const listsWithCounts$ = lists.map((list: any) => {
          return this.getItemCount(list.id).pipe(
            map((itemCount) => ({
              ...list,
              itemCount,
            }))
          );
        });
        return forkJoin(listsWithCounts$);
      })
    );
  }

  // Fetch the item count for a specific list
  getItemCount(listId: string): Observable<number> {
    if (!this.user) return of(0);

    const productsRef = collection(this.firestore, 'products');
    const queryRef = query(productsRef, where('listId', '==', listId));

    return from(getDocs(queryRef)).pipe(
      map((snapshot) => snapshot.size),
      catchError((err) => {
        console.error('Error fetching products:', err);
        return of(0);
      })
    );
  }

  goToList(listId: string) {
    this.router.navigate(['/list', listId]);
  }

  async deleteList(listId: string) {
    if (!this.user) return;

    const confirmed = confirm(
      'Are you sure you want to delete this shopping list?'
    );
    if (!confirmed) return;

    const listDocRef = doc(this.firestore, 'shoppingLists', listId);
    await deleteDoc(listDocRef);

    // Optionally, delete associated products too
    const productsRef = collection(this.firestore, 'products');
    const listProductsQuery = query(productsRef, where('listId', '==', listId));
    const productSnapshots = await getDocs(listProductsQuery);
    const deletions = productSnapshots.docs.map((docSnap) =>
      deleteDoc(doc(this.firestore, 'products', docSnap.id))
    );
    await Promise.all(deletions);

    this.reloadLists();
  }

  openAddListModal() {
    this.showAddModal = true;
  }

  closeAddListModal() {
    this.showAddModal = false;
  }

  reloadLists() {
    if (!this.user) return;

    this.loadShoppingLists(this.user);
  }
}
