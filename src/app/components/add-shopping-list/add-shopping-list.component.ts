import { Component, EventEmitter, inject, Output } from '@angular/core';
import { NgModel, FormsModule } from '@angular/forms';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { ShopMapComponent } from '../shop-map/shop-map.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';

@Component({
  selector: 'app-add-shopping-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ShopMapComponent,ZXingScannerModule],
  templateUrl: './add-shopping-list.component.html'
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
    onAuthStateChanged(this.auth, (user) => this.user = user);
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



addItemToList() {
  if (!this.newItemName || !this.newItemQty) return;

  this.items.push({
    name: this.newItemName,
    quantity: this.newItemQty
  });

  this.newItemName = '';
  this.newItemQty = 1;
}

async onCodeResult(barcode: string) {
  if (!barcode) return;

  console.log('Scanned barcode:', barcode);

  this.isScanning = false; // 👈 Hide scanner after successful scan

  const productName = await this.fetchProductNameFromBarcode(barcode);
  if (productName) {
    this.newItemName = productName;
    this.newItemQty = 1;
  } else {
    alert('Product not found for this barcode.');
  }
}


async fetchProductNameFromBarcode(barcode: string): Promise<string | null> {
  try {
    const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
    const data = await response.json();
    if (data.status === 1) {
      return data.product.product_name || null;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}



  async createList() {
    if (!this.user || !this.selectedLocation || !this.listName || !this.plannedDate) return;

    const newList = {
      name: this.listName,
      plannedDate: this.plannedDate,
      coordinates: this.selectedLocation,
      items: this.items
    };

    const listsCollection = collection(this.firestore, 'shoppingLists', this.user.uid, 'lists');
    await addDoc(listsCollection, newList);

    this.close.emit();
  }
}
