// src/config.js
export const WORDPRESS_API_URL = 'http://headless-wordpress.local/wp-json'; // REPLACE with your actual WP URL
export const WP_APP_PASSWORD = 'NwAM 8295 HJRo 3D7R TNxX TouP'; // REPLACE LATER

// To generate an Application Password in WordPress:
// 1. Go to Users > Your Profile
// 2. Scroll down to "Application Passwords"
// 3. Enter a name (e.g., "Vue Reservation App") and click "Add New Application Password".
// 4. COPY THE GENERATED PASSWORD IMMEDIATELY. You won't see it again.
// 5. Paste it above for WP_APP_PASSWORD.
// IMPORTANT: For production, manage this password securely (e.g., environment variables).