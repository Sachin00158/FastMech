
// // const express = require('express');
// // const cors = require('cors'); // <-- ADD THIS LINE
// // const mongoose = require('mongoose');
// // const path = require('path');

// // const { vehicleData, serviceData } = require('../mechanic_app_data.js');

// // const app = express();


// // app.use(cors());
// // app.use(express.json());

// // app.use(express.static(path.join(__dirname, '..')));

// // // Connect to MongoDB (replace with your actual connection string)
// // mongoose.connect('mongodb://localhost:27017/roadfix', {
// //     useNewUrlParser: true,
// //     useUnifiedTopology: true,
// // });

// // // Booking Schema
// // const bookingSchema = new mongoose.Schema({
// //     customerName: String,
// //     customerPhone: String,
// //     vehicle: Object,
// //     services: Array,
// //     location: String,
// //     date: String,
// //     time: String,
// //     instructions: String,
// //     isEmergency: Boolean,
// //     status: String,
// //     createdAt: String,
// //     totalCost: Number,
// //     mechanicId: String,
// //     customerId: String,
// // });
// // const Booking = mongoose.model('Booking', bookingSchema);

// // // Get all bookings (for a customer or mechanic)
// // app.get('/bookings', async (req, res) => {
// //     const { userId, mode } = req.query; // mode = 'customer' or 'mechanic'
// //     if (mode === 'mechanic') {
// //         const bookings = await Booking.find();
// //         return res.json(bookings);
// //     }
// //     if (userId) {
// //         const bookings = await Booking.find({ customerId: userId });
// //         return res.json(bookings);
// //     }
// //     res.json([]);
// // });

// // // Create a new booking
// // app.post('/bookings', async (req, res) => {
// //     const data = req.body;
// //     const booking = new Booking({ ...data, status: 'pending', createdAt: new Date().toISOString() });
// //     await booking.save();
// //     res.json(booking);
// // });

// // // Update booking status (accept/reject)
// // app.patch('/bookings/:id', async (req, res) => {
// //     const { status, mechanicId } = req.body;
// //     const booking = await Booking.findByIdAndUpdate(req.params.id, { status, mechanicId }, { new: true });
// //     res.json(booking);
// // });

// // app.listen(5000, () => console.log('Backend listening on http://localhost:3000'));




// // // Add these to backend/index.js (inside your other endpoints)

// // // 6. Endpoint to START a job (Mechanic clicks "Start Job")
// // app.patch('/api/bookings/:id/start', (req, res) => {
// //     const { id } = req.params;
// //     const booking = allBookings.find(b => b.id === id);
// //     if (booking) {
// //         booking.status = 'in-progress';
// //         res.json(booking);
// //     } else {
// //         res.status(404).json({ message: 'Booking not found' });
// //     }
// // });

// // // 7. Endpoint to SEND FINAL BILL (Mechanic's "mutable" part)
// // app.patch('/api/bookings/:id/complete', (req, res) => {
// //     const { id } = req.params;
// //     // Get the new final price from the mechanic's form
// //     const { finalCost, notes } = req.body; 

// //     const booking = allBookings.find(b => b.id === id);
// //     if (booking) {
// //         booking.status = 'pending-payment';
// //         booking.finalCost = finalCost; // Store the new mutable price
// //         booking.notes = notes; // Store any notes (e.g., "Added extra part")
// //         console.log(`Final bill for ${id} created. Amount: ${finalCost}`);
// //         res.json(booking);
// //     } else {
// //         res.status(404).json({ message: 'Booking not found' });
// //     }
// // });

// // // 8. Endpoint to mark as PAID (Customer chose "Pay Offline")
// // app.patch('/api/bookings/:id/pay-offline', (req, res) => {
// //     const { id } = req.params;
// //     const booking = allBookings.find(b => b.id === id);
// //     if (booking) {
// //         booking.status = 'completed';
// //         booking.paymentMethod = 'offline';
// //         console.log(`Booking ${id} paid offline.`);
// //         res.json(booking);
// //     } else {
// //         res.status(404).json({ message: 'Booking not found' });
// //     }
// // });




// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const path = require('path');

// // ADD THESE THREE LINES INSTEAD
// const appData = require('../mechanic_app_data.json'); // Loads your JSON file
// const vehicleData = appData.vehicles; // Gets the 'vehicles' list
// const serviceData = appData.services; // Gets the 'services' list



// const app = express();
// const PORT = 3000; // We will use port 3000 to match your app.js

// // --- Middleware (These lines run on every request) ---
// app.use(cors()); // Allows your front-end to call your back-end
// app.use(express.json()); // Lets your server read JSON
// app.use(express.static(path.join(__dirname, '..'))); // Serves your index.html

// // --- Connect to MongoDB ---
// // (I removed the deprecated options)
// mongoose.connect('mongodb://localhost:27017/roadfix')
//     .then(() => console.log('MongoDB connected successfully.'))
//     .catch(err => console.error('MongoDB connection error:', err));

// // --- Booking Schema ---
// // (I added the new fields for the payment flow)
// const bookingSchema = new mongoose.Schema({
//     customerName: String,
//     customerPhone: String,
//     vehicle: Object,
//     services: Array,
//     location: String,
//     date: String,
//     time: String,
//     instructions: String,
//     isEmergency: Boolean,
//     status: String,
//     createdAt: String,
//     totalCost: Number,
//     mechanicId: String,
//     customerId: String,
//     // New fields for payment:
//     finalCost: Number,
//     notes: String,
//     paymentMethod: String,
// });
// const Booking = mongoose.model('Booking', bookingSchema);

// // --- 
// // --- ⬇️ ALL YOUR API ROUTES GO HERE ⬇️ ---
// // ---

// // 1. Endpoint to GET all vehicle data
// app.get('/api/vehicles', (req, res) => {
//     res.json(vehicleData);
// });

// // 2. Endpoint to GET all service data
// app.get('/api/services', (req, res) => {
//     res.json(serviceData);
// });

// // 3. Get all bookings (for customer or mechanic)
// app.get('/api/bookings', async (req, res) => {
//     try {
//         const bookings = await Booking.find(); // Get all bookings
//         res.json(bookings); // The front-end (app.js) will filter them
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

// // 4. Create a new booking
// app.post('/api/bookings', async (req, res) => {
//     const data = req.body;
//     const booking = new Booking({
//         ...data,
//         status: 'pending',
//         createdAt: new Date().toISOString()
//     });
//     try {
//         await booking.save();
//         res.status(201).json(booking);
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// });

// // 5. Accept a booking
// app.patch('/api/bookings/:id/accepted', async (req, res) => {
//     const { mechanicId } = req.body;
//     try {
//         const booking = await Booking.findByIdAndUpdate(req.params.id,
//             { status: 'accepted', mechanicId: mechanicId },
//             { new: true } // This returns the updated document
//         );
//         res.json(booking);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

// // 6. Cancel or Reject a booking
// app.patch('/api/bookings/:id/cancelled', async (req, res) => {
//     try {
//         const booking = await Booking.findByIdAndUpdate(req.params.id,
//             { status: 'cancelled' },
//             { new: true }
//         );
//         res.json(booking);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });


// // --- ⬇️ YOUR NEW PAYMENT ROUTES (FIXED!) ⬇️ ---
// // (These now use `Booking.findByIdAndUpdate` to save to your database)

// // 7. Endpoint to START a job
// app.patch('/api/bookings/:id/start', async (req, res) => {
//     try {
//         const booking = await Booking.findByIdAndUpdate(req.params.id,
//             { status: 'in-progress' },
//             { new: true }
//         );
//         res.json(booking);
//     } catch (err) {
//         res.status(404).json({ message: 'Booking not found' });
//     }
// });

