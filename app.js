

// // --- THIS IS THE FIX ---
// // These variables MUST be outside the class
// let generatedOTP = null;
// let otpTimeout = null;
// let tempUserType = 'customer';
// // --- END FIX ---


// class RoadFixApp {

//     constructor() {
//         this.currentUser = null;
//         this.userType = 'customer';
//         this.selectedVehicle = null;
//         this.selectedServices = [];
//         this.currentScreen = 'loginScreen';
//         this.bookings = [];
//         this.vehicleData = [];
//         this.serviceData = [];
//         this.bookingPollInterval = null; // For customer-side refresh
//         this.serverUrl = 'http://localhost:3000/api';

//         // Find elements
//         this.phoneLoginForm = document.getElementById('phoneLoginForm');
//         this.otpVerificationForm = document.getElementById('otpVerificationForm');
//         this.phoneInput = document.getElementById('phoneNumber');
//         this.otpInput = document.getElementById('otpInput');
//         this.resendOTPBtn = document.getElementById('resendOTPBtn');
//         this.loginScreen = document.getElementById('loginScreen');

//         this.init();
//     }

//     init() {
//         this.setupEventListeners();
//         this.loadSavedUser(); 
//         this.setMinDate();
//     }

//     async loadSavedUser() {
//         try {
//             const savedUser = localStorage.getItem('road_user');
//             if (savedUser) {
//                 this.currentUser = JSON.parse(savedUser); // This now works!
//                 this.userType = this.currentUser.type;
//                 if (this.userType === 'mechanic') {
//                     await this.showMechanicDashboard();
//                 } else {
//                     await this.showCustomerDashboard();
//                 }
//                 return true;
//             }
//         } catch (e) {
//             console.warn('Could not load saved user');
//         }
//         return false;
//     }

//     setupEventListeners() {
//         // --- Login Listeners ---
//         this.phoneLoginForm.addEventListener('submit', (e) => {
//             e.preventDefault();
//             const phoneNumber = this.phoneInput.value.trim();
//             if (!/^[0-9]{10}$/.test(phoneNumber)) {
//                 alert('Please enter a valid 10-digit mobile number');
//                 return;
//             }
//             this.sendOTP(phoneNumber); // Uses class method
//             this.phoneLoginForm.style.display = 'none';
//             this.otpVerificationForm.style.display = 'block';
//             this.otpInput.value = '';
//             this.otpInput.focus();
//             this.disableResendOTP(); // Uses class method
//         });

//         this.otpVerificationForm.addEventListener('submit', (e) => {
//             e.preventDefault();
//             const enteredOTP = this.otpInput.value.trim();

//             // Uses global variable
//             if (enteredOTP === generatedOTP) { 
//                 const user = {
//                     id: Math.random().toString(36).substr(2, 9),
//                     phone: this.phoneInput.value.trim(),
//                     type: tempUserType // Uses global variable
//                 };
//                 localStorage.setItem('road_user', JSON.stringify(user));

//                 this.currentUser = user; 
//                 this.userType = user.type;

//                 alert('OTP Verified. Logged in as ' + user.type);
//                 this.loginScreen.classList.remove('active');
//                 this.loginScreen.style.display = 'none';

//                 if (user.type === 'mechanic') {
//                     this.showMechanicDashboard();
//                 } else {
//                     this.showCustomerDashboard();
//                 }
//             } else {
//                 alert('Invalid OTP');
//             }
//         });

//         this.resendOTPBtn.addEventListener('click', () => {
//             const phoneNumber = this.phoneInput.value.trim();
//             this.sendOTP(phoneNumber);
//             this.disableResendOTP();
//         });

//         document.getElementById('customerLoginBtn').addEventListener('click', () => {
//             tempUserType = 'customer';
//             this.selectUserType('customer');
//         });
//         document.getElementById('mechanicLoginBtn').addEventListener('click', () => {
//             tempUserType = 'mechanic';
//             this.selectUserType('mechanic');
//         });

//         // --- Other App Listeners ---
//         document.querySelectorAll('[id^="logoutBtn"]').forEach(btn => {
//             btn.addEventListener('click', () => this.logout());
//         });
//         document.querySelectorAll('.vehicle-card').forEach(card => {
//             card.addEventListener('click', () => this.selectVehicleType(card.dataset.type));
//         });
//         document.getElementById('brandSelect').addEventListener('change', e => this.loadModels(e.target.value));
//         document.getElementById('modelSelect').addEventListener('change', () => this.validateVehicleSelection());
//         document.getElementById('fuelSelect').addEventListener('change', () => this.validateVehicleSelection());
//         document.getElementById('proceedToServices').addEventListener('click', () => this.proceedToServices());
//         document.querySelectorAll('.category-header').forEach(header => {
//             header.addEventListener('click', () => this.toggleCategory(header));
//         });
//         document.getElementById('proceedToBooking').addEventListener('click', () => this.proceedToBooking());
//         document.getElementById('backToVehicle').addEventListener('click', () => this.showScreen('vehicleScreen'));
//         document.getElementById('backToServices').addEventListener('click', () => this.showScreen('serviceScreen'));
//         const bookingForm = document.getElementById('bookingForm');
//         if (bookingForm) {
//             bookingForm.addEventListener('submit', e => this.submitBooking(e));
//         }
//         document.getElementById('getLocationBtn').addEventListener('click', () => this.getCurrentLocation());
//         const dateInput = document.getElementById('serviceDate');
//         if (dateInput) {
//             dateInput.addEventListener('change', () => this.generateTimeOptions());
//         }
//         const newBookingBtn = document.getElementById('newBookingBtn');
//         if (newBookingBtn) newBookingBtn.addEventListener('click', () => {
//             if (this.bookingPollInterval) {
//                 clearInterval(this.bookingPollInterval);
//             }
//             this.resetForms();
//             this.showScreen('vehicleScreen');
//         });
//         const emergencyBtn = document.getElementById('emergencyBtn');
//         if (emergencyBtn) emergencyBtn.addEventListener('click', () => this.handleEmergencyService());
//         document.getElementById('viewDashboardBtn').addEventListener('click', () => this.viewDashboard());
//         document.getElementById('trackServiceBtn').addEventListener('click', () => this.trackService());
//     }

//     // --- Login Helper Functions ---
//     sendOTP(phoneNumber) {
//         generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
//         console.log('Sending OTP:', generatedOTP);
//         alert(`For demo purpose OTP is: ${generatedOTP}`);
//     }

//     enableResendOTP() {
//         this.resendOTPBtn.disabled = false;
//         this.resendOTPBtn.textContent = 'Resend OTP';
//     }

//     disableResendOTP() {
//         this.resendOTPBtn.disabled = true;
//         let countdown = 30;
//         this.resendOTPBtn.textContent = `Resend OTP (${countdown}s)`;
//         otpTimeout = setInterval(() => { // Uses global otpTimeout
//             countdown--;
//             if (countdown <= 0) {
//                 clearInterval(otpTimeout);
//                 this.enableResendOTP();
//             } else {
//                 this.resendOTPBtn.textContent = `Resend OTP (${countdown}s)`;
//             }
//         }, 1000);
//     }

//     selectUserType(type) {
//         this.userType = type;
//         const customerBtn = document.getElementById('customerLoginBtn');
//         const mechanicBtn = document.getElementById('mechanicLoginBtn');
//         customerBtn.classList.toggle('active', type === 'customer');
//         customerBtn.classList.toggle('btn--primary', type === 'customer');
//         customerBtn.classList.toggle('btn--outline', type !== 'customer');
//         mechanicBtn.classList.toggle('active', type === 'mechanic');
//         mechanicBtn.classList.toggle('btn--primary', type === 'mechanic');
//         mechanicBtn.classList.toggle('btn--outline', type !== 'mechanic');
//     }

//     generateTimeOptions() { /* This function is empty but harmless */ }

//     logout() {
//         this.currentUser = null;
//         this.selectedVehicle = null;
//         this.selectedServices = [];
//         try {
//             localStorage.removeItem('road_user');
//         } catch (e) {
//             console.warn('Could not remove user from localStorage');
//         }

//         if (this.bookingPollInterval) {
//             clearInterval(this.bookingPollInterval);
//         }

//         generatedOTP = null;
//         if(otpTimeout) clearInterval(otpTimeout); // Now works
//         this.enableResendOTP();

//         this.showScreen('loginScreen');
//         this.resetForms();
//     }

//     resetForms() {
//         const bookingForm = document.getElementById('bookingForm');
//         if (bookingForm) {
//             bookingForm.reset();
//         }
//         document.querySelectorAll('.vehicle-card').forEach(card => card.classList.remove('selected'));
//         document.getElementById('vehicleDetails').style.display = 'none';
//         this.selectUserType('customer');
//         this.selectedServices = [];
//         this.updateServicesSummary();
//         this.selectedVehicle = null;
//         document.getElementById('proceedToServices').disabled = true;
//         document.getElementById('brandSelect').innerHTML = '<option value="">Choose Brand...</option>';
//         document.getElementById('modelSelect').innerHTML = '<option value="">Choose Model...</option>';
//         document.getElementById('modelSelect').disabled = true;
//         document.getElementById('fuelSelect').value = '';
//     }

//     updateFuelOptions(vehicleType) {
//         const fuelSelect = document.getElementById('fuelSelect');
//         fuelSelect.innerHTML = '';
//         fuelSelect.disabled = false;
//         const placeholder = document.createElement('option');
//         placeholder.value = "";
//         placeholder.textContent = "Select Fuel Type...";
//         placeholder.disabled = true;
//         placeholder.selected = true;
//         fuelSelect.appendChild(placeholder);
//         let options = [];
//         if (vehicleType === '2 Wheeler') {
//             options = ['Petrol', 'Electric'];
//         } else if (vehicleType === '4 Wheeler') {
//             options = ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'];
//         }
//         options.forEach(fuel => {
//             const optionElement = document.createElement('option');
//             optionElement.value = fuel;
//             optionElement.textContent = fuel;
//             fuelSelect.appendChild(optionElement);
//         });
//     }

//     async selectVehicleType(type) {
//         document.querySelectorAll('.vehicle-card').forEach(card => card.classList.remove('selected'));
//         const selectedCard = document.querySelector(`.vehicle-card[data-type="${type}"]`);
//         if (selectedCard) selectedCard.classList.add('selected');
//         this.updateFuelOptions(type);
//         await this.loadBrands(type);
//         document.getElementById('vehicleDetails').style.display = 'block';
//         this.selectedVehicle = null;
//         document.getElementById('proceedToServices').disabled = true;
//     }

