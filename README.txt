ALI OFFICIAL DEALING ZONE — PRIVATE ADMIN SETUP
================================================

WHAT THIS PACKAGE DOES
- Public store at index.html
- Separate admin page at admin.html
- Google sign-in for the owner
- Add, edit, and delete product listings
- Public visitors can read listings but cannot change them
- WhatsApp order links on the public store

IMPORTANT
This is a ready-to-configure website, not a live hosted site. The Firebase setup below is required before products and secure admin access will work. Never publish a real password or secret in HTML. Firebase web config is designed to be public; Firestore Security Rules protect writes.

SETUP (one-time)
1. Open https://console.firebase.google.com/ and sign in with YOUR OWN Gmail.
2. Create a Firebase project, then add a Web App (</> icon). Copy its config values.
3. In Authentication > Sign-in method, enable Google.
4. In Authentication > Settings > Authorized domains, add the domain where you will host the site (localhost is commonly present by default).
5. In Firestore Database, create a database.
6. Open config.js:
   - ADMIN_EMAIL = your exact Google email
   - replace each YOUR_... value in firebaseConfig with the Firebase web app config
   - set WHATSAPP_NUMBER to your Pakistan number using digits only, e.g. 923001234567
7. Open firestore.rules. Replace YOUR_OWN_GMAIL@gmail.com with the same exact Gmail. Publish these rules in Firestore > Rules.
8. Host the folder using a static hosting service that supports HTTPS and module files. For local testing, use a local web server; opening index.html directly as a file may block module imports.
9. Visit the public index page. Open admin.html yourself and sign in with the exact configured Gmail.

SECURITY NOTES
- The admin link is not shown on the public store, but admin.html itself can be discovered. That is okay: the real protection is Google sign-in PLUS Firestore rules.
- Only the configured, verified Gmail can add/edit/delete products. Do not give anyone access to that Gmail or its recovery methods.
- Do not add another administrator email to the rules.
- Customers can see products, but the rules deny their writes.
- This starter uses image URLs (not direct file uploads) to keep setup simple.
- Use only accounts/assets you are permitted to transfer and follow Free Fire's terms and applicable laws.
- If you want, you can send me screenshots of the Firebase setup screens (hide private information) and I can guide you step by step.

FILES
index.html       Public store
admin.html       Owner admin page
store.js         Public listings and WhatsApp buttons
admin.js         Owner login and product management
config.js        Your Gmail, WhatsApp number, Firebase config
firestore.rules  Database permissions; replace owner email and publish
style.css        Dark gaming theme
