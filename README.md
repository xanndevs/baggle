# Baggle

Baggle is a travel planning and bag-organization application built with Ionic Framework (React) and Capacitor.
The app lets users create trips (travels), add bags to a trip, and track items in each bag with status flags. The project is offline-first and localized. The app uses a single shared storage layer to persist data locally.


## Table of contents

* [Features](#features)

* [Tech stack](#tech-stack)

* [Prerequisites](#prerequisites)

* [Installation](#installation)

* [Native builds (Capacitor)](#native-builds-capacitor)

* [Storage and reactive updates](#storage-and-reactive-updates)

* [Localization (i18n)](#localization-i18n)

* [Contributing](#contributing)

* [License](#license)


## Features

* Create, edit and remove travels (trip plans).
* Add and manage multiple bags per travel.
* Add and manage items per bag with statuses: `store` (to buy), `ready` (owned), `packed` (in bag).
* Item metadata: name, quantity, optional image, price, notes, and category.
* Offline-first persistence via `@ionic/storage` with IndexedDB/LocalStorage fallback
* Multi-language support: English, Simplified Chinese, French, Spanish, Turkish.


## Tech stack

* Ionic Framework (React)
* Capacitor (native bridges / builds)
* TypeScript
* `@ionic/storage` for offline key-value persistence
* `react-i18next` or similar for translations (project contains locale JSON files)


## Prerequisites

* Node.js (Project uses v22.16.0)
* npm
* Ionic CLI (`@ionic/cli`) for local development and running `ionic serve`
* For native builds: Android Studio (Android) and/or Xcode (iOS)
    
    (You need to manually set the device permissions in the xcode project)


## Installation

```bash
git clone https://github.com/xanndevs/baggle.git
cd baggle
npm install

npm install -g @ionic/cli@7.2.1
```

Start the development server:

```bash
ionic serve
```

The app will be served at `http://localhost:8100` by default.


## Native builds (Capacitor)

1. Build web assets:

```bash
ionic build
```

2. Sync and open the native project:

Android:

```bash
npx cap sync android
npx cap open android
```

iOS:

```bash
npx cap sync ios
npx cap open ios
```

From the native IDE you may run on a device or emulator. Capacitor configuration is present in the repository.

## Storage and reactive updates

* The app uses a single shared storage instance (created once and reused) to persist data.
* To enable UI components to react when data changes, the project exposes a lightweight subscribe/emit mechanism in the storage utility. Some of that exposed functions are:

  * `set(key, value)` persists the value and notifies subscribers for that key.
  * `get(key)` reads the value.
  * `subscribe(key, callback)` returns an `unsubscribe` function; callbacks receive new values or `null` on removal.
* Important patterns:

  * Always update data via the storage wrapper (do not bypass it) so notifications are sent.
  * Use the `subscribe` return value to clean up listeners in `useEffect` cleanup handlers.
  * Use an `isMounted` or equivalent guard inside components where asynchronous operations may race with unmount.

Example usage;

```
  const [settings, setSettings] = useState<Settings | undefined>();

  useEffect(() => {
  
    let isMounted = true;

    const setup = async () => {
      const settings = await get("settings") as Settings;
      if (isMounted && settings) { setSettings(settings); }
    };
    setup();

    const unsub_settings = subscribe<Settings>('settings', (settings) => {
      if (isMounted) { setSettings(settings); }
    });

    return () => {
      isMounted = false;
      unsub_settings();
    };
  }, []);
```


## Localization (i18n)

* Locale files are stored in `src/locales/`. Supported languages: English, Simplified Chinese, French, Spanish, Turkish.
* To add a language: add a new locale JSON file, add the language option to the **LanguageSelector.tsx**, and update the **i18n.ts** initialization.


## Contributing

1. Fork the repository.
2. Create a descriptive feature branch: `feature/your-description`.
3. Implement the change with tests where applicable.
4. Open a pull request with a clear description of the change.

For significant architectural changes, open an issue first to discuss the approach.


## License

GNU General Public License v3.0
