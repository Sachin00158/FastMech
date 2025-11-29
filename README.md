# FastMech
FastMech - On-Road Mechanic Finder & Breakdown Assistance


Project Overview

RoadFix (FastMech) is a full-stack web application designed to connect stranded vehicle owners with nearby mechanics in real-time. It solves the critical problem of vehicle breakdowns in unfamiliar locations by providing a seamless platform for booking, tracking, and paying for on-road mechanical services.

Key Features

Live Geolocation Tracking: Uses GPS to detect the user's exact location and displays it on an interactive map (OpenStreetMap).

Nearby Mechanic Finder: Fetches real mechanic data from OpenStreetMap (Overpass API) within a 5km radius, sorted by distance.

Smart Booking System: Allows users to select vehicle type (2-Wheeler/4-Wheeler), specific services, and a preferred mechanic.

Mechanic Dashboard: Mechanics receive real-time service requests, can accept/reject them, and update job status (In-Progress/Completed).

Dynamic Billing: Mechanics can generate a final bill with custom amounts and notes after inspecting the vehicle.

Secure Authentication: Robust login system using Firebase Phone Authentication (OTP).

Digital Payments: Integrated dynamic UPI QR Code generation for seamless online payments.

Invoice Generation: Automatic digital invoice creation with print/download PDF options.

SOS Emergency Alert: One-click emergency button for immediate high-priority assistance.

Technology Stack

Component

Technology Used

Purpose

Frontend

HTML5, CSS3, JavaScript (Vanilla)

User Interface, Responsive Design, DOM Manipulation

Backend

Node.js, Express.js

REST API, Server-side Logic, Routing

Database

MongoDB

Storing Users, Mechanics, and Booking Records

Authentication

Firebase Auth

Secure Phone Number (OTP) Login

Maps & Location

Leaflet.js, OpenStreetMap API

Rendering Maps, Geocoding, Reverse Geocoding

Data Source

Overpass API

Fetching real-world mechanic locations

Payments

QR Server API

Generating dynamic UPI payment QR codes

Installation & Setup Guide

Follow these steps to run the project locally on your machine.

Prerequisites

Node.js installed (v14 or higher).

MongoDB installed and running locally.

A code editor (like VS Code).

Step 1: Clone the Repository

git clone [https://github.com/your-username/roadfix.git](https://github.com/your-username/roadfix.git)
cd roadfix


Step 2: Backend Setup

Navigate to the backend folder:

cd backend


Install dependencies:

npm install express cors mongoose


Start the server:

node index.js


You should see: Backend listening on http://localhost:3000

Step 3: Frontend Setup

Go back to the main project folder.

Open index.html in your browser (Double-click or use Live Server).

 How to Use

1. Customer Flow

Login: Enter your mobile number. Use the test number 8767348986 and OTP 123456 for instant login.

Find Mechanic: Click "Find Nearby Mechanics". The app will show your location and a list of nearby garages sorted by distance.

Book: Select a garage, choose your vehicle type and service, and click "Confirm Booking".

Track: View your booking status on the dashboard (Pending -> Accepted -> In-Progress).

Pay: Once the job is done, click "Pay Now". Scan the QR code or choose Cash.

Review: Download your invoice and rate the mechanic.

2. Mechanic Flow

Login: Log in as a mechanic using a registered number.

Dashboard: View incoming requests with customer details and location.

Action: Accept or Reject requests.

Job Management: Click "Start Job" when you arrive, and "Complete Job" when finished.

Billing: Enter the final repair cost and notes to generate the bill for the customer.

📂 Project Structure

RoadFix/
├── backend/
│   ├── index.js            # Main Server File (API Routes & DB Connection)
│   ├── node_modules/       # Backend Dependencies
│   └── package.json        # Backend Config
├── index.html              # Main UI File (Login, Dashboards, Maps)
├── style.css               # Styling & Responsive Design
├── app.js                  # Frontend Logic (Firebase, Maps, Fetch API)
├── mechanic_app_data.json  # Static Data (Vehicles & Services list)
└── README.md               # Project Documentation


Future Scope

Live Tracking: Real-time movement tracking of the mechanic on the map.

Chat System: In-app chat between customer and mechanic.

Admin Panel: A web portal to manage users and verifications.

Payment Gateway: Full integration with Razorpay/Stripe for credit card payments.


