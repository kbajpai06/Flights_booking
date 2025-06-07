# ✈️ Flight Booking Website

A full-stack flight booking website built with the MERN stack (MongoDB, Express.js, React.js, Node.js) that allows users to search, view, and book flights with real-time seat selection and payment integration.


## 🚀 Features

### 👨‍👩‍👧 User Side
- 🔍 Search flights by origin, destination, date
- 🪑 Seat selection interface
- 💳 Payment gateway integration (e.g., Razorpay / Stripe)
- 📧 Email confirmation on successful booking
- 📜 Booking history with status tracking
- 📈 Expense analytics per user

### 🛫 Admin Side
- ➕ Add new flights
- 🧾 Manage bookings and flight statuses
- 📋 View all registered users

### 🛡️ Security
- 🔐 JWT-based Authentication & Authorization
- 🛑 Role-based access control (`isAdmin` for admin routes)
- 🧹 Input validation and error handling


## 🛠️ Tech Stack

### Frontend:
- **React.js** with Hooks & Context API
- **Tailwind CSS** for UI styling
- **React Router v6** for routing
- **Axios** for API calls

### Backend:
- **Node.js** + **Express.js**
- **MongoDB** with **Mongoose**
- **JWT** for auth
- **Razorpay/Stripe**  for payments


## 📦 Installation

### 1. Clone the repo

```bash
git clone https://github.com/kbajpai06/Flights_booking.git
cd Flights_booking
```

### 2. Install dependencies
 # For backend
cd backend
npm install

 # For frontend
cd ../frontend
npm install

### 3. Environment setup
Create .env files in both frontend and backend with necessary secrets (e.g. Mongo URI, JWT secret).

### 4. Run the app
# Start backend
cd backend
npm start

# Start frontend
cd ../frontend
npm run dev

📊 Future Enhancements

✅ Refund/cancellation system

✅ Internationalization support

✅ Mobile App (React Native)

🧑‍💻 Author 
Kartik Bajpai Software Engineering Student @ DTU 
💻 MERN Stack • ML Enthusiast • Backend & Data Science