// // 8. Endpoint to SEND FINAL BILL (Mechanic's "mutable" part)
// app.patch('/api/bookings/:id/complete', async (req, res) => {
//     const { finalCost, notes } = req.body; // Get new price from mechanic
//     try {
//         const booking = await Booking.findByIdAndUpdate(req.params.id,
//             { status: 'pending-payment', finalCost: finalCost, notes: notes },
//             { new: true }
//         );
//         res.json(booking);
//     } catch (err) {
//         res.status(404).json({ message: 'Booking not found' });
//     }
// });

// // 9. Endpoint to mark as PAID (Customer chose "Pay Offline")
// app.patch('/api/bookings/:id/pay-offline', async (req, res) => {
//     try {
//         const booking = await Booking.findByIdAndUpdate(req.params.id,
//             { status: 'completed', paymentMethod: 'offline' },
//             { new: true }
//         );
//         res.json(booking);
//     } catch (err) {
//         res.status(404).json({ message: 'Booking not found' });
//     }
// });

// // --
// // --- ⬆️ ALL YOUR API ROUTES GO ABOVE THIS LINE ⬆️ ---
// // ---

// // Start the server (MUST BE THE LAST THING IN THE FILE)
// app.listen(PORT, () => console.log(`Backend listening on http://localhost:${PORT}`));




// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const path = require('path');

// // This part is correct
// const appData = require('../mechanic_app_data.json'); 
// const vehicleData = appData.vehicles;
// const serviceData = appData.services;

// const app = express();
// const PORT = 3000; 

// // --- Middleware ---
// app.use(cors()); 
// app.use(express.json()); 
// app.use(express.static(path.join(__dirname, '..'))); 

// // --- Connect to MongoDB ---
// mongoose.connect('mongodb://localhost:27017/roadfix')
//     .then(() => console.log('MongoDB connected successfully.'))
//     .catch(err => console.error('MongoDB connection error:', err));

// // --- Booking Schema ---
// const bookingSchema = new mongoose.Schema({
//     customerName: String,
//     customerPhone: String,
//     vehicle: Object,
//     services: Array,
//     location: String,
//     date: String,
//     time: String,
//     instructions: String,
//     isEmergency: Boolean,
//     status: String,
//     createdAt: String,
//     totalCost: Number,
//     mechanicId: String,
//     customerId: String,
//     finalCost: Number,
//     notes: String,
//     paymentMethod: String,
// }, 
// { 
//     // --- ADD THIS BLOCK ---
//     // This fixes the 'undefined' ID bug by telling Mongoose
//     // to include the 'id' (virtual) field when converting to JSON
//     toJSON: { virtuals: true }, 
//     toObject: { virtuals: true } 
//     // --- END BLOCK ---
// });
// const Booking = mongoose.model('Booking', bookingSchema);


// // --- API ROUTES ---

// // 1. Get all vehicle data
// app.get('/api/vehicles', (req, res) => {
//     res.json(vehicleData);
// });

// // 2. Get all service data
// app.get('/api/services', (req, res) => {
//     res.json(serviceData);
// });

// // 3. Get all bookings
// app.get('/api/bookings', async (req, res) => {
//     try {
//         const bookings = await Booking.find(); 
//         res.json(bookings); 
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

// // 4. Create a new booking
// app.post('/api/bookings', async (req, res) => {
//     const data = req.body;
//     const booking = new Booking({
//         ...data,
//         status: 'pending',
//         createdAt: new Date().toISOString()
//     });
//     try {
//         await booking.save();
//         res.status(201).json(booking);
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// });

// // 5. Accept a booking
// app.patch('/api/bookings/:id/accepted', async (req, res) => {
//     const { mechanicId } = req.body;
//     try {
//         const booking = await Booking.findByIdAndUpdate(req.params.id,
//             { status: 'accepted', mechanicId: mechanicId },
//             { new: true } 
//         );
//         res.json(booking);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

// // 6. Cancel or Reject a booking
// app.patch('/api/bookings/:id/cancelled', async (req, res) => {
//     try {
//         const booking = await Booking.findByIdAndUpdate(req.params.id,
//             { status: 'cancelled' },
//             { new: true }
//         );
//         res.json(booking);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

