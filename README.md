# SIT725-Selby-Project
This is our SIT 725 Project

Selby is a marketplace web application built as part of the SIT725 unit. It allows users to register, list household goods, receive AI-based price suggestions, and interact via chat and reviews. An admin can manage all listings from a dedicated dashboard.

# Folder Structure -

SIT-725-Selby-Project/
│
├── public/ # Frontend static files
│ ├── admin.html # Admin dashboard
│ ├── chat.html # Chat interface
│ ├── display.html # Product display page
│ ├── index.html # Login & Register page
│ ├── listing.html # Create product listing
│ ├── otp.html # OTP verification
│ ├── price-suggestion.html # Suggested price from ML API
│ ├── review.html # Submit reviews & ratings
│ ├── main.css # Global CSS styles
│ └── script.js # Session timer and auth helper
│
├── index.js # Main Express backend server
├── package.json # Project dependencies
├── package-lock.json # Dependency lock file
├── README.md # Project documentation
└── .git/ # Git version control folder

To run the application locally:

#1. Clone the Repository
```bash
git clone https://github.com/BVRKartikeya/SIT-725-Selby-Project.git
cd SIT-725-Selby-Project

#2. Install Dependencies
npm install express mongoose cors path jsonwebtoken body-parser node-fetch

#3 Run the server
node index.js

# Admin Credentials
Username - admin@selby.com
Password - admin123

# Known Issues 
LocalStorage Reliance: User session is tracked with localStorage, which can be cleared or manipulated manually.

Base64 Photo Upload: Product images are temporarily saved in localStorage as base64 strings. This can lead to performance issues with large images.

Session Timeout: Implemented on frontend via script.js, but server does not enforce session expiry.

Static File Routing: Ensure express.static('public') is correctly configured to serve frontend files.

Fallback Price Suggestion: If the price suggestion API fails, a default 10% increase is used.

