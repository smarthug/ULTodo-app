# App Store Submission Notes

## App Record

- Platform: iOS
- Name: ULTodo
- Bundle ID: `com.smarthug.ultodo`
- SKU: `ultodo-ios`
- Primary category: Productivity
- Version: `1.0`
- Build: `1`

## Product Page Draft

- Subtitle: `Prioritize your day`
- Promotional text: `A calm, local-first todo app for urgent work, important work, and focused sessions.`
- Description:

```text
ULTodo helps you capture tasks quickly, prioritize them in a two-column urgency matrix, choose what matters today, and stay focused with a built-in Pomodoro timer.

Your tasks stay local to the device in this first release. There is no account setup, feed, analytics dashboard, or collaboration layer to get in the way.
```

- Keywords: `todo,tasks,focus,pomodoro,priority,matrix,productivity`
- Support URL: `https://smarthug.com`
- Marketing URL: `https://smarthug.com`
- Privacy Policy URL: `https://smarthug.com/privacy`

## App Privacy

Current implementation is local-only: tasks are stored on device through IndexedDB/WebView storage, and no analytics, ads, account, sync, or server upload path is present in this repo.

Suggested App Store Connect answer for the current build:

- Data collection: `No, we do not collect data from this app`
- Tracking: `No`

Revisit this before submission if analytics, crash reporting, accounts, sync, push notifications, cloud backup, or third-party SDKs are added.

## Export Compliance

`ITSAppUsesNonExemptEncryption` is set to `false` in `ios/App/App/Info.plist` for the current build assumption: ULTodo does not implement custom or non-exempt encryption. Revisit if custom encryption, VPN, encrypted messaging, or proprietary crypto is added.

## Build Upload

Apple supports uploading builds through Xcode, altool, Transporter, or the App Store Connect API. For this project, the shortest path after full Xcode is installed is:

```bash
npm run cap:sync
npx cap open ios
```

Then in Xcode:

1. Select the `App` target.
2. Set the Apple Developer team for `com.smarthug.ultodo`.
3. Select `Any iOS Device`.
4. Product > Archive.
5. Distribute App > App Store Connect.
