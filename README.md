# SportzGrid — Turf & Sports Venue Booking Platform

SportzGrid is an interactive web-based sports arena booking platform built to eliminate manual phone calls and make reserving local turfs fast and reliable.
Users can explore arenas, filter by sport, bookmark favorites, check live slot availability, and confirm bookings instantly.

---

##  Key Highlights

* **No More Manual Phone Calls:** Direct online venue discovery, hourly pricing transparency, and instant slot reservations.
* **Double-Booking Protection:** Real-time slot locking prevents multiple users from booking the exact same venue and time slot.
* **Date & Time Validation:** Active restrictions ensure users cannot select past dates or lapsed time slots.
* **Smart Error Handling:** If the backend server is not running or the database fails to respond, friendly error alerts guide the user instead of leaving a blank screen.
* **Favorites System:** Bookmark preferred turfs for quick access anytime.
* **Live Search & Sport Filtering:** Dynamic search by turf name or location, plus instant category filters for Football, Cricket, and Badminton.
* **Admin Dashboard:** Dedicated dashboard to add new turfs, upload and update venue image paths, modify hourly pricing or slot details, and monitor incoming customer bookings in real time.

---

##  Tech Stack

* **Frontend:** HTML5, CSS3, JavaScript (Vanilla ES6), Bootstrap 5
* **Backend:** json-server (Mock REST API)
* **Database:** db.json
* **Version Control:** Git & GitHub

---

##  Setup & Execution Guide

To test the application with its full mock backend functionality, follow these steps:

## 1. Clone the Repository

git clone:  https://github.com/nishadbk951/sportzGrid.git


## 2. Start the Backend ApI Server

Ensure you have Node.js installed. Open your terminal in the project folder and run:
npx json-server db.json --port 3000




