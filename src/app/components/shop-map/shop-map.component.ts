import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shop-map',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule],
  templateUrl: './shop-map.component.html',
})
export class ShopMapComponent implements OnInit {
  @Output() locationSelected = new EventEmitter<{ lat: number; lng: number }>();

  center: google.maps.LatLngLiteral = { lat: 50.06143, lng: 19.93658 }; // Default: Kraków
  markerPosition: google.maps.LatLngLiteral | null = null;
  zoom = 14;
  mapReady = false;

  async ngOnInit() {
    const geo = navigator.geolocation;

    if (geo) {
      geo.getCurrentPosition(
        ({ coords }) => {
          const { latitude: lat, longitude: lng } = coords;
          this.center = { lat, lng };
        },
        (error) => {
          console.warn('Geolocation permission denied or unavailable.', error);
          // fallback to default (Kraków)
        }
      );
    }
  }

  onMapClick(event: google.maps.MapMouseEvent) {
    const coords = event.latLng;

    if (coords) {
      const lat = coords.lat();
      const lng = coords.lng();
      this.markerPosition = { lat, lng };
      this.locationSelected.emit({ lat, lng });
    }
  }
}