//     async loadBrands(vehicleType) {
//         if (this.vehicleData.length === 0) {
//             try {
//                 const res = await fetch(`${this.serverUrl}/vehicles`);
//                 this.vehicleData = await res.json();
//             } catch (e) {
//                 console.error("Failed to fetch vehicles", e);
//                 alert("Error connecting to server. Please try again.");
//                 return;
//             }
//         }
//         const brands = [...new Set(this.vehicleData.filter(v => v.vehicle_type === vehicleType).map(v => v.brand))];
//         const brandSelect = document.getElementById('brandSelect');
//         brandSelect.innerHTML = '<option value="">Choose Brand...</option>';
//         brands.forEach(brand => {
//             brandSelect.innerHTML += `<option value="${brand}">${brand}</option>`;
//         });
//         document.getElementById('modelSelect').innerHTML = '<option value="">Choose Model...</option>';
//         document.getElementById('modelSelect').disabled = true;
//         document.getElementById('proceedToServices').disabled = true;
//     }

//     loadModels(brand) {
//         const modelSelect = document.getElementById('modelSelect');
//         if (!brand) {
//             modelSelect.innerHTML = '<option value="">Choose Model...</option>';
//             modelSelect.disabled = true;
//             document.getElementById('proceedToServices').disabled = true;
//             return;
//         }
//         const selectedVehicleType = document.querySelector('.vehicle-card.selected').dataset.type;
//         const models = this.vehicleData.filter(v => v.brand === brand && v.vehicle_type === selectedVehicleType).map(v => v.model);
//         modelSelect.innerHTML = '<option value="">Choose Model...</option>';
//         models.forEach(model => {
//             modelSelect.innerHTML += `<option value="${model}">${model}</option>`;
//         });
//         modelSelect.disabled = false;
//         this.validateVehicleSelection();
//     }

//     validateVehicleSelection() {
//         const brand = document.getElementById('brandSelect').value;
//         const model = document.getElementById('modelSelect').value;
//         const fuel = document.getElementById('fuelSelect').value;
//         if (brand && model && fuel) {
//             this.selectedVehicle = {
//                 type: document.querySelector('.vehicle-card.selected').dataset.type,
//                 brand,
//                 model,
//                 fuel
//             };
//             document.getElementById('proceedToServices').disabled = false;
//         } else {
//             this.selectedVehicle = null;
//             document.getElementById('proceedToServices').disabled = true;
//         }
//     }

//     async proceedToServices() {
//         if (!this.selectedVehicle) {
//             alert('Please complete your vehicle selection');
//             return;
//         }
//         this.showScreen('serviceScreen');
//         this.displayVehicleInfo();
//         await this.loadServices();
//     }

//     displayVehicleInfo() {
//         const vehicleInfo = document.getElementById('vehicleInfoDisplay');
//         vehicleInfo.innerHTML = `
//       <div class="vehicle-info-item"><strong>Type:</strong> ${this.selectedVehicle.type}</div>
//       <div class="vehicle-info-item"><strong>Brand:</strong> ${this.selectedVehicle.brand}</div>
//       <div class="vehicle-info-item"><strong>Model:</strong> ${this.selectedVehicle.model}</div>
//       <div class="vehicle-info-item"><strong>Fuel:</strong> ${this.selectedVehicle.fuel}</div>
//     `;
//     }

//     async loadServices() {
//         if (this.serviceData.length === 0) {
//             try {
//                 const res = await fetch(`${this.serverUrl}/services`);
//                 this.serviceData = await res.json();
//             } catch (e) {
//                 console.error("Failed to fetch services", e);
//                 alert("Error connecting to server. Please try again.");
//                 return;
//             }
//         }
//         const categories = [...new Set(this.serviceData.map(s => s.category))];
//         categories.forEach(category => {
//             const categoryServices = this.serviceData.filter(s => s.category === category);
//             const categoryContainer = document.getElementById(category);
//             if (!categoryContainer) return;
//             categoryContainer.innerHTML = '';
//             categoryServices.forEach(service => {
//                 const serviceItem = document.createElement('div');
//                 serviceItem.className = 'service-item';
//                 serviceItem.innerHTML = `
//           <div class="service-info">
//             <div class="service-name">${service.service_name}</div>
//           </div>
//           <div class="service-price">₹${service.price}</div>
//         `;
//                 serviceItem.addEventListener('click', () => this.toggleService(service, serviceItem));
//                 categoryContainer.appendChild(serviceItem);
//             });
//         });
//     }

//     toggleCategory(header) {
//         const category = header.dataset.category;
//         const servicesContainer = document.getElementById(category);
//         if (!servicesContainer) return;
//         const isCollapsed = servicesContainer.classList.contains('collapsed');
//         if (isCollapsed) {
//             servicesContainer.classList.remove('collapsed');
//             header.classList.remove('collapsed');
//         } else {
//             servicesContainer.classList.add('collapsed');
//             header.classList.add('collapsed');
//         }
//     }

//     toggleService(service, element) {
//         if (element.classList.contains('selected')) {
//             element.classList.remove('selected');
//             this.selectedServices = this.selectedServices.filter(s => s.service_name !== service.service_name);
//         } else {
//             element.classList.add('selected');
//             this.selectedServices.push(service);
//         }
//         this.updateServicesSummary();
//     }

//     updateServicesSummary() {
//         const summaryContainer = document.getElementById('servicesSummary');
//         const servicesList = document.getElementById('selectedServicesList');
//         const totalCostElement = document.getElementById('totalCost');

//         if (this.selectedServices.length === 0) {
//             summaryContainer.style.display = 'none';
//             return;
//         }
//         summaryContainer.style.display = 'block';
//         servicesList.innerHTML = '';
//         let totalCost = 0;

//         this.selectedServices.forEach(service => {
//             const serviceElement = document.createElement('div');
//             serviceElement.className = 'selected-service-item';
//             serviceElement.innerHTML = `
//         <div>
//           <div class="service-name">${service.service_name}</div>
//         </div>
//         <div style="display: flex; align-items: center; gap: 8px;">
//           <span class="service-price">₹${service.price}</span>
//           <button class="remove-service" onclick="app.removeService('${service.service_name}')">×</button>
//         </div>
//       `;
//             servicesList.appendChild(serviceElement);
//             totalCost += service.price;
//         });
//         totalCostElement.textContent = totalCost;
//     }

//     removeService(serviceName) {
//         this.selectedServices = this.selectedServices.filter(s => s.service_name !== serviceName);
//         document.querySelectorAll('.service-item').forEach(item => {
//             const nameElement = item.querySelector('.service-name');
//             if (nameElement && nameElement.textContent === serviceName) {
//                 item.classList.remove('selected');
//             }
//         });
//         this.updateServicesSummary();
//     }

//     parseDuration(duration) { /* Not used */ }

//     proceedToBooking() {
//         if (this.selectedServices.length === 0) {
//             alert('Please select at least one service');
//             return;
//         }
//         this.showScreen('bookingScreen');
//         this.displayBookingSummary();
//     }

//     displayBookingSummary() {
//         const summaryContent = document.getElementById('bookingSummaryContent');
//         const totalCost = this.selectedServices.reduce((sum, service) => sum + service.price, 0);
//         summaryContent.innerHTML = `
//       <div class="summary-item">
//         <span>Vehicle:</span>
//         <span>${this.selectedVehicle.brand} ${this.selectedVehicle.model}</span>
//       </div>
//       <div class="summary-item">
//         <span>Services:</span>
//         <span>${this.selectedServices.length} selected</span>
//       </div>
//       <div class="summary-item">
//         <span><strong>Total Cost:</strong></span>
//         <span><strong>₹${totalCost}</strong></span>
//       </div>
//     `;
//     }

//     setMinDate() {
//         const today = new Date();
//         const dateString = today.toISOString().split('T')[0];
//         const dateInput = document.getElementById('serviceDate');
//         if (dateInput) {
//             dateInput.min = dateString;
//             dateInput.value = dateString;
//         }
//     }

//     getCurrentLocation() {
//         if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition(
//                 position => {
//                     const { latitude, longitude } = position.coords;
//                     document.getElementById('serviceLocation').value = `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
//                 },
//                 error => {
//                     alert('Unable to get your location. Please enter manually.');
//                 }
//             );
//         } else {
//             alert('Geolocation is not supported by this browser.');
//         }
//     }

//     async submitBooking(e) {
//         e.preventDefault();

//         // This check now works because Bug 3 is fixed.
//         if (!this.currentUser || !this.currentUser.id) {
//             alert("Error: You are not logged in. Please log in again.");
//             this.logout();
//             return;
//         }

//         const bookingData = {
//             customerId: this.currentUser.id, // This is now correct!
//             customerName: document.getElementById('customerName').value,
//             customerPhone: document.getElementById('customerPhone').value,
//             location: document.getElementById('serviceLocation').value,
//             date: document.getElementById('serviceDate').value,
//             time: 'ASAP',
//             specialInstructions: document.getElementById('specialInstructions').value,
//             isEmergency: document.getElementById('emergencyBooking').checked,
//             vehicle: this.selectedVehicle,
//             services: this.selectedServices,
//             totalCost: this.selectedServices.reduce((sum, s) => sum + s.price, 0)
//         };

//         if (!bookingData.customerName || !bookingData.customerPhone || !bookingData.location || !bookingData.date) {
//             alert('Please fill out all required fields.');
//             return;
//         }

//         try {
//             const response = await fetch(`${this.serverUrl}/bookings`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(bookingData)
//             });
//             const newBooking = await response.json();

//             alert(`Booking confirmed! Your booking ID is: ${newBooking.id}`);
//             this.showBookingConfirmation(newBooking);

//         } catch (error) {
//             console.error(error);
//             alert('Failed to save booking.');
//         }
//     }

//     async updateBookingStatus(id, status, mechanicId = null) {
//         // This ID should now be correct from the backend fix
//         if (typeof id === 'undefined' || id === 'undefined') {
//             console.error("CRITICAL: Tried to update a booking with an undefined ID.");
//             return;
//         }
//         try {
//             const response = await fetch(`${this.serverUrl}/bookings/${id}/${status}`, {
//                 method: 'PATCH',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ mechanicId: mechanicId })
//             });
//             return await response.json();
//         } catch (error) {
//             console.error(`Failed to update status to ${status}`, error);
//         }
//     }

//     // ---
//     // --- ⬇️ THIS IS THE FIX FOR BUG 1 ⬇️ ---
//     // ---
//     // We are back to the reliable 'loadMechanicBookings'
//     async acceptBooking(id) {
//         if (!this.currentUser || !this.currentUser.id) {
//              alert("Error: Mechanic ID not found. Please log in again.");
//              return;
//         }