// // 7. Endpoint to START a job
// app.patch('/api/bookings/:id/start', async (req, res) => {
//     try {
//         const booking = await Booking.findByIdAndUpdate(req.params.id,
//             { status: 'in-progress' },
//             { new: true }
//         );
//         res.json(booking);
//     } catch (err) {
//         res.status(404).json({ message: 'Booking not found' });
//     }
// });

// // 8. Endpoint to SEND FINAL BILL
// app.patch('/api/bookings/:id/complete', async (req, res) => {
//     const { finalCost, notes } = req.body;
//     try {
//         const booking = await Booking.findByIdAndUpdate(req.params.id,
//             { status: 'pending-payment', finalCost: finalCost, notes: notes },
//             { new: true }
//         );
//         res.json(booking);
//     } catch (err) {
//         res.status(404).json({ message: 'Booking not found' });
//     }
// });

// // 9. Endpoint to mark as PAID OFFLINE
// app.patch('/api/bookings/:id/pay-offline', async (req, res) => {
//     try {
//         const booking = await Booking.findByIdAndUpdate(req.params.id,
//             { status: 'completed', paymentMethod: 'offline' },
//             { new: true }
//         );
//         res.json(booking);
//     } catch (err) {
//         res.status(404).json({ message: 'Booking not found' });
//     }
// });

// // --- Start the server ---
// app.listen(PORT, () => console.log(`Backend listening on http://localhost:${PORT}`));



// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const path = require('path');
// const twilio = require('twilio');

// // This part is correct
// const appData = require('../mechanic_app_data.json'); 
// const vehicleData = appData.vehicles;
// const serviceData = appData.services;

// const app = express();
// const PORT = 3000; 

// // --- Middleware ---
// app.use(cors()); 
// app.use(express.json()); 
// app.use(express.static(path.join(__dirname, '..'))); 

// // --- Connect to MongoDB ---
// mongoose.connect('mongodb://localhost:27017/roadfix')
//     .then(() => console.log('MongoDB connected successfully.'))
//     .catch(err => console.error('MongoDB connection error:', err));

// // --- Booking Schema ---
// const bookingSchema = new mongoose.Schema({
//     customerName: String,
//     customerPhone: String,
//     vehicle: Object,
//     services: Array,
//     location: String,
//     date: String,
//     time: String,
//     specialInstructions: String, // Changed to match your app.js
//     isEmergency: Boolean,
//     status: String,
//     createdAt: String,
//     totalCost: Number,
//     mechanicId: String,
//     customerId: String,
//     finalCost: Number,
//     notes: String,
//     paymentMethod: String,
// }, 
// { 
//     // --- THIS IS THE FIX FOR THE "undefined" ID BUG ---
//     // It tells Mongoose to include a virtual 'id' field
//     // that is a copy of the '_id' field when it sends JSON.
//     toJSON: { virtuals: true }, 
//     toObject: { virtuals: true } 
//     // --- END FIX ---
// });
// const Booking = mongoose.model('Booking', bookingSchema);


// // --- API ROUTES ---

// // 1. Get all vehicle data
// app.get('/api/vehicles', (req, res) => {
//     res.json(vehicleData);
// });

// // 2. Get all service data
// app.get('/api/services', (req, res) => {
//     res.json(serviceData);
// });

// // 3. Get all bookings
// app.get('/api/bookings', async (req, res) => {
//     try {
//         const bookings = await Booking.find(); 
//         res.json(bookings); 
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

// // 4. Create a new booking
// app.post('/api/bookings', async (req, res) => {
//     const data = req.body;
//     const booking = new Booking({
//         ...data,
//         status: 'pending',
//         createdAt: new Date().toISOString()
//     });
//     try {
//         await booking.save();
//         res.status(201).json(booking);
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// });

