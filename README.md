# SHRIJI NAMKEEN - MERN Stack Web Platform

A complete, responsive, functional, and secure full-stack MERN application for **SHRIJI NAMKEEN**, an authentic Indian namkeen manufacturing, wholesale, and retail enterprise based in Sarimeer, Azamgarh (Uttar Pradesh).

---

## 1. Business Information
- **Business Name**: SHRIJI NAMKEEN
- **Location**: Near Police Booth, Sarimeer, Azamgarh, Uttar Pradesh 276305, India
- **WhatsApp Ordering**: +91 63931 01490
- **Calling Desk**: +91 63931 01490
- **Currency**: Indian Rupee (₹, INR)
- **Business Type**: Manufacturing, Retail, and Wholesale

---

## 2. Key Features

### A. Customer-Facing Website
- **Branded Design System**: Built with modern CSS design tokens matching the official SHRIJI NAMKEEN logo (warm saffron orange `#E8631A`, forest green `#1E523A`, cream background `#FAF7F2`, and dark brown text `#2D231E`).
- **Original Assets**:
  - Official SHRIJI NAMKEEN Logo preserved in navbar, footer, hero, and admin portal.
  - Original product images integrated:
    1. *Navratan Royal Dry Fruit Mixture* (`navratan-mixture.jpg`)
    2. *Chatpata Masala Kurkure Sticks* (`masala-kurkure.jpg`)
    3. *Khatta Meetha Special Mixture* (`khatta-meetha.jpg`)
    4. *Shahi Desi Ghee Soan Papdi* (`soan-papdi.jpg`)
  - Identifiable clean SVG placeholders for upcoming catalogue items.
- **Dynamic Packaging & Pricing**: Switch between pack sizes (200g, 400g, 1kg, 20kg bulk cartons) with real-time price updates.
- **Direct WhatsApp Ordering**: Generates pre-formatted WhatsApp order messages with item name, weight, quantity, and customer address prompt.
- **Inquiry & Order Bag**: Multi-item shopping drawer supporting direct WhatsApp batch checkout or online order submission to MongoDB.
- **Wholesale & Bulk Supply Desk**: Dedicated B2B inquiry form for retail shop owners, grocery stores, marriage caterers, and bulk distributors.
- **About Heritage & Quality**: 4 pillars of Shriji purity (100% pure besan, fresh small-batch frying, whole ground spices, airtight hygienic sealing).
- **Contact & Store Visit**: Physical address, Google Maps directions, phone, WhatsApp, and message form.

### B. Secure Administrator Portal (`/admin`)
- **Security & Authentication**:
  - Secure login with bcrypt password hashing and JWT sessions.
  - Login rate limiter (10 attempts per 15 mins) to prevent brute-force attacks.
  - Helmet security headers and CORS protection.
- **Business Dashboard**: Real-time counters for active products, pending orders, wholesale inquiries, and recent activity.
- **Product Management**: Full CRUD operations, image upload via Multer to disk with preview/delete, dynamic packaging options builder, wholesale specs, ingredients, spice levels, and featured toggles.
- **Category Management**: Create, edit, and reorder categories with safety validations against orphaned products.
- **Orders & Wholesale Inquiries**: Filter by status (Pending, Contacted, Confirmed, Dispatched, Delivered), search by customer phone/name, internal staff notes, and 1-click customer WhatsApp chat.
- **Live Business Settings**: Editable phone number, WhatsApp number, address, business hours, and announcement banner text.

---

## 3. Technology Stack

- **Frontend**: React 18, Vite, React Router 6, Axios, Lucide React, CSS Variables Design System.
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, Multer, BcryptJS, JSONWebToken, Helmet, Express-Rate-Limit.
- **Database**: MongoDB (Local or MongoDB Atlas).

---

## 4. Default Admin Credentials

- **Portal URL**: `http://localhost:5173/admin/login`
- **Email**: `admin@shrijinamkeen.com`
- **Password**: `Admin@Shriji123`
*(Editable anytime via Admin -> Security & Profile)*

---

## 5. Running the Application

### Backend (Server)
```bash
cd server
npm install
npm run dev
# Server runs on http://localhost:5000
```

### Frontend (Client)
```bash
cd client
npm install
npm run dev
# Client runs on http://localhost:5173
```
