import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule, ZXingScannerModule],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent {
  @Input() enableScanner: boolean = false;
  @Output() productAdded = new EventEmitter<{
    name: string;
    quantity: number;
  }>();

  allowedFormats = [BarcodeFormat.EAN_13];
  isScanning = false;

  newItemName = '';
  newItemQty = 1;

  startScanning() {
    this.isScanning = true;
  }

  stopScanning() {
    this.isScanning = false;
  }

  async onCodeResult(barcode: string) {
    this.isScanning = false;
    const productName = await this.fetchProductNameFromBarcode(barcode);
    if (productName) {
      this.newItemName = productName;
    } else {
      alert('Product not found for this barcode.');
    }
  }

  async fetchProductNameFromBarcode(barcode: string): Promise<string | null> {
    try {
      const response = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
      );
      const data = await response.json();
      if (data.status === 1) {
        return data.product.product_name || null;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Barcode fetch error:', error);
      return null;
    }
  }

  addItem() {
    const name = this.newItemName;
    const quantity = this.newItemQty;

    if (!name || !quantity) return;

    this.productAdded.emit({ name, quantity });

    this.newItemName = '';
    this.newItemQty = 1;
  }
}
