
import { getTurfs, getBookings, createBooking, deleteBooking } from "./api.js";
import { getLoggedInUser, logout, getFavorites, toggleFavorite } from "./storage.js";


let loggedInUser = getLoggedInUser();

if (!loggedInUser) {
  window.location.href = "login.html";
}

const userNameElement = document.getElementById("userName");
if (userNameElement && loggedInUser) {
  userNameElement.textContent = "Welcome, " + loggedInUser.name;
}


let allTurfs = [];
let showingFavOnly = false;


const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", function () {
    let isSure = confirm("Are you sure you want to log out?");
    if (isSure) {
      logout(); 
      window.location.href = "login.html";
    }
  });
}


const turfContainer = document.getElementById("turfContainer");

function renderTurfs(turfsToDisplay) {
  turfContainer.innerHTML = "";

  if (turfsToDisplay.length === 0) {
    if (showingFavOnly) {
      turfContainer.innerHTML = `
        <div class="col-12 text-center py-5">
          <p class='text-muted fs-5'>❤️ No favourite turfs saved yet.</p>
          <small class='text-secondary'>Click the heart icon on any turf card to save it here.</small>
        </div>
      `;
    } else {
      turfContainer.innerHTML = "<p class='no-data text-center w-100 py-4 text-muted'>No turfs found matching your search.</p>";
    }
    return;
  }

  const userFavs = getFavorites(loggedInUser.email);

  turfsToDisplay.forEach(function (turf) {
    const isFav = userFavs.includes(String(turf.id));

    let col = document.createElement("div");
    col.className = "col-12 col-md-6 col-lg-4";

    col.innerHTML = `
      <div class="card h-100 shadow-sm border-0 position-relative">
        <img src="${turf.image}" class="card-img-top" alt="${turf.name}" style="height: 180px; object-fit: cover;">
        
        <!-- 🟢 Favourites Toggle Button -->
        <button class="btn btn-sm position-absolute top-0 end-0 m-2 rounded-circle bg-dark bg-opacity-75 border-0 text-white" 
                onclick="handleFavToggle('${turf.id}')" title="Toggle Favourite" style="font-size: 1.1rem; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center;">
          ${isFav ? "❤️" : "🤍"}
        </button>

        <div class="card-body d-flex flex-column">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <h5 class="card-title m-0 text-truncate">${turf.name}</h5>
            <span class="badge bg-success-subtle text-success border border-success-subtle">${turf.sport}</span>
          </div>

          <p class="card-text text-light small mb-2">📍 ${turf.location}</p>
          <p class="card-text text-secondary small flex-grow-1" style="display: -webkit-box; -webkit-line-clamp: 2;
            -webkit-box-orient: vertical; overflow: hidden;">
            ${turf.description}
          </p>

          <div class="d-flex justify-content-between align-items-center mt-auto pt-3 border-top">
            <span class="fw-bold text-success fs-5">₹${turf.PerHour}<small class="text-white fs-6">/ hr</small></span>
            <button class="btn btn-primary btn-sm px-3" onclick="openBookingModal('${turf.id}', '${turf.name}')">Book Now</button>
          </div>
        </div>
      </div>
    `;

    turfContainer.appendChild(col);
  });
}

window.handleFavToggle = function (turfId) {
  toggleFavorite(loggedInUser.email, turfId);
  filterTurfs();
};

async function fetchTurfs() {
  turfContainer.innerHTML = `
    <div class="col-12 text-center py-5">
      <div class="spinner-border text-success" role="status" style="width: 3rem; height: 3rem;">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-3 text-light">Loading available turfs, please wait...</p>
    </div>
  `;

  await new Promise(resolve => setTimeout(resolve, 1000));

  try {
    allTurfs = await getTurfs();
    renderTurfs(allTurfs);
  } catch (error) {
    console.error("Error loading turfs:", error);
    turfContainer.innerHTML = `
      <div class="col-12 text-center py-5">
        <div class="alert alert-danger d-inline-block px-4 py-3" role="alert">
          <h5 class="alert-heading mb-1">⚠️ Connection Error</h5>
          <p class="mb-0">Failed to load turfs. Please make sure the backend server (json-server) is running.</p>
        </div>
      </div>
    `;
  }
}

fetchTurfs();


const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const favFilterBtn = document.getElementById("favFilterBtn");

function filterTurfs() {
  let searchText = searchInput ? searchInput.value.toLowerCase().trim() : "";
  let selectedCategory = categoryFilter ? categoryFilter.value.toLowerCase() : "all";
  const userFavs = getFavorites(loggedInUser.email);

  let filteredList = allTurfs.filter(function (turf) {
    let nameMatches = turf.name.toLowerCase().includes(searchText);
    let locationMatches = turf.location.toLowerCase().includes(searchText);
    let sportMatches = (selectedCategory === "all") || (turf.sport.toLowerCase() === selectedCategory);
    let favMatches = !showingFavOnly || userFavs.includes(String(turf.id));

    return (nameMatches || locationMatches) && sportMatches && favMatches;
  });

  renderTurfs(filteredList);
}

if (searchInput) searchInput.addEventListener("input", filterTurfs);
if (categoryFilter) categoryFilter.addEventListener("change", filterTurfs);

if (favFilterBtn) {
  favFilterBtn.addEventListener("click", function () {
    showingFavOnly = !showingFavOnly;

    if (showingFavOnly) {
      favFilterBtn.classList.replace("btn-outline-danger", "btn-danger");
    } else {
      favFilterBtn.classList.replace("btn-danger", "btn-outline-danger");
    }

    filterTurfs();
  });
}

