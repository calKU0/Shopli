import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { CommonModule } from '@angular/common';
import { environment } from '../../enviroment';

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
    await this.loadGoogleMapsScript();

    this.mapReady = true;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          this.center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
        },
        error => {
          console.warn('Geolocation permission denied or unavailable.', error);
          // fallback to default (Kraków)
        }
      );
    }
  }

  onMapClick(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      this.markerPosition = { lat, lng };
      this.locationSelected.emit({ lat, lng });
    }
  }

  private loadGoogleMapsScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as any)['google'] && (window as any)['google'].maps) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = (error) => reject(error);

      document.body.appendChild(script);
    });
  }
}
