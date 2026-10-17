
const USER_KEY = "loggedInUser";

export function saveLoggedInUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getLoggedInUser() {
  const data = localStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
}

export function logout() {
  localStorage.removeItem(USER_KEY);
}


export function getFavorites(userEmail) {
  if (!userEmail) return [];
  const data = localStorage.getItem(`fav_${userEmail}`);
  return data ? JSON.parse(data) : [];
}


export function toggleFavorite(userEmail, turfId) {
  if (!userEmail) return;
  let favs = getFavorites(userEmail);
  const strTurfId = String(turfId);

  if (favs.includes(strTurfId)) {
    favs = favs.filter(id => id !== strTurfId); 
  } else {
    favs.push(strTurfId); 
  }

  localStorage.setItem(`fav_${userEmail}`, JSON.stringify(favs));
}