const bookingModal = document.getElementById("bookingModal");
const closeBookingModal = document.getElementById("closeBookingModal");
const bookingForm = document.getElementById("bookingForm");
const bookingDateInput = document.getElementById("bookingDate");

if (bookingDateInput) {
  const today = new Date().toISOString().split("T")[0];
  bookingDateInput.min = today;
}

window.openBookingModal = function (turfId, turfName) {
  document.getElementById("selectedTurfId").value = turfId;
  document.getElementById("modalTurfName").textContent = "Book " + turfName;
  bookingModal.style.display = "flex";
  document.body.style.overflow = "hidden";
};

if (closeBookingModal) {
  closeBookingModal.addEventListener("click", function () {
    bookingModal.style.display = "none";
    document.body.style.overflow = "auto";
  });
}


if (bookingForm) {
  bookingForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    let turfId = document.getElementById("selectedTurfId").value;
    let date = document.getElementById("bookingDate").value;
    let time = document.getElementById("bookingTime").value;

    try {
      let currentBookings = await getBookings();

      let isAlreadyBooked = currentBookings.find(function (b) {
        return String(b.turfId) === String(turfId) && b.date === date && b.time === time;
      });

      if (isAlreadyBooked) {
        alert("Sorry! Already booked for this date and time.");
        return; 
      }

      let selectedTurf = allTurfs.find(item => String(item.id) === String(turfId));
      let turfName = selectedTurf ? selectedTurf.name : "Turf";
      let amount = selectedTurf ? selectedTurf.PerHour : 0;

      let userChoice = confirm(`Are you sure you want to book ${turfName} on ${date} at ${time}?`);
      if (!userChoice) return;

      let newBooking = {
        turfId: turfId, 
        userEmail: loggedInUser.email,
        userName: loggedInUser.name,
        turfName: turfName,
        date: date,
        time: time,
        amount: amount
      };

      await createBooking(newBooking);

      alert("Booking Confirmed Successfully!");
      bookingForm.reset();
      bookingModal.style.display = "none";
      document.body.style.overflow = "auto";

    } catch (error) {
      console.error("Booking error:", error);
      alert("Failed to confirm booking. Please check json-server.");
    }
  });
}


const myBookingsBtn = document.getElementById("myBookingsBtn");
const myBookingsModal = document.getElementById("myBookingsModal");
const closeMyBookingsModal = document.getElementById("closeMyBookingsModal");
const userBookingsList = document.getElementById("userBookingsList");

async function showUserBookings() {
  userBookingsList.innerHTML = "<p class='text-muted'>Loading your bookings...</p>";

  try {
    let allBookings = await getBookings();
    let myBookings = allBookings.filter(b => b.userEmail === loggedInUser.email);

    userBookingsList.innerHTML = "";

    if (myBookings.length === 0) {
      userBookingsList.innerHTML = "<p class='text-muted'>No bookings made yet.</p>";
      return;
    }

    myBookings.forEach(function (item) {
      let div = document.createElement("div");
      div.className = "booking-item";
      div.style.borderBottom = "1px solid #ddd";
      div.style.padding = "10px 0";

      div.innerHTML = `
        <h4>${item.turfName}</h4>
        <p>📅 Date: ${item.date} | ⏰ Time: ${item.time}</p>
        <p>Amount: ₹${item.amount}</p>
        <button class="btn btn-sm btn-danger" onclick="cancelBooking('${item.id}')">Cancel Booking</button>
      `;

      userBookingsList.appendChild(div);
    });

  } catch (error) {
    console.error("Show bookings error:", error);
    userBookingsList.innerHTML = "<p class='text-danger'>Could not load your bookings.</p>";
  }
}

if (myBookingsBtn) {
  myBookingsBtn.addEventListener("click", function () {
    showUserBookings();
    myBookingsModal.style.display = "flex";
    document.body.style.overflow = "hidden";
  });
}

if (closeMyBookingsModal) {
  closeMyBookingsModal.addEventListener("click", function () {
    myBookingsModal.style.display = "none";
    document.body.style.overflow = "auto";
  });
}


window.cancelBooking = async function (bookingId) {
  let confirmDelete = confirm("Are you sure you want to cancel this booking?");
  if (confirmDelete) {
    try {
      await deleteBooking(bookingId);
      alert("Booking Cancelled Successfully! This slot is now available again.");
      showUserBookings();
    } catch (error) {
      console.error("Cancel booking error:", error);
      alert("Failed to cancel booking. Try again.");
    }
  }
};


emailjs.init("X6lD5f6S4zuyJV9me");

const contactForm = document.getElementById("contactForm");
const contactSubmitBtn = document.getElementById("contactSubmitBtn");

if (contactForm) {
  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    contactSubmitBtn.innerText = "Sending...";
    contactSubmitBtn.disabled = true;

    const templateParams = {
      name: document.getElementById("contactName").value.trim(),
      email: document.getElementById("contactEmail").value.trim(),
      phone: document.getElementById("contactPhone").value.trim(),
      message: document.getElementById("contactMessage").value.trim()
    };

    try {
      await emailjs.send("service_zkw1xeq", "template_cu5ntqd", templateParams);
      alert("Thank you! Your message has been sent successfully.");
      contactForm.reset();
    } catch (error) {
      console.error("Email send failed:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      contactSubmitBtn.innerText = "Send Message";
      contactSubmitBtn.disabled = false;
    }
  });
}