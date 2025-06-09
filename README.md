# Shopli

**Shopli** is a responsive Progressive Web App (PWA) built with Angular, designed to help users plan and manage their shopping trips more efficiently.

## 🌟 Features

- **User Authentication**: Sign in using email/password or Google account.
- **Smart Shopping Lists**:
  - Create shopping lists with planned dates.
  - Add products manually or by scanning barcodes.
  - Select a nearby shop using Google Maps integration.
- **Modify or Delete Lists**: Easily update or remove lists as plans change.
- **Cloud-Based Storage**: All data is securely stored using Firebase.
- **Smart Notifications**: Users receive a notification at 9:00 AM on the day of planned shopping via Google Cloud Messaging and Functions.
- **PWA Support**: Install the app on your device and use it offline like a native app.

## 🚀 Technologies Used

- **Angular**
- **Firebase (Firestore, Authentication, Cloud Functions, Messaging)**
- **Google Maps API**
- **Google Cloud Messaging**
- **Barcode Scanning**
- **PWA Configuration**

## 🔧 Environment Configuration

Use the following structure in your `environment.ts`:

```ts
export const environment = {
  production: false,
  firebase: {
    apiKey: 'key',
    authDomain: 'key',
    projectId: 'key',
    storageBucket: 'key',
    messagingSenderId: 'key',
    appId: 'key',
    measurementId: 'key',
    vapidKey: 'key',
  },
  googleMapsApiKey: 'key',
};
```

## 🛠 Development

### Start Development Server

```bash
ng serve
```

Navigate to http://localhost:4200/ in your browser. The app reloads automatically when changes are made.

### Build for Production

```bash
ng build
```

### Run Unit Tests

```bash
ng test
```

### Run End-to-End Tests

```bash
ng e2e
```

## 📱 PWA Installation

You can install Shopli on your device by visiting the app in a browser and choosing the "Add to Home Screen" option.

## 📬 Notifications

Google Cloud Messaging is used to notify users of upcoming shopping trips at 9:00 AM on the planned day. Ensure push notifications are enabled and permissions are granted.

## 📂 Folder Structure

```plaintext
Shopli/
├── src/
│   ├── app/
│   ├── assets/
│   └── environments/
├── angular.json
├── package.json
└── README.md
```

## 🤝 Contributions

Feel free to fork this repository, make changes, and submit a pull request!

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

© 2025 [calKU0](https://github.com/calKU0)
