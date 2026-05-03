# 🩸 RoktoDao - Humanity First

RoktoDao (রক্তদাও) বাংলাদেশের একটি পূর্ণাঙ্গ এবং আধুনিক অনলাইন রক্তদাতা ডাটাবেজ প্ল্যাটফর্ম। এটি মানবতার সেবায় রক্তদাতা ও গ্রহীতার মধ্যে দ্রুত সেতুবন্ধন তৈরি করতে ডিজাইন করা হয়েছে।

## 🚀 Key Features

### 1. Smart Donor Management
- **Profile with Badges:** Donors get badges like 🏆 Life Saver, 💪 Hero Donor based on their contributions.
- **Radius-based Search:** Find donors within a specific distance (KM) from your location.
- **Interactive Map:** View all donors across Bangladesh on a Leaflet map.

### 2. Emergency Blood Requests
- **Offline Emergency Mode:** Submit requests even without internet; data saves locally and syncs once online.
- **Nearest Hospital Suggestion:** Auto-suggests the closest blood banks from a pre-built database of 170+ hospitals.
- **Auto-Matching:** System finds the best donors for a specific request based on blood group compatibility and distance.

### 3. Communication & Security
- **In-App Messaging:** Real-time chat system between donors and recipients.
- **SMS Alerts:** Automatic SMS notifications for urgent requests (focused on rural areas).
- **Report System:** Report spam requests or fake profiles directly to admins.

### 4. AI-Powered Tools (Genkit)
- **Eligibility Doctor:** AI analyzes donor health data to check donation fitness.
- **Fake Profile Detector:** Security analyst AI to identify suspicious activity.
- **Bulk Import:** Smart AI parser to import donor data from Excel or raw text.

### 5. Advanced SEO & Performance
- **200+ Keyword Optimization:** Optimized for high-ranking search terms in Bengali and English.
- **Dynamic Sitemap & Robots.txt:** Ensures search engines index every donor profile and blog post.
- **PWA Support:** Install the site as a mobile app on Android/iOS.

## 🛠 Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Database:** Turso (Edge LibSQL)
- **AI:** Google Genkit (Gemini 2.5 Flash)
- **Styling:** Tailwind CSS + ShadCN UI
- **Maps:** Leaflet.js
- **Auth:** Local Auth with Password Protection

## 🛡 Setup & Deployment
1. **Clone the repo.**
2. **Environment Variables:**
   - `TURSO_URL`: Your Turso DB URL.
   - `TURSO_AUTH_TOKEN`: Your Turso Auth Token.
   - `SMS_API_KEY`: API key for the integrated SMS gateway.
   - `ADMIN_PASSWORD`: For admin dashboard access.
3. **Run Build:** `npm run build`

---
*Created with love for Humanity by RoktoDao Team.*