// // 5. Accept a booking
// app.patch('/api/bookings/:id/accepted', async (req, res) => {
//     const { mechanicId } = req.body;
//     try {
//         const booking = await Booking.findByIdAndUpdate(req.params.id,
//             { status: 'accepted', mechanicId: mechanicId },
//             { new: true } 
//         );
//         res.json(booking);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

// // 6. Cancel or Reject a booking
// app.patch('/api/bookings/:id/cancelled', async (req, res) => {
//     try {
//         const booking = await Booking.findByIdAndUpdate(req.params.id,
//             { status: 'cancelled' },
//             { new: true }
//         );
//         res.json(booking);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

// // 7. Endpoint to START a job
// app.patch('/api/bookings/:id/start', async (req, res) => {
//     try {
//         const booking = await Booking.findByIdAndUpdate(req.params.id,
//             { status: 'in-progress' },
//             { new: true }
//         );
//         res.json(booking);
//     } catch (err) {
//         res.status(404).json({ message: 'Booking not found' });
//     }
// });

// // 8. Endpoint to SEND FINAL BILL
// app.patch('/api/bookings/:id/complete', async (req, res) => {
//     const { finalCost, notes } = req.body;
//     try {
//         const booking = await Booking.findByIdAndUpdate(req.params.id,
//             { status: 'pending-payment', finalCost: finalCost, notes: notes },
//             { new: true }
//         );
//         res.json(booking);
//     } catch (err) {
//         res.status(404).json({ message: 'Booking not found' });
//     }
// });

// // 9. Endpoint to mark as PAID OFFLINE
// app.patch('/api/bookings/:id/pay-offline', async (req, res) => {
//     try {
//         const booking = await Booking.findByIdAndUpdate(req.params.id,
//             { status: 'completed', paymentMethod: 'offline' },
//             { new: true }
//         );
//         res.json(booking);
//     } catch (err) {
//         res.status(404).json({ message: 'Booking not found' });
//     }
// });

// // --- Start the server ---
// app.listen(PORT, () => console.log(`Backend listening on http://localhost:${PORT}`));






// // --- 2. ADD YOUR TWILIO CREDENTIALS ---
// // (Get these from your Twilio account dashboard)
// const accountSid = 'YOUR_TWILIO_ACCOUNT_SID';
// const authToken = 'YOUR_TWILIO_AUTH_TOKEN';
// const twilioPhoneNumber = 'YOUR_TWILIO_PHONE_NUMBER';
// const client = twilio(accountSid, authToken);

// // --- 3. ADD A SIMPLE STORAGE FOR OTPS ---
// // (A real app would store this in a database with an expiry time)
// let otpStorage = {};

// // Reuse the existing `app` instance declared earlier instead of redeclaring it here.
// // The middleware (app.use) and Mongoose connection are already configured above.
// // ... (all your app.use() lines) ...
// // ... (your Mongoose connection and Schema) ...

// // --- 
// // --- ⬇️ ADD THESE NEW API ROUTES ⬇️ ---
// // ---

// // 4. NEW ROUTE TO SEND THE OTP
// app.post('/api/send-otp', async (req, res) => {
//     const { phoneNumber } = req.body;

