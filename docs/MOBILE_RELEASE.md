# Mobile Release

## Current Native Targets

- App id / bundle id: `com.smarthug.ultodo`
- Display name: `ULTodo`
- Version: `1.0`
- Build number / Android version code: `1`
- Web output directory: `dist`

## Android

Android is locally buildable with the Homebrew JDK and Android SDK paths already used on this machine.

```bash
npm run cap:sync
cd android
JAVA_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home \
ANDROID_HOME=/opt/homebrew/share/android-commandlinetools \
ANDROID_SDK_ROOT=/opt/homebrew/share/android-commandlinetools \
PATH="/opt/homebrew/opt/openjdk@21/bin:$PATH" \
./gradlew bundleRelease assembleDebug
```

Outputs:

- `android/app/build/outputs/bundle/release/app-release.aab`
- `android/app/build/outputs/apk/debug/app-debug.apk`

Release signing is read from `android/keystore.properties` when present. The upload key and properties file are ignored by git.

## iOS

The iOS Capacitor project is generated and synced. It includes a privacy manifest, app icons, splash images, bundle id, and version metadata. Local archive/build still requires the full Xcode app. This machine currently only has Command Line Tools selected at `/Library/Developer/CommandLineTools`, so `xcodebuild` cannot run yet.

After full Xcode is installed:

```bash
npm run cap:sync
npx cap open ios
```

Then archive from Xcode with an Apple Developer team selected for `com.smarthug.ultodo`. Store-facing metadata is drafted in `docs/APP_STORE_SUBMISSION.md`.

## Icons And Splash

Native app icons and splash screens are generated from `assets/logo.svg`.

To regenerate Android/iOS assets:

```bash
npx @capacitor/assets generate --ios --android \
  --iconBackgroundColor '#F3EFE7' \
  --iconBackgroundColorDark '#1A1814' \
  --splashBackgroundColor '#F3EFE7' \
  --splashBackgroundColorDark '#1A1814' \
  --logoSplashTargetWidth 560
```
