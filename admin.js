
import { 
  getTurfs, 
  getTurfById, 
  addTurf, 
  updateTurf, 
  deleteTurf,
  getBookings 
} from "./api.js";

import { 
  getLoggedInUser, 
  logout 
} from "./storage.js";


let loggedUser = getLoggedInUser();

if (!loggedUser || loggedUser.email !== "admin@gmail.com") {
  alert("Access Denied! Admin only.");
  window.location.href = "login.html";
}


const adminLogoutBtn = document.getElementById("adminLogoutBtn");
if (adminLogoutBtn) {
  adminLogoutBtn.addEventListener("click", function () {
    let isOk = confirm("Are you sure you want to log out from Admin Dashboard?");
    if (isOk) {
      logout();
      window.location.href = "login.html";
    }
  });
}


const viewBookingsBtn = document.getElementById("viewBookingsBtn");
const bookingsSection = document.getElementById("bookingsSection");
const closeBookingsBtn = document.getElementById("closeBookingsBtn");
const adminBookingsList = document.getElementById("adminBookingsList");

if (viewBookingsBtn) {
  viewBookingsBtn.addEventListener("click", async function () {
    adminBookingsList.innerHTML = "<p class='text-secondary small'>Loading bookings...</p>";

    try {
      
      let bookings = await getBookings();

      adminBookingsList.innerHTML = "";

      if (bookings.length === 0) {
        adminBookingsList.innerHTML = "<p class='text-secondary small'>No bookings made yet.</p>";
      } else {
        bookings.forEach(function (b, index) {
          let div = document.createElement("div");
          div.className = "border-bottom border-secondary border-opacity-25 py-2 small text-light";
          div.innerHTML = `
            <strong class="text-white">#${index + 1} ${b.turfName}</strong> | User: <b class="text-success">${b.userName || "User"}</b> (${b.userEmail})<br>
            <span class="text-secondary">📅 Date: ${b.date} | ⏰ Time: ${b.time} | 💰 Amount: ₹${b.amount}</span>
          `;
          adminBookingsList.appendChild(div);
        });
      }
    } catch (error) {
      console.error("Error loading admin bookings:", error);
      adminBookingsList.innerHTML = "<p class='text-danger small'>Failed to load bookings from server.</p>";
    }

    bookingsSection.style.display = "block";
  });
}

if (closeBookingsBtn) {
  closeBookingsBtn.addEventListener("click", function () {
    bookingsSection.style.display = "none";
  });
}

let turfContainer = document.getElementById("turfContainer");

async function loadTurfs() {
  try {
    
    let data = await getTurfs();

    turfContainer.innerHTML = "";

    data.forEach(function (turf) {
      let card = document.createElement("div");
      card.className = "d-flex flex-column flex-sm-row align-items-center gap-3 p-3 rounded-3 bg-dark border border-secondary border-opacity-50 text-light shadow-sm";

      card.innerHTML = `
        <img 
          src="${turf.image}" 
          alt="${turf.name}"
          class="rounded-2 flex-shrink-0"
          style="width: 140px; height: 110px; object-fit: cover;"
          onerror="this.src='https://placehold.co/140x110?text=No+Image'"
        >

        <div class="flex-grow-1 w-100">
          <h4 class="h6 fw-bold text-white mb-1">${turf.name}</h4>
          <p class="small text-secondary mb-1">
            Sport: <b class="text-light">${turf.sport}</b> | Location: <b class="text-light">${turf.location}</b>
          </p>
          <p class="small fw-bold text-success mb-1">Rate: ₹${turf.PerHour} / hr</p>
          <p class="small text-secondary mb-3">${turf.description}</p>
          
          <div class="d-flex gap-2">
            <button onclick="editTurf('${turf.id}')" class="btn btn-primary btn-sm px-3">Update</button>
            <button onclick="deleteTurf('${turf.id}')" class="btn btn-outline-danger btn-sm px-3">Delete</button>
          </div>
        </div>
      `;

      turfContainer.appendChild(card);
    });

  } catch (error) {
    console.error("Error loading turfs:", error);
    alert("Could not load turfs from server!");
  }
}

loadTurfs();


let addTurfForm = document.getElementById("addTurfForm");

if (addTurfForm) {
  addTurfForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    let newTurf = {
      name: document.getElementById("turfName").value.trim(),
      sport: document.getElementById("turfSport").value,
      location: document.getElementById("turfLocation").value.trim(),
      PerHour: Number(document.getElementById("turfRate").value),
      image: document.getElementById("turfImage").value.trim(),
      description: document.getElementById("turfDesc").value.trim()
    };

    try {
     
      await addTurf(newTurf);
      alert("New Turf Added Successfully!");
      addTurfForm.reset();
      loadTurfs();
    } catch (error) {
      console.error("Error adding turf:", error);
      alert("Failed to add turf. Server error!");
    }
  });
}


window.editTurf = async function (turfId) {
  try {
    
    let turf = await getTurfById(turfId);

    let newName = prompt("Edit Turf Name:", turf.name);
    if (newName === null) return;

    let newSport = prompt("Edit Sport (football/cricket/badminton):", turf.sport);
    if (newSport === null) return;

    let newLocation = prompt("Edit Location:", turf.location);
    if (newLocation === null) return;

    let newRate = prompt("Edit Rate Per Hour:", turf.PerHour);
    if (newRate === null) return;

    let newImage = prompt("Edit Image Link:", turf.image);
    if (newImage === null) return;

    let newDesc = prompt("Edit Description:", turf.description);
    if (newDesc === null) return;

    let updatedData = {
      name: newName.trim(),
      sport: newSport.trim(),
      location: newLocation.trim(),
      PerHour: Number(newRate),
      image: newImage.trim(),
      description: newDesc.trim()
    };

    
    await updateTurf(turfId, updatedData);
    alert("Turf Details Updated Successfully!");
    loadTurfs();

  } catch (error) {
    console.error("Error updating turf:", error);
    alert("Failed to update turf.");
  }
};


window.deleteTurf = async function (turfId) {
  let isSure = confirm("Are you sure you want to delete this turf?");
  
  if (isSure) {
    try {
      
      await deleteTurf(turfId);
      alert("Turf Deleted Successfully!");
      loadTurfs();
    } catch (error) {
      console.error("Error deleting turf:", error);
      alert("Failed to delete turf.");
    }
  }
};