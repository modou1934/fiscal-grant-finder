# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/0a64a0ed-8ef8-4e98-b496-fe3b9e47f27e

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/0a64a0ed-8ef8-4e98-b496-fe3b9e47f27e) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Capacitor (for mobile apps)

## Mobile Development

This app can be built as a native mobile app for Android and iOS using Capacitor.

### Prerequisites for Mobile Development

**For Android:**
- Android Studio
- Android SDK
- Java Development Kit (JDK) 11 or higher

**For iOS:**
- Xcode 12 or higher
- macOS (required for iOS development)
- iOS SDK

### Mobile Development Commands

```sh
# Build the web app and sync with mobile platforms
npm run build:mobile

# Add mobile platforms (run once)
npm run add:android
npm run add:ios

# Run on Android device/emulator
npm run android

# Run on iOS device/simulator
npm run ios

# Open in Android Studio
npm run open:android

# Open in Xcode
npm run open:ios

# Sync web assets with mobile platforms
npm run sync
```

### First Time Mobile Setup

1. Build the web app:
   ```sh
   npm run build
   ```

2. Add the mobile platforms:
   ```sh
   npm run add:android
   npm run add:ios
   ```

3. Sync the web assets:
   ```sh
   npm run sync
   ```

4. Open in the respective IDE:
   ```sh
   npm run open:android  # Opens Android Studio
   npm run open:ios      # Opens Xcode
   ```

### Mobile Features

The mobile app includes:
- Native status bar styling
- Splash screen
- Keyboard handling
- Network status monitoring
- Device information access
- Safe area handling for devices with notches
- Touch optimizations
- Hardware back button support (Android)

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/0a64a0ed-8ef8-4e98-b496-fe3b9e47f27e) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