//     // Add your country code (e.g., +91 for India)
//     const formattedPhoneNumber = `+91${phoneNumber}`; 
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     try {
//         // --- THIS SENDS THE REAL SMS ---
//         // (It costs a small amount of money)

//         // await client.messages.create({
//         //     body: `Your FastMech OTP is: ${otp}`,
//         //     from: twilioPhoneNumber,
//         //     to: formattedPhoneNumber
//         // });

//         // --- FOR TESTING (FREE) ---
//         // This will print the OTP in your terminal instead of sending it
//         console.log(`OTP for ${formattedPhoneNumber} is: ${otp}`);
//         // --------------------------

//         // Store the OTP for 5 minutes
//         otpStorage[phoneNumber] = { otp: otp, timestamp: Date.now() };

//         res.json({ success: true, message: 'OTP sent!' });

//     } catch (error) {
//         console.error("Error sending OTP:", error);
//         res.status(500).json({ success: false, message: 'Failed to send OTP' });
//     }
// });

// // 5. NEW ROUTE TO VERIFY THE OTP
// app.post('/api/verify-otp', (req, res) => {
//     const { phoneNumber, otp } = req.body;

//     // Get the stored OTP data
//     const storedData = otpStorage[phoneNumber];

//     if (!storedData) {
//         return res.status(400).json({ success: false, message: 'OTP not found. Please resend.' });
//     }

//     // Check if OTP is expired (e.g., 5 minutes)
//     const fiveMinutes = 5 * 60 * 1000;
//     if (Date.now() - storedData.timestamp > fiveMinutes) {
//         delete otpStorage[phoneNumber];
//         return res.status(400).json({ success: false, message: 'OTP expired. Please resend.' });
//     }

//     // Check if the stored OTP matches the one from the user
//     if (storedData.otp === otp) {

//         // OTP is correct!
//         delete otpStorage[phoneNumber]; // Remove OTP after use

//         // Create the user object for the front-end
//         const user = {
//             id: Math.random().toString(36).substr(2, 9),
//             phone: phoneNumber,
//             type: tempUserType // We get this from the front-end
//         };

//         // Send back success and the new user object
//         res.json({ success: true, user: user });

//     } else {
//         // OTP is wrong
//         res.status(400).json({ success: false, message: 'Invalid OTP' });
//     }
// });

// // ... (all your other API routes for bookings, etc.) ...






const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

// Import Data
const appData = require('../mechanic_app_data.json');
const vehicleData = appData.vehicles;
const serviceData = appData.services;

const app = express();
const PORT = 3000;

// --- Middleware ---
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

// --- Connect to MongoDB ---
mongoose.connect('mongodb://localhost:27017/roadfix')
    .then(() => console.log('MongoDB connected successfully.'))
    .catch(err => console.error('MongoDB connection error:', err));

// --- Booking Schema ---
const bookingSchema = new mongoose.Schema({
    customerName: String,
    customerPhone: String,
    vehicle: Object,
    services: Array,
    location: String,
    date: String,
    time: String,
    specialInstructions: String,
    isEmergency: Boolean,
    status: String,
    createdAt: String,
    totalCost: Number,
    mechanicId: String,
    customerId: String,
    finalCost: Number,
    notes: String,
    paymentMethod: String,

    //for rating //

    rating: Number,
    review: String
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } });

const Booking = mongoose.model('Booking', bookingSchema);

// --- API ROUTES ---
// --- NEW: FIND NEARBY MECHANICS API ---

