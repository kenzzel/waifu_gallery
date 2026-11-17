# Waifu Gallery Android APK

Android WebView wrapper for the Waifu Gallery website.

## Build APK automatically with GitHub Actions
1. Upload the contents of this folder to a GitHub repository (or place them in a new repository).
2. Open the repository's **Actions** tab.
3. Select **Build Waifu Gallery APK** and run it, or push to `main`/`master`.
4. Open the completed workflow run and download the `Waifu-Gallery-APK` artifact.
5. Extract the downloaded artifact ZIP to get `app-debug.apk`, then install it on Android.

## Website URL
The app currently opens `https://kenzzel.github.io/wibu-gallery/`.
If the website address changes, update `APP_URL` in:
`app/src/main/java/com/waifugallery/app/MainActivity.java`

## Notes
- WebView JavaScript and DOM storage are enabled so the website can use Supabase Auth/session storage.
- Android file picker is supported for photo uploads.
- Image/file downloads are handed to Android Download Manager.
- This is a debug APK for direct testing. A Play Store release should use a separately signed release build.
