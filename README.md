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

# Fallback of admin credentials if there is an error due to mongodb
const adminUser = new User({
  name: 'Admin',
  email: 'admin@selby.com',
  password: 'admin123',
  isVerified: true
});

# Admin route protection (there is only frontend protection)
if (userEmail !== "admin@selby.com") {
  alert("Unauthorized access");
  window.location.href = "index.html";
}

# For addition of more admins 
To change or add more admins:
Manually edit user in MongoDB or
Extend schema with role: String field, and check it in frontend/backend

# Example - 
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, default: "user" }
});

# For test users 
There are few existing test users one of which credentials are given below:
Username-kb@gmail.com
Password-sahit

For adding new test users follow the example given below:
db.users.insertOne({
  name: "Test User",
  email: "user1@example.com",
  password: "test123",
  isVerified: true
 });

# Known Issues 
LocalStorage Reliance: User session is tracked with localStorage, which can be cleared or manipulated manually.

Base64 Photo Upload: Product images are temporarily saved in localStorage as base64 strings. This can lead to performance issues with large images.

Session Timeout: Implemented on frontend via script.js, but server does not enforce session expiry.

Static File Routing: Ensure express.static('public') is correctly configured to serve frontend files.

Fallback Price Suggestion: If the price suggestion API fails, a default 10% increase is used.

