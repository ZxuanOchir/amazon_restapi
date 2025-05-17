"# amazon_restapi"

# 📦 Amazon Clone Backend API

This is a RESTful API for an Amazon-like eCommerce platform built with **Node.js**, **Express.js**, and **MongoDB**. It handles user authentication, product management, order processing, and more.

---

## 🚀 Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**
- **JWT Authentication**
- **Bcrypt Password Hashing**
- **Cloudinary (for image upload)**
- **Multer (file upload middleware)**

---

## 📁 Project Structure

─ config/
│ └── db.js # MongoDB connection
├── controllers/ # Business logic
├── middleware/ # Auth, error handling, etc.
├── models/ # Mongoose schemas
├── routes/ # API route definitions
├── utils/ # Helper functions
├── uploads/ # Uploaded images (if stored locally)
├── .env
├── server.js # App entry point
└── package.json

---

## 🔐 .env Configuration

Create a `.env` file in the root directory and add the following:

`````env
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

```npm install

````npm run dev

`````

| Method | Route                 | Description       |
| ------ | --------------------- | ----------------- |
| `POST` | /api/v1/user/register | Register new user |
| `POST` | /api/v1/user/login    | Login user        |
| `GET`  | /api/v1/books         | Get all books     |
| `POST` | /api/v1/books/        | Add book ()       |

🙌 Author
Built with 💛 by Rihco

---