//         const updatedBooking = await this.updateBookingStatus(id, 'accepted', this.currentUser.id);
//         if (updatedBooking) {
//             alert('Booking accepted.');
//             await this.loadMechanicBookings(); // This re-fetches the list
//         }
//     }

//     async rejectBooking(id) {
//         const updatedBooking = await this.updateBookingStatus(id, 'cancelled');
//         if (updatedBooking) {
//             alert('Booking rejected.');
//             await this.loadMechanicBookings(); // This re-fetches the list
//         }
//     }
//     // --- ⬆️ END FIX FOR BUG 1 ⬆️ ---


//     trackService(id) {
//         const booking = this.bookings.find(b => b.id === id);
//         if (!booking) {
//             alert('Booking not found.');
//             return;
//         }
//         alert(`Tracking Booking ID: ${booking.id}\nStatus: ${booking.status}\nDate & Time: ${booking.date}`);
//     }

//     showBookingConfirmation(booking) {
//         const modal = document.getElementById('confirmationModal');
//         const detail = document.getElementById('bookingConfirmationDetails');
//         detail.innerHTML = `
//       <p><strong>Booking ID:</strong> ${booking.id}</p>
//       <p><strong>Date & Time:</strong> ${new Date(booking.date).toLocaleDateString()}</p>
//       <p><strong>Total Cost:</strong> ₹${booking.totalCost || 0}</p>
//       <p><strong>Status:</strong> <span class="status-badge status-badge--${booking.status}">${booking.status}</span></p>
//     `;
//         modal.classList.remove('hidden');
//     }

//     viewDashboard() {
//         document.getElementById('confirmationModal').classList.add('hidden');
//         this.resetForms();
//         if (this.userType === 'mechanic') {
//             this.showMechanicDashboard();
//         } else {
//             this.showCustomerDashboard();
//         }
//     }

//     async showCustomerDashboard() {
//         this.showScreen('customerDashboard');
//         await this.loadCustomerBookings(); // Load once
//         this.loadSavedVehicles();

//         // --- THIS IS THE FIX FOR BUG 2 ---
//         // Start polling for updates every 5 seconds
//         if (this.bookingPollInterval) {
//             clearInterval(this.bookingPollInterval);
//         }
//         this.bookingPollInterval = setInterval(async () => {
//             if (this.currentScreen === 'customerDashboard') {
//                 console.log('Polling for customer booking updates...');
//                 // We re-fetch the data from the server
//                 const res = await fetch(`${this.serverUrl}/bookings`);
//                 this.bookings = await res.json();
//                 this.renderCustomerBookings(); // Re-draw the list
//             } else {
//                 clearInterval(this.bookingPollInterval);
//                 this.bookingPollInterval = null;
//             }
//         }, 5000); // Poll every 5 seconds
//         // --- END FIX FOR BUG 2 ---
//     }

//     async showMechanicDashboard() {
//         // Stop any polling if the mechanic is also a customer
//         if (this.bookingPollInterval) {
//             clearInterval(this.bookingPollInterval);
//         }
//         this.showScreen('mechanicDashboard');
//         await this.loadMechanicBookings();
//     }

//     async loadMechanicBookings() {
//         try {
//             const res = await fetch(`${this.serverUrl}/bookings`);
//             this.bookings = await res.json();
//             this.renderMechanicStats();
//             this.renderBookingRequests();

//         } catch (e) {
//             console.error("Failed to load mechanic bookings", e);
//             document.getElementById('bookingRequestsList').innerHTML = `<div class="empty-message">Error connecting to server.</div>`;
//         }
//     }

//     // This function just loads and renders
//     async loadCustomerBookings() {
//          try {
//             const res = await fetch(`${this.serverUrl}/bookings`);
//             this.bookings = await res.json();
//             this.renderCustomerBookings(); // Call the render function
//         } catch (e) {
//             console.error("Failed to load customer bookings", e);
//             document.getElementById('customerBookingsList').innerHTML = `<div class="booking-empty">Error connecting to server.</div>`;
//         }
//     }

//     // This function just draws the UI (so the poll can call it)
//     renderCustomerBookings() {
//         const container = document.getElementById('customerBookingsList');

//         // This check is the fix for Bug 3
//         if (!this.currentUser || !this.currentUser.id) {
//             container.innerHTML = `<div class="booking-empty">Error loading user. Please log in again.</div>`;
//             return;
//         }

//         const customerBookings = this.bookings.filter(b => b.customerId === this.currentUser.id);

//         if (customerBookings.length === 0) {
//             container.innerHTML = `
//         <div class="booking-empty">
//         No bookings found. <a href="#" onclick="app.showScreen('vehicleScreen')">Book your first service</a>
//         </div>`;
//             return;
//         }

//         container.innerHTML = '';
//         customerBookings.reverse().forEach(booking => {
//             const servicesText = booking.services.map(s => s.service_name).join(', ');
//             const isAccepted = ['accepted', 'in-progress', 'pending-payment'].includes(booking.status);
//             const isRejected = ['rejected', 'cancelled'].includes(booking.status);

//             let statusCap = (booking.status || 'pending').replace('-', ' ').toUpperCase();
//             // The booking.id here is now fixed by the backend
//             let actionsHTML = `<button class="btn btn-outline btn-sm" onclick="app.viewBookingDetails('${booking.id}')">Details</button>`;

//             if (booking.status === 'pending-payment') {
//                 actionsHTML = `
//             <button class="btn btn--primary" onclick="app.openPaymentModal('${booking.id}', ${booking.finalCost}, '${booking.notes || ''}')">
//                 Pay Now
//             </button>
//         `;
//             } else if (isAccepted) {
//                 actionsHTML += ` <button class="btn btn-primary btn-sm" onclick="app.trackService('${booking.id}')">Track</button>`;
//             } else if (!isRejected && booking.status === 'pending') {
//                 actionsHTML += ` <button class="btn btn-outline btn-sm" onclick="app.cancelBooking('${booking.id}')">Cancel</button>`;
//             }

//             const div = document.createElement('div');
//             div.className = 'booking-item';
//             div.innerHTML = `
//             <div class="booking-header">
//             <strong>${booking.vehicle.brand} ${booking.vehicle.model}</strong>
//             <span class="status-badge status-badge--${booking.status || 'pending'}">${statusCap}</span>
//             </div>
//             <strong>Services Booked:</strong> ${servicesText}
//             <div class="booking-details" style="font-size: 0.9em; color: var(--color-text-secondary);">
//                 Scheduled For: ${new Date(booking.date).toLocaleDateString()}
//                 <br>
//                 Fee: ₹${booking.totalCost || 0}
//             </div>
//             <div class="booking-actions">
//                 ${actionsHTML}
//             </div>`;
//             container.appendChild(div);
//         });
//     }

//     renderMechanicStats() {
//         const pendingCount = this.bookings.filter(b => b.status === 'pending').length;
//         const todayStr = new Date().toDateString();
//         const completedTodayCount = this.bookings.filter(b =>
//             b.status === 'completed' &&
//             new Date(b.date).toDateString() === todayStr
//         ).length;
//         const earnings = this.bookings
//             .filter(b => b.status === 'completed')
//             .reduce((acc, b) => acc + (b.totalCost || b.finalCost || 0), 0);

//         document.getElementById('pendingCount').textContent = pendingCount;
//         document.getElementById('completedCount').textContent = completedTodayCount;
//         document.getElementById('earningsCount').textContent = earnings;
//     }

//     renderBookingRequests() {
//         const container = document.getElementById('bookingRequestsList');
//         const activeRequests = this.bookings.filter(b =>
//             b.status === 'pending' ||
//             b.status === 'accepted' ||
//             b.status === 'in-progress'
//         );

//         if (activeRequests.length === 0) {
//             container.innerHTML = `<div class="empty-message">No active requests</div>`;
//             return;
//         }

//         container.innerHTML = '';
//         activeRequests.forEach(booking => {
//             const servicesText = booking.services.map(s => s.service_name).join(', ');

//             let actionsHTML = '';
//             // The booking.id here is now fixed by the backend
//             if (booking.status === 'pending') {
//                 actionsHTML = `
//                 <button class="btn btn-primary" onclick="app.acceptBooking('${booking.id}')">Accept</button>
//                 <button class="btn btn-outline" onclick="app.rejectBooking('${booking.id}')">Reject</button>
//             `;
//             } else if (booking.status === 'accepted') {
//                 actionsHTML = `
//                 <button class="btn btn-primary" onclick="app.startJob('${booking.id}')">Start Job</button>
//                 <button class="btn btn-outline" onclick="app.rejectBooking('${booking.id}')">Cancel</button>
//             `;
//             } else if (booking.status === 'in-progress') {
//                 actionsHTML = `
//                 <button class="btn btn-primary" onclick="app.openFinalBillModal('${booking.id}', '${booking.customerName}', ${booking.totalCost})">Complete Job</button>
//             `;
//             }

//             const div = document.createElement('div');
//             div.className = 'request-item';

//             div.innerHTML = `
//             <div class="request-header">
//               <strong>${booking.customerName}</strong>
//               <span class="status-badge status-badge--${booking.status}">${booking.status.toUpperCase()}</span>
//             </div>
//             <div class="request-details">
//               Vehicle: ${booking.vehicle.brand} ${booking.vehicle.model} <br/>
//               Services: ${servicesText} <br/>
//               Date: ${new Date(booking.date).toLocaleDateString()} <br/>
//               Location: ${booking.location} <br/>
//               Quoted: <span class="request-price">₹${booking.totalCost || 0}</span>
//             </div>
//             <div class="request-actions">
//                 ${actionsHTML}
//             </div>`;
//             container.appendChild(div);
//         });
//     }

//     showScreen(screenId) {
//         document.querySelectorAll('.screen').forEach(s => {
//             s.classList.remove('active');
//             s.style.display = 'none';
//         });
//         const screen = document.getElementById(screenId);
//         if (screen) {
//             screen.classList.add('active');
//             screen.style.display = 'block';
//             this.currentScreen = screenId;
//         }
//     }

//     showLoading(show) {
//         const overlay = document.getElementById('loadingOverlay');
//         if (!overlay) return;
//         if (show) overlay.classList.remove('hidden');
//         else overlay.classList.add('hidden');
//     }

