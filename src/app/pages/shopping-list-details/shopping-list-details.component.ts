import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Firestore, collection, doc, addDoc, deleteDoc, collectionData, getDoc } from '@angular/fire/firestore';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { GoogleMapsModule } from '@angular/google-maps';
import { AddProductComponent} from '../../components/add-product/add-product.component'

@Component({
  selector: 'app-shopping-list-details',
  standalone: true,
  imports: [CommonModule, FormsModule, GoogleMapsModule, AddProductComponent],
  templateUrl: './shopping-list-details.component.html'
})
export class ShoppingListDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private firestore = inject(Firestore);
  private auth = inject(Auth);

  user: User | null = null;
  listId!: string;
  listName = '';
  plannedDate = '';
  coordinates: { lat: number, lng: number } | null = null;

  newItemName = '';
  newItemQty = 1;
  items$!: Observable<any[]>;

  ngOnInit() {
    this.listId = this.route.snapshot.paramMap.get('id')!;
    onAuthStateChanged(this.auth, (user) => {
      this.user = user;
      if (user) this.loadListDetails();
    });
  }


  async loadListDetails() {
    const listRef = doc(this.firestore, 'shoppingLists', this.user!.uid, 'lists', this.listId);
    const listSnap = await getDoc(listRef);
    const listData = listSnap.data() as any;
  
    this.listName = listData.name;
    this.plannedDate = listData.plannedDate;
    this.coordinates = listData.coordinates || null;
  
    const itemsCollection = collection(this.firestore, 'shoppingLists', this.user!.uid, 'lists', this.listId, 'items');
    this.items$ = collectionData(itemsCollection, { idField: 'id' });
  }
  
  addItemFromChild(product: { name: string; quantity: number }) {
    if (!this.user) return;
  
    const itemsCollection = collection(this.firestore, 'shoppingLists', this.user.uid, 'lists', this.listId, 'items');
    addDoc(itemsCollection, product);
  }

  async removeItem(itemId: string) {
    if (!this.user) return;

    const itemRef = doc(this.firestore, 'shoppingLists', this.user.uid, 'lists', this.listId, 'items', itemId);
    await deleteDoc(itemRef);
  }
}
