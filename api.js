const BASE_URL = "http://localhost:3000";


export async function getTurfs() {
  try {
    let response = await fetch(`${BASE_URL}/turfs`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (!response.ok) {
      throw new Error("Failed to fetch turfs list.");
    }
    return await response.json();
  } catch (error) {
    console.error("Fetch Turfs Error:", error);
    throw error;
  }
}


export async function getTurfById(id) {
  try {
    const response = await fetch(`${BASE_URL}/turfs/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (!response.ok) {
      throw new Error("Turf details not found.");
    }
    return await response.json();
  } catch (error) {
    console.error("Fetch Turf By ID Error:", error);
    throw error;
  }
}


export async function addTurf(turfData) {
  try {
    const response = await fetch(`${BASE_URL}/turfs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(turfData)
    });
    if (!response.ok) {
      throw new Error("Failed to add new turf.");
    }
    return await response.json();
  } catch (error) {
    console.error("Add Turf Error:", error);
    throw error;
  }
}


export async function updateTurf(turfId, updatedData) {
  try {
    const response = await fetch(`${BASE_URL}/turfs/${turfId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedData)
    });
    if (!response.ok) {
      throw new Error("Failed to update turf details.");
    }
    return await response.json();
  } catch (error) {
    console.error("Update Turf Error:", error);
    throw error;
  }
}


export async function deleteTurf(turfId) {
  try {
    const response = await fetch(`${BASE_URL}/turfs/${turfId}`, {
      method: "DELETE"
    });
    if (!response.ok) {
      throw new Error("Failed to delete turf.");
    }
    return true;
  } catch (error) {
    console.error("Delete Turf Error:", error);
    throw error;
  }
}


export async function getUserByEmail(email) {
  try {
    const safeEmail = encodeURIComponent(email);
    const response = await fetch(`${BASE_URL}/users?email=${safeEmail}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (!response.ok) {
      throw new Error("Unable to verify user details.");
    }
    const users = await response.json();
    return users.length > 0 ? users[0] : null;
  } catch (error) {
    console.error("Get User By Email Error:", error);
    throw error;
  }
}


export async function registerUser(userData) {
  try {
    let response = await fetch(`${BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userData)
    });
    if (!response.ok) {
      throw new Error("User registration failed.");
    }
    return await response.json();
  } catch (error) {
    console.error("Register User Error:", error);
    throw error;
  }
}



export async function getBookings() {
  try {
    const response = await fetch(`${BASE_URL}/bookings`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (!response.ok) {
      throw new Error("Failed to fetch bookings.");
    }
    return await response.json();
  } catch (error) {
    console.error("Get Bookings Error:", error);
    throw error;
  }
}


export async function createBooking(bookingData) {
  try {
    const response = await fetch(`${BASE_URL}/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(bookingData)
    });
    if (!response.ok) {
      throw new Error("Failed to save booking.");
    }
    return await response.json();
  } catch (error) {
    console.error("Create Booking Error:", error);
    throw error;
  }
}


export async function deleteBooking(bookingId) {
  try {
    const response = await fetch(`${BASE_URL}/bookings/${bookingId}`, {
      method: "DELETE"
    });
    if (!response.ok) {
      throw new Error("Failed to delete booking.");
    }
    return true;
  } catch (error) {
    console.error("Delete Booking Error:", error);
    throw error;
  }
}