# Google Play Submission Notes

## App Record

- App name: `ULTodo`
- Default language: English (United States)
- App or game: App
- Free or paid: Free
- Package name: `com.smarthug.ultodo`
- Version name: `1.0`
- Version code: `1`
- Category: Productivity
- Tags: Productivity, Task management, Time management

## Release Artifact

Upload this Android App Bundle to the production release:

```text
android/app/build/outputs/bundle/release/app-release.aab
```

The bundle is signed with the local upload key configured by `android/keystore.properties`. Keep `android/ultodo-upload-key.jks` and `android/keystore.properties` backed up outside git.

## Store Listing Draft

Short description:

```text
A calm local-first todo app for priorities, focus, and Pomodoro sessions.
```

Full description:

```text
ULTodo helps you capture tasks quickly, prioritize what matters, choose a small focus list for today, and work through it with a built-in Pomodoro timer.

The Matrix view separates urgent work from important-but-not-urgent work so you can drag tasks into the right order instead of maintaining a noisy four-quadrant board.

The first release is intentionally local-first: no account, no feed, no collaboration layer, no cloud sync, and no analytics dashboard. It is a quiet tool for deciding what to do next and staying with it.

Core features:
- Brain Dump for quickly capturing tasks
- Matrix priority view with drag-and-drop ordering
- Today focus list
- Pomodoro timer
- Local device storage
```

## Store Listing URLs

Use the deployed static pages:

- Privacy policy: `https://ultodo.com/privacy.html`
- Support: `https://ultodo.com/support.html`

## Graphic Assets

Prepared assets:

- App icon: `store-assets/google-play/icon/play-icon-512.png`
- Feature graphic: `store-assets/google-play/feature-graphic/feature-graphic-1024x500.png`
- Phone screenshots:
  - `store-assets/google-play/screenshots/01-brain-dump-1080x1920.png`
  - `store-assets/google-play/screenshots/02-priority-matrix-1080x1920.png`
  - `store-assets/google-play/screenshots/03-today-focus-1080x1920.png`
  - `store-assets/google-play/screenshots/04-pomodoro-1080x1920.png`

## Developer Contact

Google Play requires a developer contact email. Set the real developer email in Play Console before submitting. Do not use a placeholder email for production review.

## Data Safety

Current build assumption: ULTodo stores task data locally on the device and does not collect, transmit, sell, or share personal data.

Suggested answers for the current build:

- Does your app collect or share any of the required user data types? `No`
- Is all of the user data collected by your app encrypted in transit? `Not applicable`
- Do you provide a way for users to request that their data is deleted? `Not applicable`, because data is not collected by the developer
- Does your app share user data with third parties? `No`
- Tracking / ads: `No`

Revisit this before submission if analytics, crash reporting, accounts, sync, push notifications, cloud backup, ads, or third-party SDKs are added.

## App Content

Suggested current-build declarations:

- Ads: No ads
- App access: All functionality is available without special access
- Target audience: Productivity app for general users; choose the exact age range in Play Console based on the intended audience
- News app: No
- COVID-19 app: No
- Government app: No
- Financial features: No
- Health features: No

## Release Notes

```text
Initial Android release of ULTodo: Brain Dump, Matrix priorities, Today focus list, Pomodoro timer, and local device storage.
```

## Submission Flow

1. Create the app in Play Console.
2. Complete Store settings and Main store listing.
3. Upload icon, feature graphic, and at least two phone screenshots from `store-assets/google-play/`.
4. Complete App content, including Privacy policy and Data safety.
5. Create a production release and upload `app-release.aab`.
6. Review warnings and countries/regions.
7. Send to review.

Personal developer accounts created after November 13, 2023 may need to satisfy Google Play testing requirements before production access is granted.
