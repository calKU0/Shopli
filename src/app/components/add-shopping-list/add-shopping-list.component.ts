import { Component, EventEmitter, inject, Output } from '@angular/core';
import { NgModel, FormsModule } from '@angular/forms';
import {
  Firestore,
  collection,
  addDoc,
  doc,
  setDoc,
  deleteDoc,
} from '@angular/fire/firestore';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { ShopMapComponent } from '../shop-map/shop-map.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';
import { AddProductComponent } from '../add-product/add-product.component';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-add-shopping-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ShopMapComponent,
    ZXingScannerModule,
    AddProductComponent,
  ],
  templateUrl: './add-shopping-list.component.html',
})
export class AddShoppingListComponent {
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  allowedFormats = [BarcodeFormat.EAN_13];
  isScanning = false;

  @Output() close = new EventEmitter<void>();

  listName = '';
  plannedDate = '';
  selectedShop: any = null;
  user: User | null = null;
  newItemName = '';
  newItemQty: number = 1;
  items: { name: string; quantity: number }[] = [];

  constructor() {
    onAuthStateChanged(this.auth, (user) => (this.user = user));
  }

  selectedLocation: { lat: number; lng: number } | null = null;

  onLocationSelected(location: { lat: number; lng: number }) {
    this.selectedLocation = location;
  }

  startScanning() {
    this.isScanning = true;
  }

  stopScanning() {
    this.isScanning = false;
  }

  async createList() {
    if (
      !this.user ||
      !this.selectedLocation ||
      !this.listName ||
      !this.plannedDate
    )
      return;

    const listsCollection = collection(
      this.firestore,
      'shoppingLists',
      this.user.uid,
      'lists'
    );
    const listDocRef = await addDoc(listsCollection, {
      name: this.listName,
      plannedDate: this.plannedDate,
      coordinates: this.selectedLocation,
    });

    const productsCollection = collection(this.firestore, 'products');
    for (const item of this.items) {
      const productId = uuidv4(); // generate unique ID
      await setDoc(doc(productsCollection, productId), {
        ...item,
        listId: listDocRef.id,
        userId: this.user.uid,
      });
    }

    this.close.emit();
  }
}
