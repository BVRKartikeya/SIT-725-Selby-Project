# SIT725-Selby-Project
This is our SIT 725 Project

Selby is a marketplace web application built as part of the SIT725 unit. It allows users to register, list household goods, receive AI-based price suggestions, and interact via chat and reviews. An admin can manage all listings from a dedicated dashboard.

--------------------
Fake Store API
[This API is purely for educational and demonstration purpose.]
The Fake Store API (used internally for price suggestion) simulates an external price recommender.

In this app, the POST /api/price-suggestion endpoint:

Takes { title, price } from the frontend.
Simulates fetching a suggested price by 2 ways-
Firstly it matches the title with its data and returns an estimate price.
If the title doesnt match with the data it will be returning the input price plus 10% [Fallback Logic]
Example: if you submit $100, the suggestion returns $110.
Note:
In a real system, this would connect to:

An external pricing engine.
A third-party store API (like eBay, Amazon) to estimate competitive prices.
For now, it’s a mock API purely for demonstration

-------------------
# Folder Structure -

MVC Model-
----------
SIT-725-Selby-Project/
│
├── models/                  # Database schemas (MongoDB via Mongoose)
│   ├── userModel.js         # User schema: stores user info + roles
│   ├── productModel.js      # Product schema: stores product listings
│   └── reviewModel.js       # Review schema: stores reviews + ratings
│
├── controllers/             # Business logic handlers
│   ├── authController.js    # Handles registration + login
│   ├── otpController.js     # Handles OTP sending + verification
│   ├── productController.js # Handles product CRUD + approval
│   ├── reviewController.js  # Handles review submissions + averages
│   └── chatController.js    # Handles listing user emails for chat
│
├── routes/                  # Express route definitions
│   ├── authRoutes.js        # Routes: /register, /login
│   ├── otpRoutes.js         # Routes: /send-otp, /verify-otp
│   ├── productRoutes.js     # Routes: /product, /api/products, etc.
│   ├── reviewRoutes.js      # Routes: /api/review, /api/review/average
│   └── chatRoutes.js        # Routes: /api/chat/users
│
├── utils/
│   └── sendOtp.js           # Utility to generate + store OTP codes 
│
├── public/                  # Frontend static files (HTML, CSS, JS)
│   ├── index.html           # Login + Register page
│   ├── otp.html             # OTP verification page
│   ├── listing.html         # Product listing form page
│   ├── display.html         # Public product display page
│   ├── price-suggestion.html# Suggested price page after ML call
│   ├── review.html          # Review + rating page
│   ├── chat.html            # Chat UI page
│   ├── admin.html           # Admin dashboard page
│   ├── main.css             # Shared CSS styles
│   └── script.js            # Shared frontend JS 
│
├── index.js        # Backend JS
├── .env            # For any Keys that needed to secretly stored
├── package.json    # Holds all the packages
└── README.md

Normally -

SIT-725-Selby-Project/
│
├── public/                  # Frontend static files
│   ├── admin.html           # Admin dashboard
│   ├── chat.html            # Chat interface
│   ├── display.html         # Product display page
│   ├── index.html           # Login & Register page
│   ├── listing.html         # Create product listing
│   ├── otp.html             # OTP verification
│   ├── price-suggestion.html# Suggested price from ML API
│   ├── review.html          # Submit reviews & ratings
│   ├── main.css             # Global CSS styles
│   └── script.js            # Session timer and auth helper
│
├── index.js                 # Main Express backend server
├── package.json             # Project dependencies
├── package-lock.json        # Dependency lock file
├── README.md                # Project documentation
└── .git/                    # Git version control folder


##  API Endpoints

### **Auth Endpoints (`/api`)**
| Method | Endpoint         | Description                            |
|--------|------------------|---------------------------------------|
| POST   | /register        | Register a new user                   |
| POST   | /login           | Login an existing user                |
| POST   | /send-otp        | Send OTP for email verification       |
| POST   | /verify-otp      | Verify the OTP for an email           |

**Input:** JSON `{ name, email, password }` or `{ email, otp }`  
**Output:** JSON `{ success: true/false, message }`

---

### **Product Endpoints (`/api`)**
| Method | Endpoint                    | Description                              |
|--------|-----------------------------|-----------------------------------------|
| GET    | /products                   | Get all products                        |
| POST   | /product                    | Create a new product                    |
| DELETE | /products/:id               | Delete a product by ID                  |
| POST   | /products/:id/approve       | Approve a pending product               |
| POST   | /price-suggestion           | Get price suggestion for a product      |

**Input:**  
- Create: `{ title, price, photo, ownerEmail }`  
- Approve/Delete: URL param `:id`  
- Price Suggestion: `{ title, price }`

**Output:** JSON `{ success: true/false, products / productId / suggestedPrice }`

---

### **Review Endpoints (`/api/review`)**
| Method | Endpoint                  | Description                           |
|--------|---------------------------|--------------------------------------|
| POST   | /                         | Submit a review for a product        |
| GET    | /average/:productId       | Get average rating for a product     |

**Input:**  
- Submit: `{ productId, rating, comment }`

**Output:** JSON `{ success: true/false, message }` or `{ averageRating }`

---

### **Chat Endpoints (`/api/chat`)**
| Method | Endpoint   | Description               |
|--------|------------|--------------------------|
| GET    | /users     | Get list of user emails  |

**Output:** JSON `{ success: true/false, users: [email1, email2, ...] }`

------
# Database Setup

Ensure MongoDB is installed and running locally.
The app connects to the selby database.
Collections:
users → stores user details (name, email, hashed password, verified)
products → stores product listings (title, price, photo, ownerEmail, status)
reviews → stores product reviews (productId, rating, comment)

-------

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