app.post('/api/nearby-mechanics', (req, res) => {
    const { lat, lng } = req.body;
    // --- NEW: SOS EMERGENCY ROUTE ---
    app.post('/api/sos', async (req, res) => {
        const { customerId, customerName, customerPhone, lat, lng } = req.body;

        const sosBooking = new Booking({
            customerId,
            customerName,
            customerPhone,
            vehicle: { brand: 'Unknown', model: 'Vehicle', fuel: 'N/A' }, // Dummy data for speed
            services: [{ service_name: '🚨 SOS EMERGENCY', price: 0, duration: 'ASAP' }],
            location: `SOS Alert Location (Lat: ${lat}, Lng: ${lng})`, // Coordinates directly
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString(),
            specialInstructions: "DRIVER IN TROUBLE - URGENT ASSISTANCE REQUIRED",
            isEmergency: true, // This flag marks it as SOS
            status: 'pending',
            createdAt: new Date().toISOString(),
            totalCost: 0 // Mechanic will set price later
        });

        try {
            await sosBooking.save();
            res.status(201).json(sosBooking);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    });

    // हम असली यूजर के आस-पास 4 नकली मैकेनिक बना रहे हैं
    // ताकि मैप पर कुछ दिखाई दे (डेमो के लिए)
    const nearbyMechanics = [
        { id: 'm1', name: 'Raju Auto Works', lat: lat + 0.002, lng: lng + 0.002, rating: '4.5 ⭐' },
        { id: 'm2', name: 'Speedy Garage', lat: lat - 0.002, lng: lng - 0.002, rating: '4.8 ⭐' },
        { id: 'm3', name: 'Bike Point', lat: lat + 0.003, lng: lng - 0.001, rating: '4.2 ⭐' },
        { id: 'm4', name: 'Express Fix', lat: lat - 0.001, lng: lng + 0.003, rating: '4.9 ⭐' }
    ];

    res.json(nearbyMechanics);
});
app.get('/api/vehicles', (req, res) => res.json(vehicleData));
app.get('/api/services', (req, res) => res.json(serviceData));

// Get all bookings
app.get('/api/bookings', async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- MECHANIC REGISTRATION ROUTES ---

// 1. Register a new Mechanic
app.post('/api/mechanics/register', async (req, res) => {
    const data = req.body;

    // Check if phone already exists
    const existing = await Mechanic.findOne({ phone: data.phone });
    if (existing) {
        return res.status(400).json({ message: 'Mechanic with this phone already exists.' });
    }

    const mechanic = new Mechanic(data);
    try {
        await mechanic.save();
        res.status(201).json(mechanic);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 2. Get ALL Mechanics (Registered + could filter by location later)
app.get('/api/mechanics', async (req, res) => {
    try {
        const mechanics = await Mechanic.find();
        res.json(mechanics);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new booking
app.post('/api/bookings', async (req, res) => {
    const data = req.body;
    const booking = new Booking({
        ...data,
        status: 'pending',
        createdAt: new Date().toISOString()
    });
    try {
        await booking.save();
        res.status(201).json(booking);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update Status Routes
app.patch('/api/bookings/:id/accepted', async (req, res) => {
    const { mechanicId } = req.body;
    try {
        const booking = await Booking.findByIdAndUpdate(req.params.id, { status: 'accepted', mechanicId }, { new: true });
        res.json(booking);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

app.patch('/api/bookings/:id/cancelled', async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(req.params.id, { status: 'cancelled' }, { new: true });
        res.json(booking);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

app.patch('/api/bookings/:id/start', async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(req.params.id, { status: 'in-progress' }, { new: true });
        res.json(booking);
    } catch (err) { res.status(404).json({ message: 'Booking not found' }); }
});

app.patch('/api/bookings/:id/complete', async (req, res) => {
    const { finalCost, notes } = req.body;
    try {
        const booking = await Booking.findByIdAndUpdate(req.params.id, { status: 'pending-payment', finalCost, notes }, { new: true });
        res.json(booking);
    } catch (err) { res.status(404).json({ message: 'Booking not found' }); }
});

app.patch('/api/bookings/:id/pay-offline', async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(req.params.id, { status: 'completed', paymentMethod: 'offline' }, { new: true });
        res.json(booking);
    } catch (err) { res.status(404).json({ message: 'Booking not found' }); }
});
// --- NEW ROUTE FOR ONLINE PAYMENT ---
app.patch('/api/bookings/:id/pay-online', async (req, res) => {
    try {
        // Status update to 'completed' and method to 'online'
        const booking = await Booking.findByIdAndUpdate(req.params.id,
            { status: 'completed', paymentMethod: 'online' },
            { new: true }
        );
        res.json(booking);
    } catch (err) {
        res.status(404).json({ message: 'Booking not found' });
    }
});
// --- NEW ROUTE FOR RATING ---
app.patch('/api/bookings/:id/rate', async (req, res) => {
    const { rating, review } = req.body;
    try {
        const booking = await Booking.findByIdAndUpdate(req.params.id,
            { rating: rating, review: review },
            { new: true }
        );
        res.json(booking);
    } catch (err) {
        res.status(404).json({ message: 'Booking not found' });
    }
});

app.listen(PORT, () => console.log(`Backend listening on http://localhost:${PORT}`));