//     viewBookingDetails(id) {
//         const booking = this.bookings.find(b => b.id === id);
//         if (!booking) return alert('Booking not found');
//         alert(`Booking Details:
// ID: ${booking.id}
// Services: ${booking.services.map(s => s.service_name).join(', ')}
// Date: ${new Date(booking.date).toLocaleDateString()}
// Status: ${booking.status}
// Total: ₹${booking.finalCost || booking.totalCost || 0}`);
//     }

//     async cancelBooking(id) {
//         if (confirm('Are you sure you want to cancel this booking?')) {
//             const updatedBooking = await this.updateBookingStatus(id, 'cancelled');
//             if (updatedBooking) {
//                 await this.loadCustomerBookings();
//                 alert('Booking cancelled successfully.');
//             }
//         }
//     }

//     removeVehicle(index) {
//         let savedVehicles = [];
//         try {
//             savedVehicles = JSON.parse(localStorage.getItem('roadfix_saved_vehicles')) || [];
//         } catch {
//             savedVehicles = [];
//         }
//         if (confirm('Remove this vehicle from your saved list?')) {
//             savedVehicles.splice(index, 1);
//             localStorage.setItem('roadfix_saved_vehicles', JSON.stringify(savedVehicles));
//             this.loadSavedVehicles();
//         }
//     }

//     loadSavedVehicles() {
//         let savedVehicles = [];
//         try {
//             savedVehicles = JSON.parse(localStorage.getItem('roadfix_saved_vehicles')) || [];
//         } catch {
//             savedVehicles = [];
//         }
//         const vehiclesList = document.getElementById('savedVehiclesList');
//         vehiclesList.innerHTML = savedVehicles.length === 0 ?
//             '<div class="vehicle-item text-center">No saved vehicles</div>' : '';
//         savedVehicles.forEach((v, idx) => {
//             const elem = document.createElement('div');
//             elem.className = 'vehicle-item';
//             elem.innerHTML = `
//         <div class="vehicle-header">
//           <strong>${v.brand} ${v.model}</strong>
//           <button class="btn btn--outline btn--sm" onclick="app.removeVehicle(${idx})">Remove</button>
//         </div>
//         <div class="vehicle-details">
//           ${v.type} • ${v.fuel}
//         </div>`;
//             vehiclesList.appendChild(elem);
//         });
//     }

//     handleEmergencyService() {
//         this.showScreen('vehicleScreen');
//         alert('Emergency service selected. Please complete your vehicle and service selection for immediate assistance.');
//     }

//     // --- PAYMENT FLOW FUNCTIONS ---

//     async startJob(id) {
//         const updatedBooking = await this.updateBookingStatus(id, 'start');
//         if (updatedBooking) {
//             await this.loadMechanicBookings(); 
//         }
//     }

//     openFinalBillModal(id, customerName, originalCost) {
//         document.getElementById('finalBillBookingId').value = id;
//         document.getElementById('billCustomerName').textContent = customerName;
//         document.getElementById('billOriginalCost').textContent = originalCost || 0;
//         document.getElementById('finalCostInput').value = originalCost || 0;
//         document.getElementById('finalNotes').value = '';
//         document.getElementById('finalBillModal').classList.remove('hidden');
//         document.getElementById('finalBillForm').onsubmit = (e) => this.sendFinalBill(e);
//     }

//     async sendFinalBill(e) {
//         e.preventDefault();
//         const id = document.getElementById('finalBillBookingId').value;
//         const finalCost = document.getElementById('finalCostInput').value;
//         const notes = document.getElementById('finalNotes').value;

//         await fetch(`${this.serverUrl}/bookings/${id}/complete`, {
//             method: 'PATCH',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//                 finalCost: parseInt(finalCost),
//                 notes: notes
//             })
//         });

//         document.getElementById('finalBillModal').classList.add('hidden');
//         await this.loadMechanicBookings();
//         alert('Final bill sent to customer!');
//     }

//     openPaymentModal(id, finalCost, notes) {
//         document.getElementById('paymentBookingId').value = id;
//         document.getElementById('paymentFinalCost').textContent = finalCost || 0;
//         document.getElementById('paymentNotes').textContent = notes || "No additional notes.";
//         document.getElementById('paymentModal').classList.remove('hidden');
//         document.getElementById('payOfflineBtn').onclick = () => this.payOffline();
//         document.getElementById('payOnlineBtn').onclick = () => this.payOnline();
//     }

//     async payOffline() {
//         const id = document.getElementById('paymentBookingId').value;
//         await fetch(`${this.serverUrl}/bookings/${id}/pay-offline`, {
//             method: 'PATCH'
//         });

//         document.getElementById('paymentModal').classList.add('hidden');
//         await this.loadCustomerBookings(); 
//         alert('Payment complete! Thank you.');
//     }

//     payOnline() {
//         alert('Online payment is not set up yet. Please choose Pay Offline.');
//     }
// }

// // --- Initialize the app ---
// // This must be LAST, after the class is defined
// const app = new RoadFixApp();
// window.app = app;



// ==========================================
/// ==========================================
// 1. FIREBASE CONFIGURATION
// ==========================================
// 🔴 REPLACE THIS SECTION WITH YOUR REAL KEYS FROM FIREBASE CONSOLE
const firebaseConfig = {
    apiKey: "AIzaSyARIF4bUnK8XUBKl14HJw_JflUmnb2046o", // <--- YOUR REAL KEY
    authDomain: "roadfix-48695.firebaseapp.com",
    projectId: "roadfix-48695",
    storageBucket: "roadfix-48695.firebasestorage.app",
    messagingSenderId: "928980022900",
    appId: "1:928980022900:web:558f090ea8ebba8180c321",
    measurementId: "G-62KTSJTVTN"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();


// ==========================================
// 2. GLOBAL VARIABLES
// ==========================================
let tempUserType = 'customer';


// ==========================================
// 3. MAIN APPLICATION CLASS
// ==========================================
class RoadFixApp {

    constructor() {
        this.currentUser = null;
        this.userType = 'customer';
        this.selectedVehicle = null;
        this.selectedServices = [];
        this.currentScreen = 'loginScreen';
        this.bookings = [];
        this.vehicleData = [];
        this.serviceData = [];
        this.bookingPollInterval = null;
        this.serverUrl = 'http://localhost:3000/api';
        this.confirmationResult = null;
        this.map = null;

        // DOM Elements
        this.phoneLoginForm = document.getElementById('phoneLoginForm');
        this.otpVerificationForm = document.getElementById('otpVerificationForm');
        this.phoneInput = document.getElementById('phoneNumber');
        this.otpInput = document.getElementById('otpInput');
        this.resendOTPBtn = document.getElementById('resendOTPBtn');
        this.loginScreen = document.getElementById('loginScreen');

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupRecaptcha();
        this.loadSavedUser();
        this.setMinDate();
    }

    // --- A. INITIALIZATION & SETUP ---

    setupRecaptcha() {
        // Checks if recaptcha is already rendered to avoid duplicates
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
                'size': 'normal', // <--- CHANGED TO 'normal' TO SHOW THE CHECKBOX
                'callback': (response) => {
                    // reCAPTCHA solved - user can now click Send OTP
                    console.log("Recaptcha Verified");
                },
                'expired-callback': () => {
                    // Response expired. Ask user to solve reCAPTCHA again.
                    console.log("Recaptcha Expired");
                }
            });
            // Render the recaptcha immediately
            window.recaptchaVerifier.render();
        }
    }

    async loadSavedUser() {
        try {
            const savedUser = localStorage.getItem('road_user');
            if (savedUser) {
                this.currentUser = JSON.parse(savedUser);
                this.userType = this.currentUser.type;
                if (this.userType === 'mechanic') {
                    await this.showMechanicDashboard();
                } else {
                    await this.showCustomerDashboard();
                }
                return true;
            }
        } catch (e) { console.warn('Could not load saved user'); }
        return false;
    }

    setupEventListeners() {
        // 1. Login Listeners
        this.phoneLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const phoneNumber = this.phoneInput.value.trim();
            if (phoneNumber.length < 10) {
                alert('Please enter a valid mobile number');
                return;
            }
            const formattedPhone = `+91${phoneNumber}`;
            this.sendFirebaseOTP(formattedPhone);
        });

        this.otpVerificationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const code = this.otpInput.value.trim();
            this.verifyFirebaseOTP(code);
        });

        // 2. User Type Toggles
        document.getElementById('customerLoginBtn').addEventListener('click', () => {
            tempUserType = 'customer';
            this.selectUserType('customer');
        });
        document.getElementById('mechanicLoginBtn').addEventListener('click', () => {
            tempUserType = 'mechanic';
            this.selectUserType('mechanic');
        });

        // 3. Logout
        document.querySelectorAll('[id^="logoutBtn"]').forEach(btn => btn.addEventListener('click', () => this.logout()));

        // 4. Booking Flow Listeners
        document.querySelectorAll('.vehicle-card').forEach(card => {
            card.addEventListener('click', () => this.selectVehicleType(card.dataset.type));
        });
        document.getElementById('brandSelect').addEventListener('change', e => this.loadModels(e.target.value));
        document.getElementById('modelSelect').addEventListener('change', () => this.validateVehicleSelection());
        document.getElementById('fuelSelect').addEventListener('change', () => this.validateVehicleSelection());
        document.getElementById('proceedToServices').addEventListener('click', () => this.proceedToServices());

        document.querySelectorAll('.category-header').forEach(header => {
            header.addEventListener('click', () => this.toggleCategory(header));
        });

        document.getElementById('proceedToBooking').addEventListener('click', () => this.proceedToBooking());

        document.getElementById('backToVehicle').addEventListener('click', () => this.showScreen('vehicleScreen'));
        document.getElementById('backToServices').addEventListener('click', () => this.showScreen('serviceScreen'));

        const bookingForm = document.getElementById('bookingForm');
        if (bookingForm) {
            bookingForm.addEventListener('submit', e => this.submitBooking(e));
        }

        // 5. Dashboard Actions
        document.getElementById('getLocationBtn').addEventListener('click', () => this.getCurrentLocation());

        document.getElementById('newBookingBtn').addEventListener('click', () => {
            if (this.bookingPollInterval) clearInterval(this.bookingPollInterval);
            this.resetForms();
            this.showScreen('vehicleScreen');
        });

        document.getElementById('emergencyBtn').addEventListener('click', () => this.handleEmergencyService());
        document.getElementById('viewDashboardBtn').addEventListener('click', () => this.viewDashboard());
        document.getElementById('trackServiceBtn').addEventListener('click', () => this.trackService());
    }

    // --- B. LOGIN FUNCTIONS (FIREBASE) ---

    sendFirebaseOTP(phoneNumber) {
        const appVerifier = window.recaptchaVerifier;
        auth.signInWithPhoneNumber(phoneNumber, appVerifier)
            .then((confirmationResult) => {
                this.confirmationResult = confirmationResult;
                this.phoneLoginForm.style.display = 'none';
                this.otpVerificationForm.style.display = 'block';
                this.otpInput.value = '';
                this.otpInput.focus();
                alert("OTP Sent! (Check your phone or use test code)");
            }).catch((error) => {
                console.error("SMS Error:", error);
                alert("Error sending SMS: " + error.message);
                // If error (like recaptcha failed), reset it so they can try again
                window.recaptchaVerifier.render().then(widgetId => grecaptcha.reset(widgetId));
            });
    }

    verifyFirebaseOTP(code) {
        if (!this.confirmationResult) return;

        this.confirmationResult.confirm(code).then((result) => {
            const user = result.user;
            const appUser = {
                id: user.uid,
                phone: user.phoneNumber,
                type: tempUserType
            };
            localStorage.setItem('road_user', JSON.stringify(appUser));
            this.currentUser = appUser;
            this.userType = appUser.type;

            alert('Login Successful!');
            this.loginScreen.classList.remove('active');
            this.loginScreen.style.display = 'none';

            if (this.userType === 'mechanic') {
                this.showMechanicDashboard();
            } else {
                this.showCustomerDashboard();
            }
        }).catch((error) => {
            console.error("Verify Error:", error);
            alert("Invalid OTP. Please try again.");
        });
    }

    selectUserType(type) {
        this.userType = type;
        const custBtn = document.getElementById('customerLoginBtn');
        const mechBtn = document.getElementById('mechanicLoginBtn');

        if (type === 'customer') {
            custBtn.classList.add('btn--primary', 'active');
            custBtn.classList.remove('btn--outline');
            mechBtn.classList.add('btn--outline');
            mechBtn.classList.remove('btn--primary', 'active');
        } else {
            mechBtn.classList.add('btn--primary', 'active');
            mechBtn.classList.remove('btn--outline');
            custBtn.classList.add('btn--outline');
            custBtn.classList.remove('btn--primary', 'active');
        }
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('road_user');
        if (this.bookingPollInterval) clearInterval(this.bookingPollInterval);
        auth.signOut();

        this.showScreen('loginScreen');
        this.resetForms();
        this.phoneLoginForm.style.display = 'block';
        this.otpVerificationForm.style.display = 'none';

        // Re-render Recaptcha on logout to be ready for next login
        if (window.recaptchaVerifier) {
            window.recaptchaVerifier.clear();
            window.recaptchaVerifier = null;
            this.setupRecaptcha();
        }
    }

    // --- C. BOOKING CREATION FUNCTIONS ---

    resetForms() {
        const bookingForm = document.getElementById('bookingForm');
        if (bookingForm) bookingForm.reset();
        document.querySelectorAll('.vehicle-card').forEach(card => card.classList.remove('selected'));
        document.getElementById('vehicleDetails').style.display = 'none';
        this.selectUserType('customer');
        this.selectedServices = [];
        this.updateServicesSummary();
        this.selectedVehicle = null;
        document.getElementById('proceedToServices').disabled = true;
        document.getElementById('brandSelect').innerHTML = '<option value="">Choose Brand...</option>';
        document.getElementById('modelSelect').innerHTML = '<option value="">Choose Model...</option>';
        document.getElementById('modelSelect').disabled = true;
        document.getElementById('fuelSelect').value = '';

        // Clear Location and Map
        document.getElementById('serviceLocation').value = '';
        const mapDiv = document.getElementById('map');
        if (mapDiv) mapDiv.style.display = 'none';
        if (this.map) this.map.remove();
        this.map = null;
    }

    updateFuelOptions(vehicleType) {
        const fuelSelect = document.getElementById('fuelSelect');
        fuelSelect.innerHTML = '';
        fuelSelect.disabled = false;
        const placeholder = document.createElement('option');
        placeholder.value = "";
        placeholder.textContent = "Select Fuel Type...";
        placeholder.disabled = true;
        placeholder.selected = true;
        fuelSelect.appendChild(placeholder);
        let options = [];
        if (vehicleType === '2 Wheeler') {
            options = ['Petrol', 'Electric'];
        } else if (vehicleType === '4 Wheeler') {
            options = ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'];
        }
        options.forEach(fuel => {
            const optionElement = document.createElement('option');
            optionElement.value = fuel;
            optionElement.textContent = fuel;
            fuelSelect.appendChild(optionElement);
        });
    }

    async selectVehicleType(type) {
        document.querySelectorAll('.vehicle-card').forEach(card => card.classList.remove('selected'));
        const selectedCard = document.querySelector(`.vehicle-card[data-type="${type}"]`);
        if (selectedCard) selectedCard.classList.add('selected');
        this.updateFuelOptions(type);
        await this.loadBrands(type);
        document.getElementById('vehicleDetails').style.display = 'block';
        this.selectedVehicle = null;
        document.getElementById('proceedToServices').disabled = true;
    }

    async loadBrands(vehicleType) {
        if (this.vehicleData.length === 0) {
            try {
                const res = await fetch(`${this.serverUrl}/vehicles`);
                this.vehicleData = await res.json();
            } catch (e) {
                console.error("Failed to fetch vehicles", e);
                alert("Error connecting to server.");
                return;
            }
        }
        const brands = [...new Set(this.vehicleData.filter(v => v.vehicle_type === vehicleType).map(v => v.brand))];
        const brandSelect = document.getElementById('brandSelect');
        brandSelect.innerHTML = '<option value="">Choose Brand...</option>';
        brands.forEach(brand => {
            brandSelect.innerHTML += `<option value="${brand}">${brand}</option>`;
        });
        document.getElementById('modelSelect').innerHTML = '<option value="">Choose Model...</option>';
        document.getElementById('modelSelect').disabled = true;
        document.getElementById('proceedToServices').disabled = true;
    }

    loadModels(brand) {
        const modelSelect = document.getElementById('modelSelect');
        if (!brand) {
            modelSelect.innerHTML = '<option value="">Choose Model...</option>';
            modelSelect.disabled = true;
            document.getElementById('proceedToServices').disabled = true;
            return;
        }
        const selectedVehicleType = document.querySelector('.vehicle-card.selected').dataset.type;
        const models = this.vehicleData.filter(v => v.brand === brand && v.vehicle_type === selectedVehicleType).map(v => v.model);
        modelSelect.innerHTML = '<option value="">Choose Model...</option>';
        models.forEach(model => {
            modelSelect.innerHTML += `<option value="${model}">${model}</option>`;
        });
        modelSelect.disabled = false;
        this.validateVehicleSelection();
    }

    validateVehicleSelection() {
        const brand = document.getElementById('brandSelect').value;
        const model = document.getElementById('modelSelect').value;
        const fuel = document.getElementById('fuelSelect').value;
        if (brand && model && fuel) {
            this.selectedVehicle = {
                type: document.querySelector('.vehicle-card.selected').dataset.type,
                brand,
                model,
                fuel
            };
            document.getElementById('proceedToServices').disabled = false;
        } else {
            this.selectedVehicle = null;
            document.getElementById('proceedToServices').disabled = true;
        }
    }

    async proceedToServices() {
        if (!this.selectedVehicle) {
            alert('Please complete your vehicle selection');
            return;
        }
        this.showScreen('serviceScreen');
        this.displayVehicleInfo();
        await this.loadServices();
    }

    displayVehicleInfo() {
        const vehicleInfo = document.getElementById('vehicleInfoDisplay');
        vehicleInfo.innerHTML = `
      <div class="vehicle-info-item"><strong>Type:</strong> ${this.selectedVehicle.type}</div>
      <div class="vehicle-info-item"><strong>Brand:</strong> ${this.selectedVehicle.brand}</div>
      <div class="vehicle-info-item"><strong>Model:</strong> ${this.selectedVehicle.model}</div>
      <div class="vehicle-info-item"><strong>Fuel:</strong> ${this.selectedVehicle.fuel}</div>
    `;
    }

    async loadServices() {
        if (this.serviceData.length === 0) {
            try {
                const res = await fetch(`${this.serverUrl}/services`);
                this.serviceData = await res.json();
            } catch (e) { console.error("Failed to fetch services", e); return; }
        }
        const categories = [...new Set(this.serviceData.map(s => s.category))];
        categories.forEach(category => {
            const categoryServices = this.serviceData.filter(s => s.category === category);
            const categoryContainer = document.getElementById(category);
            if (!categoryContainer) return;
            categoryContainer.innerHTML = '';
            categoryServices.forEach(service => {
                const serviceItem = document.createElement('div');
                serviceItem.className = 'service-item';
                serviceItem.innerHTML = `
          <div class="service-info">
            <div class="service-name">${service.service_name}</div>
          </div>
          <div class="service-price">₹${service.price}</div>
        `;
                serviceItem.addEventListener('click', () => this.toggleService(service, serviceItem));
                categoryContainer.appendChild(serviceItem);
            });
        });
    }

    toggleCategory(header) {
        const category = header.dataset.category;
        const servicesContainer = document.getElementById(category);
        if (!servicesContainer) return;
        const isCollapsed = servicesContainer.classList.contains('collapsed');
        if (isCollapsed) {
            servicesContainer.classList.remove('collapsed');
            header.classList.remove('collapsed');
        } else {
            servicesContainer.classList.add('collapsed');
            header.classList.add('collapsed');
        }
    }

    toggleService(service, element) {
        if (element.classList.contains('selected')) {
            element.classList.remove('selected');
            this.selectedServices = this.selectedServices.filter(s => s.service_name !== service.service_name);
        } else {
            element.classList.add('selected');
            this.selectedServices.push(service);
        }
        this.updateServicesSummary();
    }

    updateServicesSummary() {
        const summaryContainer = document.getElementById('servicesSummary');
        const servicesList = document.getElementById('selectedServicesList');
        const totalCostElement = document.getElementById('totalCost');

        if (this.selectedServices.length === 0) {
            summaryContainer.style.display = 'none';
            return;
        }
        summaryContainer.style.display = 'block';
        servicesList.innerHTML = '';
        let totalCost = 0;

        this.selectedServices.forEach(service => {
            const serviceElement = document.createElement('div');
            serviceElement.className = 'selected-service-item';
            serviceElement.innerHTML = `
        <div>
          <div class="service-name">${service.service_name}</div>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span class="service-price">₹${service.price}</span>
          <button class="remove-service" onclick="app.removeService('${service.service_name}')">×</button>
        </div>
      `;
            servicesList.appendChild(serviceElement);
            totalCost += service.price;
        });
        totalCostElement.textContent = totalCost;
    }

    removeService(serviceName) {
        this.selectedServices = this.selectedServices.filter(s => s.service_name !== serviceName);
        document.querySelectorAll('.service-item').forEach(item => {
            const nameElement = item.querySelector('.service-name');
            if (nameElement && nameElement.textContent === serviceName) {
                item.classList.remove('selected');
            }
        });
        this.updateServicesSummary();
    }

    proceedToBooking() {
        if (this.selectedServices.length === 0) {
            alert('Please select at least one service');
            return;
        }
        this.showScreen('bookingScreen');
        this.displayBookingSummary();
    }

    displayBookingSummary() {
        const summaryContent = document.getElementById('bookingSummaryContent');
        const totalCost = this.selectedServices.reduce((sum, service) => sum + service.price, 0);
        summaryContent.innerHTML = `
      <div class="summary-item">
        <span>Vehicle:</span>
        <span>${this.selectedVehicle.brand} ${this.selectedVehicle.model}</span>
      </div>
      <div class="summary-item">
        <span>Services:</span>
        <span>${this.selectedServices.length} selected</span>
      </div>
      <div class="summary-item">
        <span><strong>Total Cost:</strong></span>
        <span><strong>₹${totalCost}</strong></span>
      </div>
    `;
    }

    async submitBooking(e) {
        e.preventDefault();

        // 1. Login Check
        if (!this.currentUser || !this.currentUser.id) {
            alert("Error: You are not logged in. Please log in again.");
            this.logout();
            return;
        }

        // 2. Get Mechanic Name (Use 'Any Nearby' if none selected)
        let selectedGarage = document.getElementById('selectedMechanicName').value;
        if (!selectedGarage) {
            // If user didn't pick from map, just use a default text
            selectedGarage = "Any Nearby Mechanic";
        }

        // 3. Collect Data
        const bookingData = {
            customerId: this.currentUser.id,
            customerName: document.getElementById('customerName').value,
            customerPhone: document.getElementById('customerPhone').value,
            location: document.getElementById('serviceLocation').value,
            date: document.getElementById('serviceDate').value,
            time: 'ASAP',
            specialInstructions: document.getElementById('specialInstructions').value,

            // Save Mechanic Info in Notes
            notes: `Assigned to: ${selectedGarage}`,

            isEmergency: document.getElementById('emergencyBooking').checked,
            vehicle: this.selectedVehicle,
            services: this.selectedServices,
            totalCost: this.selectedServices.reduce((sum, s) => sum + s.price, 0)
        };

        // 4. Basic Validation
        if (!bookingData.customerName || !bookingData.customerPhone || !bookingData.location || !bookingData.date) {
            alert('Please fill out all required fields (Name, Phone, Location, Date).');
            return;
        }

        // 5. Send to Server
        try {
            // Show loading state (optional but good for UX)
            const submitBtn = e.target.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = "Processing...";
            submitBtn.disabled = true;

            const response = await fetch(`${this.serverUrl}/bookings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingData)
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const newBooking = await response.json();

            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;

            alert(`Booking Confirmed! ID: ${newBooking.id}`);
            this.showBookingConfirmation(newBooking);

        } catch (error) {
            console.error("Booking Error:", error);
            alert('Failed to save booking. Please check your internet or server connection.');

            // Reset button on error
            const submitBtn = e.target.querySelector('button[type="submit"]');
            submitBtn.textContent = "Confirm Booking";
            submitBtn.disabled = false;
        }
    }
    // --- MAP & LOCATION FUNCTIONS ---
    // --- 📍 MAP & NEARBY MECHANIC LOGIC (UPDATED) ---

    getCurrentLocation() {
        const locationBtn = document.getElementById('getLocationBtn');
        const serviceLocationInput = document.getElementById('serviceLocation');

        if (navigator.geolocation) {
            locationBtn.textContent = "⌛ Searching Real Garages...";
            locationBtn.disabled = true;

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const userLat = position.coords.latitude;
                    const userLng = position.coords.longitude;

                    // 1. Show User on Map
                    this.showMap(userLat, userLng);

                    // 2. Get Address
                    try {
                        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${userLat}&lon=${userLng}`);
                        const data = await response.json();
                        if (data && data.display_name) serviceLocationInput.value = data.display_name;
                    } catch (error) { console.error("Address error", error); }

                    // 3. Fetch REAL Garages & CALCULATE DISTANCE
                    try {
                        const query = `
                            [out:json];
                            (
                              node["shop"="car_repair"](around:5000, ${userLat}, ${userLng});
                              node["shop"="motorcycle_repair"](around:5000, ${userLat}, ${userLng});
                              node["amenity"="car_repair"](around:5000, ${userLat}, ${userLng});
                            );
                            out body;
                        `;
                        const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
                        const garageRes = await fetch(url);
                        const garageData = await garageRes.json();

                        // Process Data & Add Distance
                        let realMechanics = garageData.elements.map(m => {
                            const dist = this.calculateDistance(userLat, userLng, m.lat, m.lon);
                            return {
                                id: m.id,
                                name: m.tags.name || "Local Garage",
                                lat: m.lat,
                                lng: m.lon,
                                address: m.tags['addr:street'] || "Nearby Location",
                                distance: dist // Store distance
                            };
                        });

                        // --- THIS IS THE SORTING LOGIC ---
                        // Sort by distance (Smallest first)
                        realMechanics.sort((a, b) => a.distance - b.distance);
                        // ---------------------------------

                        // Fallback if no garages found
                        if (realMechanics.length === 0) {
                            alert("No registered garages found nearby. Showing demo data.");
                            // Create demo data with calculated distance
                            const demoData = [
                                { name: "Raju Auto Works", lat: userLat + 0.002, lng: userLng + 0.002, address: "Main Road" },
                                { name: "Speedy Garage", lat: userLat - 0.002, lng: userLng - 0.002, address: "City Center" },
                                { name: "Bike Point", lat: userLat + 0.003, lng: userLng - 0.001, address: "Highway" }
                            ].map(m => ({
                                ...m,
                                distance: this.calculateDistance(userLat, userLng, m.lat, m.lng)
                            })).sort((a, b) => a.distance - b.distance);

                            this.showMechanicsOnMap(demoData);
                        } else {
                            this.showMechanicsOnMap(realMechanics);
                        }

                    } catch (e) {
                        console.error("Garage fetch error", e);
                        alert("Could not fetch nearby garages.");
                    }

                    locationBtn.textContent = "📍 Real Garages Found";
                    locationBtn.disabled = false;
                },
                (error) => {
                    alert('GPS Error: ' + error.message);
                    locationBtn.textContent = "📍 Get Current Location";
                    locationBtn.disabled = false;
                }
            );
        } else {
            alert('Geolocation not supported.');
        }
    }

    showMap(lat, lng) {
        const mapDiv = document.getElementById('map');
        mapDiv.style.display = 'block';

        // Reset Map if exists
        if (this.map) {
            this.map.remove();
        }

        // Create Map
        this.map = L.map('map').setView([lat, lng], 15);

        // Add Tiles (Design)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(this.map);

        // Add User Marker (Green)
        const greenIcon = new L.Icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
        });

        L.marker([lat, lng], { icon: greenIcon }).addTo(this.map)
            .bindPopup("<b>You are Here</b>")
            .openPopup();

        // Initialize marker array
        this.mechanicMarkers = [];
    }

    async findNearbyMechanics(lat, lng) {
        let mechanicsList = [];

        try {
            // A. Try fetching REAL garages from OpenStreetMap
            const query = `
                [out:json];
                (
                  node["shop"="car_repair"](around:5000, ${lat}, ${lng});
                  node["shop"="motorcycle_repair"](around:5000, ${lat}, ${lng});
                );
                out body;
            `;
            const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
            const res = await fetch(url);
            const data = await res.json();

            mechanicsList = data.elements.map(m => ({
                name: m.tags.name || "Local Auto Garage",
                lat: m.lat,
                lng: m.lon,
                address: m.tags['addr:street'] || "Nearby Location",
                rating: (Math.random() * (5.0 - 3.5) + 3.5).toFixed(1) // Random rating for realism
            }));

        } catch (e) {
            console.log("Real data fetch failed, using demo data.");
        }

        // B. Fallback: If no real garages found, add Demo Mechanics (So app always looks working)
        if (mechanicsList.length === 0) {
            mechanicsList = [
                { name: "Raju Auto Works", lat: lat + 0.002, lng: lng + 0.002, address: "Main Road, Near You", rating: "4.8" },
                { name: "Express Fix Garage", lat: lat - 0.002, lng: lng - 0.002, address: "City Center", rating: "4.5" },
                { name: "Bike & Car Care", lat: lat + 0.003, lng: lng - 0.001, address: "Highway Road", rating: "4.2" }
            ];
        }

        // Plot them on map
        this.plotMechanics(mechanicsList);
    }

    showMechanicsOnMap(mechanics) {
        // Red Icon for Mechanics
        const redIcon = new L.Icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
        });

        // List Container
        const listDiv = document.getElementById('nearbyGaragesList');
        const container = document.getElementById('garagesContainer');
        listDiv.style.display = 'block';
        container.innerHTML = '';

        mechanics.forEach(mech => {
            // 1. Add Marker
            const marker = L.marker([mech.lat, mech.lng], { icon: redIcon }).addTo(this.map);
            this.mechanicMarkers.push(marker);

            const selectGarage = () => {
                document.getElementById('selectedMechanicBox').style.display = 'block';
                document.getElementById('mechanicNameDisplay').textContent = `${mech.name} (${mech.distance.toFixed(2)} km)`;
                document.getElementById('selectedMechanicName').value = mech.name;

                marker.bindPopup(`<b>Selected: ${mech.name}</b><br>${mech.distance.toFixed(2)} km away`).openPopup();
                document.querySelectorAll('.garage-list-item').forEach(el => el.style.backgroundColor = 'white');
            };

            marker.on('click', selectGarage);
            marker.bindPopup(`<b>${mech.name}</b><br>${mech.distance.toFixed(2)} km away`);

            // 2. Add List Item
            const listItem = document.createElement('div');
            listItem.className = 'garage-list-item';
            listItem.style.cssText = "padding: 10px; border-bottom: 1px solid #eee; cursor: pointer; transition: background 0.2s; display: flex; justify-content: space-between; align-items: center;";

            listItem.innerHTML = `
                <div>
                    <div style="font-weight: bold; color: #333;">${mech.name}</div>
                    <div style="font-size: 0.8rem; color: #666;">${mech.address}</div>
                </div>
                <div style="font-weight: bold; color: #2980b9; font-size: 0.9rem;">
                    📍 ${mech.distance.toFixed(2)} km
                </div>
            `;

            listItem.onmouseover = () => listItem.style.backgroundColor = '#f0f8ff';
            listItem.onmouseout = () => listItem.style.backgroundColor = 'white';
            listItem.onclick = () => {
                listItem.style.backgroundColor = '#e3f2fd';
                selectGarage();
                this.map.setView([mech.lat, mech.lng], 16);
            };

            container.appendChild(listItem);
        });
    }

    // --- DISTANCE CALCULATOR HELPER ---
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of the earth in km
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // Distance in km
        return d;
    }

    deg2rad(deg) {
        return deg * (Math.PI / 180);
    }

    // Called when user clicks "Select" inside the map popup
    selectMechanic(name, address) {
        document.getElementById('selectedMechanicBox').style.display = 'block';
        document.getElementById('mechanicNameDisplay').textContent = name;
        document.getElementById('mechanicAddressDisplay').textContent = address;
        document.getElementById('selectedMechanicName').value = name; // Save for booking

        // Close the map popup
        this.map.closePopup();
        alert(`${name} selected!`);
    }

    setMinDate() {
        const today = new Date().toISOString().split('T')[0];
        if (document.getElementById('serviceDate')) document.getElementById('serviceDate').min = today;
    }

    // --- D. SCREEN NAVIGATION & HELPERS ---

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => {
            s.classList.remove('active');
            s.style.display = 'none';
        });
        const screen = document.getElementById(screenId);
        if (screen) {
            screen.classList.add('active');
            screen.style.display = 'block';
            this.currentScreen = screenId;
        }
    }

    showBookingConfirmation(booking) {
        const modal = document.getElementById('confirmationModal');
        const detail = document.getElementById('bookingConfirmationDetails');
        detail.innerHTML = `
      <p><strong>Booking ID:</strong> ${booking.id}</p>
      <p><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString()}</p>
      <p><strong>Total Cost:</strong> ₹${booking.totalCost || 0}</p>
      <p><strong>Status:</strong> <span class="status-badge status-badge--${booking.status}">${booking.status}</span></p>
    `;
        modal.classList.remove('hidden');
    }

    viewDashboard() {
        document.getElementById('confirmationModal').classList.add('hidden');
        this.resetForms();
        if (this.userType === 'mechanic') {
            this.showMechanicDashboard();
        } else {
            this.showCustomerDashboard();
        }
    }

    trackService(id) {
        let booking;
        if (typeof id === 'string') {
            booking = this.bookings.find(b => b.id === id);
        } else {
            if (this.bookings.length > 0) {
                const myBookings = this.bookings.filter(b => b.customerId === this.currentUser.id);
                booking = myBookings[myBookings.length - 1];
            }
        }

        if (!booking) {
            alert('Booking not found.');
            return;
        }
        alert(`Tracking Booking ID: ${booking.id}\nStatus: ${booking.status}\nDate: ${new Date(booking.date).toLocaleDateString()}`);
    }

    viewBookingDetails(id) {
        const booking = this.bookings.find(b => b.id === id);
        if (!booking) return alert('Booking not found');
        alert(`Booking Details:\nID: ${booking.id}\nStatus: ${booking.status}\nDate: ${new Date(booking.date).toLocaleDateString()}\nTotal: ₹${booking.finalCost || booking.totalCost}`);
    }

    async cancelBooking(id) {
        if (confirm('Are you sure you want to cancel this booking?')) {
            try {
                const response = await fetch(`${this.serverUrl}/bookings/${id}/cancelled`, { method: 'PATCH' });
                const updatedBooking = await response.json();
                if (updatedBooking) {
                    await this.loadCustomerBookings();
                    alert('Booking cancelled successfully.');
                }
            } catch (error) { console.error(error); alert('Failed to cancel'); }
        }
    }

    // --- UPDATED SOS FUNCTION ---
    handleEmergencyService() {
        if (!this.currentUser) {
            alert("Please login first to send SOS.");
            return;
        }

        // Show SOS Modal
        const modal = document.getElementById('sosModal');
        const countdownEl = document.getElementById('sosCountdown');
        const cancelBtn = document.getElementById('cancelSosBtn');

        modal.classList.remove('hidden');
        let count = 3;
        countdownEl.textContent = count;

        // Countdown Logic (gives user 3 seconds to cancel)
        const timer = setInterval(() => {
            count--;
            countdownEl.textContent = count;
            if (count <= 0) {
                clearInterval(timer);
                this.sendSosSignal(modal);
            }
        }, 1000);

        // Cancel Logic
        cancelBtn.onclick = () => {
            clearInterval(timer);
            modal.classList.add('hidden');
        };
    }

    async sendSosSignal(modal) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                const sosData = {
                    customerId: this.currentUser.id,
                    customerName: "Emergency User", // In real app, fetch from profile
                    customerPhone: this.currentUser.phone,
                    lat: lat,
                    lng: lng
                };

                try {
                    const response = await fetch(`${this.serverUrl}/sos`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(sosData)
                    });

                    modal.classList.add('hidden');
                    alert("🚨 SOS SENT! Help is on the way.");
                    this.showCustomerDashboard();

                } catch (error) {
                    modal.classList.add('hidden');
                    alert("Failed to send SOS. Call 100.");
                }
            });
        } else {
            alert("GPS Required for SOS.");
            modal.classList.add('hidden');
        }
    }

    // --- E. CUSTOMER DASHBOARD & POLLING ---

    async showCustomerDashboard() {
        this.showScreen('customerDashboard');
        await this.loadCustomerBookings();
        this.loadSavedVehicles();
        if (this.bookingPollInterval) clearInterval(this.bookingPollInterval);
        this.bookingPollInterval = setInterval(async () => {
            if (this.currentScreen === 'customerDashboard') {
                const res = await fetch(`${this.serverUrl}/bookings`);
                this.bookings = await res.json();
                this.renderCustomerBookings();
            } else {
                clearInterval(this.bookingPollInterval);
            }
        }, 5000);
    }

    async loadCustomerBookings() {
        try {
            const res = await fetch(`${this.serverUrl}/bookings`);
            this.bookings = await res.json();
            this.renderCustomerBookings();
        } catch (e) { console.error(e); }
    }

    renderCustomerBookings() {
        const container = document.getElementById('customerBookingsList');
        if (!this.currentUser || !this.currentUser.id) return;
        const customerBookings = this.bookings.filter(b => b.customerId === this.currentUser.id);

        if (customerBookings.length === 0) {
            container.innerHTML = `<div class="booking-empty">No bookings found.</div>`;
            return;
        }

        container.innerHTML = '';
        customerBookings.reverse().forEach(booking => {
            const servicesText = booking.services.map(s => s.service_name).join(', ');
            const isAccepted = ['accepted', 'in-progress', 'pending-payment'].includes(booking.status);
            const isRejected = ['rejected', 'cancelled'].includes(booking.status);
            let statusCap = (booking.status || 'pending').replace('-', ' ').toUpperCase();

            let actionsHTML = `<button class="btn btn-outline btn-sm" onclick="app.viewBookingDetails('${booking.id}')">Details</button>`;

            if (booking.status === 'pending-payment') {
                actionsHTML = `
            <button class="btn btn--primary" onclick="app.openPaymentModal('${booking.id}', ${booking.finalCost}, '${booking.notes || ''}')">Pay Now</button>`;
            } else if (isAccepted) {
                actionsHTML += ` <button class="btn btn-primary btn-sm" onclick="app.trackService('${booking.id}')">Track</button>`;
            } else if (!isRejected && booking.status === 'pending') {
                actionsHTML += ` <button class="btn btn-outline btn-sm" onclick="app.cancelBooking('${booking.id}')">Cancel</button>`;
            }

            const div = document.createElement('div');
            div.className = 'booking-item';
            div.innerHTML = `
            <div class="booking-header">
            <strong>${booking.vehicle.brand} ${booking.vehicle.model}</strong>
            <span class="status-badge status-badge--${booking.status || 'pending'}">${statusCap}</span>
            </div>
            <strong>Services:</strong> ${servicesText}
            <div class="booking-details" style="font-size: 0.9em; color: var(--color-text-secondary);">
                Date: ${new Date(booking.date).toLocaleDateString()} | Fee: ₹${booking.totalCost || 0}
            </div>
            <div class="booking-actions">${actionsHTML}</div>`;
            container.appendChild(div);
        });
    }

    // --- F. MECHANIC DASHBOARD ---

    async showMechanicDashboard() {
        if (this.bookingPollInterval) clearInterval(this.bookingPollInterval);
        this.showScreen('mechanicDashboard');
        await this.loadMechanicBookings();
    }

    async loadMechanicBookings() {
        try {
            const res = await fetch(`${this.serverUrl}/bookings`);
            this.bookings = await res.json();
            this.renderMechanicStats();
            this.renderBookingRequests();
        } catch (e) { console.error(e); }
    }

    renderMechanicStats() {
        const pendingCount = this.bookings.filter(b => b.status === 'pending').length;
        const todayStr = new Date().toDateString();
        const completedTodayCount = this.bookings.filter(b => b.status === 'completed' && new Date(b.date).toDateString() === todayStr).length;
        const earnings = this.bookings.filter(b => b.status === 'completed').reduce((acc, b) => acc + (b.totalCost || b.finalCost || 0), 0);

        document.getElementById('pendingCount').textContent = pendingCount;
        document.getElementById('completedCount').textContent = completedTodayCount;
        document.getElementById('earningsCount').textContent = earnings;
    }

    renderBookingRequests() {
        const container = document.getElementById('bookingRequestsList');
        const activeRequests = this.bookings.filter(b =>
            b.status === 'pending' || b.status === 'accepted' || b.status === 'in-progress'
        );

        if (activeRequests.length === 0) {
            container.innerHTML = `<div class="empty-message">No active requests</div>`;
            return;
        }

        container.innerHTML = '';

        // Sort: Show Emergency (SOS) FIRST
        activeRequests.sort((a, b) => (b.isEmergency === true) - (a.isEmergency === true));

        activeRequests.forEach(booking => {
            const servicesText = booking.services.map(s => s.service_name).join(', ');
            let actionsHTML = '';

            // Check if it's SOS
            const isSOS = booking.isEmergency;
            const cardClass = isSOS ? 'request-item sos-alert' : 'request-item';
            const statusBadge = isSOS ? '<span class="status-badge status-badge--sos">🚨 SOS ALERT</span>' : `<span class="status-badge status-badge--${booking.status}">${booking.status.toUpperCase()}</span>`;

            if (booking.status === 'pending') {
                actionsHTML = `
                <button class="btn btn-primary" onclick="app.acceptBooking('${booking.id}')">Accept</button>
                <button class="btn btn-outline" onclick="app.rejectBooking('${booking.id}')">Reject</button>`;
            } else if (booking.status === 'accepted') {
                actionsHTML = `
                <button class="btn btn-primary" onclick="app.startJob('${booking.id}')">Start Job</button>
                <button class="btn btn-outline" onclick="app.rejectBooking('${booking.id}')">Cancel</button>`;
            } else if (booking.status === 'in-progress') {
                actionsHTML = `<button class="btn btn-primary" onclick="app.openFinalBillModal('${booking.id}', '${booking.customerName}', ${booking.totalCost})">Complete Job</button>`;
            }

            const div = document.createElement('div');
            div.className = cardClass; // Apply Red Style if SOS

            div.innerHTML = `
            <div class="request-header">
              <strong>${booking.customerName} ${isSOS ? '(URGENT)' : ''}</strong>
              ${statusBadge}
            </div>
            <div class="request-details">
              ${isSOS ? '<p style="color:red; font-weight:bold;">📍 LOCATION SHARED VIA GPS</p>' : ''}
              Vehicle: ${booking.vehicle.brand} ${booking.vehicle.model} <br/>
              Services: ${servicesText} <br/>
              Location: ${booking.location} <br/>
            </div>
            <div class="request-actions">${actionsHTML}</div>`;
            container.appendChild(div);
        });
    }

    async acceptBooking(id) {
        if (!this.currentUser || !this.currentUser.id) { alert("Error: Mechanic ID not found."); return; }
        try {
            const response = await fetch(`${this.serverUrl}/bookings/${id}/accepted`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mechanicId: this.currentUser.id })
            });
            const updatedBooking = await response.json();
            if (updatedBooking) {
                alert('Booking accepted.');
                await this.loadMechanicBookings();
            }
        } catch (error) { console.error(error); }
    }

    async rejectBooking(id) {
        try {
            const response = await fetch(`${this.serverUrl}/bookings/${id}/cancelled`, { method: 'PATCH' });
            const updatedBooking = await response.json();
            if (updatedBooking) {
                alert('Booking rejected.');
                await this.loadMechanicBookings();
            }
        } catch (error) { console.error(error); }
    }

    async startJob(id) {
        try {
            const response = await fetch(`${this.serverUrl}/bookings/${id}/start`, { method: 'PATCH' });
            const updatedBooking = await response.json();
            if (updatedBooking) await this.loadMechanicBookings();
        } catch (error) { console.error(error); }
    }

    // --- G. PAYMENT & FINAL BILL ---
    // --- G. PAYMENT & FINAL BILL (UPDATED) ---

    openFinalBillModal(id, customerName, originalCost) {
        document.getElementById('finalBillBookingId').value = id;
        document.getElementById('billCustomerName').textContent = customerName;
        document.getElementById('billOriginalCost').textContent = originalCost || 0;
        document.getElementById('finalCostInput').value = originalCost || 0;
        document.getElementById('finalNotes').value = '';
        document.getElementById('finalBillModal').classList.remove('hidden');
        document.getElementById('finalBillForm').onsubmit = (e) => this.sendFinalBill(e);
    }

    async sendFinalBill(e) {
        e.preventDefault();
        const id = document.getElementById('finalBillBookingId').value;
        const finalCost = document.getElementById('finalCostInput').value;
        const notes = document.getElementById('finalNotes').value;

        await fetch(`${this.serverUrl}/bookings/${id}/complete`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ finalCost: parseInt(finalCost), notes: notes })
        });

        document.getElementById('finalBillModal').classList.add('hidden');
        await this.loadMechanicBookings();
        alert('Final bill sent!');
    }

    // --- NEW QR CODE LOGIC STARTS HERE ---

    openPaymentModal(id, finalCost, notes) {
        document.getElementById('paymentBookingId').value = id;
        document.getElementById('paymentFinalCost').textContent = finalCost || 0;
        document.getElementById('paymentNotes').textContent = notes || "No notes.";

        // Reset UI state
        document.getElementById('paymentModal').classList.remove('hidden');
        document.getElementById('qrCodeContainer').style.display = 'none';
        document.getElementById('payOnlineBtn').classList.remove('hidden');
        document.getElementById('payOfflineBtn').classList.remove('hidden');
        document.getElementById('confirmOnlinePaymentBtn').classList.add('hidden');

        // Button Listeners
        document.getElementById('payOfflineBtn').onclick = () => this.payOffline();

        // Generate QR when clicked
        document.getElementById('payOnlineBtn').onclick = () => this.generateQRCode(finalCost);

        // Confirm payment done
        document.getElementById('confirmOnlinePaymentBtn').onclick = () => this.confirmOnlinePayment();
    }

    generateQRCode(amount) {
        // 1. YOUR UPI ID (Replace 'sachin@upi' with your real UPI ID like '9876543210@paytm')
        const upiId = "sachin@upi";
        const name = "FastMech Service";

        // 2. Create the special UPI Link (This sets the amount automatically)
        // pa = Payee Address, pn = Payee Name, am = Amount, cu = Currency
        const upiLink = `upi://pay?pa=${upiId}&pn=${name}&am=${amount}&cu=INR`;

        // 3. Convert this link into a QR Image using a free API
        const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`;

        // 4. Show the QR code in the HTML
        document.getElementById('paymentQrCode').src = qrApiUrl;

        // 5. Update the UI to show QR and hide other buttons
        document.getElementById('qrCodeContainer').style.display = 'block';
        document.getElementById('payOnlineBtn').classList.add('hidden');
        document.getElementById('payOfflineBtn').classList.add('hidden');
        document.getElementById('confirmOnlinePaymentBtn').classList.remove('hidden');
    }

    async confirmOnlinePayment() {
        const id = document.getElementById('paymentBookingId').value;

        // 1. Update Status
        const response = await fetch(`${this.serverUrl}/bookings/${id}/pay-online`, {
            method: 'PATCH'
        });
        const updatedBooking = await response.json();

        // 2. Hide Payment Modal
        document.getElementById('paymentModal').classList.add('hidden');

        // 3. Refresh Dashboard
        await this.loadCustomerBookings();

        // 4. SHOW INVOICE
        this.generateInvoice(updatedBooking);
    }
    async payOffline() {
        const id = document.getElementById('paymentBookingId').value;

        // 1. Update Status
        const response = await fetch(`${this.serverUrl}/bookings/${id}/pay-offline`, {
            method: 'PATCH'
        });
        const updatedBooking = await response.json();

        // 2. Hide Payment Modal
        document.getElementById('paymentModal').classList.add('hidden');

        // 3. Refresh Dashboard
        await this.loadCustomerBookings();

        // 4. SHOW INVOICE
        this.generateInvoice(updatedBooking);
    }
    async payOffline() {
        const id = document.getElementById('paymentBookingId').value;

        // 1. Update Status
        const response = await fetch(`${this.serverUrl}/bookings/${id}/pay-offline`, {
            method: 'PATCH'
        });
        const updatedBooking = await response.json();

        // 2. Hide Payment Modal
        document.getElementById('paymentModal').classList.add('hidden');

        // 3. Refresh Dashboard
        await this.loadCustomerBookings();

        // 4. SHOW INVOICE
        this.generateInvoice(updatedBooking);
    }

    // --- NEW FUNCTION TO SHOW BILL ---
    generateInvoice(booking) {
        // Populate Invoice HTML with data
        document.getElementById('invDate').textContent = new Date().toLocaleDateString();
        document.getElementById('invId').textContent = booking.id; // or booking._id
        document.getElementById('invName').textContent = booking.customerName;
        document.getElementById('invPhone').textContent = booking.customerPhone;

        // Handle vehicle object safely
        const vehicleStr = booking.vehicle ? `${booking.vehicle.brand} ${booking.vehicle.model} (${booking.vehicle.fuel})` : 'N/A';
        document.getElementById('invVehicle').textContent = vehicleStr;

        // Handle services array
        const servicesStr = booking.services ? booking.services.map(s => s.service_name).join(', ') : 'General Service';
        document.getElementById('invServices').textContent = servicesStr;

        document.getElementById('invNotes').textContent = booking.notes || '-';
        document.getElementById('invMethod').textContent = booking.paymentMethod;
        document.getElementById('invAmount').textContent = booking.finalCost || booking.totalCost;

        // Show the modal
        document.getElementById('invoiceModal').classList.remove('hidden');

        // Close button logic
        document.getElementById('closeInvoiceBtn').onclick = () => {
            document.getElementById('invoiceModal').classList.add('hidden');
            // Open Rating Modal immediately after closing Invoice
            this.openRatingModal(booking.id);
        };
    }

    // --- RATING FUNCTIONS ---

    openRatingModal(id) {
        document.getElementById('ratingBookingId').value = id;
        document.getElementById('selectedRating').value = "0";
        document.getElementById('reviewText').value = "";

        // Reset Stars visual

        document.querySelectorAll('.star-rating span').forEach(s => s.classList.remove('active'));
        document.getElementById('ratingModal').classList.remove('hidden');

        // Add click logic to stars
        document.querySelectorAll('#starContainer span').forEach(star => {
            star.onclick = () => {
                const val = star.getAttribute('data-value');
                document.getElementById('selectedRating').value = val;
                this.highlightStars(val);
            };
        });

        document.getElementById('submitRatingBtn').onclick = () => this.submitRating();
        document.getElementById('skipRatingBtn').onclick = () => {
            document.getElementById('ratingModal').classList.add('hidden');
            alert("Service process completed!");
        };
    }

    highlightStars(count) {
        document.querySelectorAll('#starContainer span').forEach(star => {
            if (star.getAttribute('data-value') <= count) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }

    async submitRating() {
        const id = document.getElementById('ratingBookingId').value;
        const rating = document.getElementById('selectedRating').value;
        const review = document.getElementById('reviewText').value;

        if (rating === "0") {
            alert("Please select at least 1 star.");
            return;
        }

        try {
            await fetch(`${this.serverUrl}/bookings/${id}/rate`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rating, review })
            });

            document.getElementById('ratingModal').classList.add('hidden');
            alert("Thank you for your feedback!");
            await this.loadCustomerBookings(); // Refresh list to save rating
        } catch (error) {
            console.error(error);
            alert("Failed to submit rating.");
        }
    }
}

const app = new RoadFixApp();
window.app = app;