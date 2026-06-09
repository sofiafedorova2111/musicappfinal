const API_URL = "https://sofia-music-api.onrender.com/songs";

const searchInput = document.getElementById("search");
const songList = document.getElementById("song-list");
const showAllBtn = document.getElementById("show-all");
const showFavBtn = document.getElementById("show-favorites");

let allSongs = [];


async function loadSongs() {
  try {
    const response = await fetch(API_URL);
    allSongs = await response.json();
    renderSongs(allSongs);
    showAllBtn.classList.add("active");
  } catch {
    songList.innerHTML = "<p>Failed to load songs.</p>";
  }
}


function renderSongs(songs) {
  songList.innerHTML = "";

  if (songs.length === 0) {
    songList.innerHTML = "<p>No songs found.</p>";
    return;
  }

  songs.forEach(song => {
    const item = document.createElement("div");
    item.className = "song-item";

    const heart = song.favorite ? "♥️" : "🩶";

    item.innerHTML = `
      <img src="${song.cover}" class="cover">
      <div class="song-info">
        <strong>${song.title}</strong><br>
        <span>${song.artist} — ${song.album}</span>
      </div>

      <button class="fav-btn" data-id="${song._id}">${heart}</button>

      <button class="delete-btn" data-id="${song._id}">
        <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="#fff">
          <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
        </svg>
      </button>
    `;

    songList.appendChild(item);
  });
}


searchInput.addEventListener("input", () => {
  const text = searchInput.value.toLowerCase();

  const results = allSongs.filter(song =>
    song.title.toLowerCase().includes(text) ||
    song.artist.toLowerCase().includes(text) ||
    song.album.toLowerCase().includes(text)
  );

  renderSongs(results);
});


songList.addEventListener("click", async (event) => {
  if (!event.target.classList.contains("fav-btn")) return;

  const id = event.target.dataset.id;

  try {
    const response = await fetch(`${API_URL}/${id}/favorite`, {
      method: "PATCH"
    });

    const updatedSong = await response.json();

    allSongs = allSongs.map(song =>
      song._id === updatedSong._id ? updatedSong : song
    );

    renderSongs(allSongs);
  } catch {
    console.error("Error toggling favorite");
  }
});


showAllBtn.addEventListener("click", () => {
  renderSongs(allSongs);
  showAllBtn.classList.add("active");
  showFavBtn.classList.remove("active");
});


showFavBtn.addEventListener("click", () => {
  const favorites = allSongs.filter(song => song.favorite);
  renderSongs(favorites);
  showFavBtn.classList.add("active");
  showAllBtn.classList.remove("active");
});


document.addEventListener("click", async (e) => {
  const btn = e.target.closest(".delete-btn");
  if (!btn) return;

  const id = btn.dataset.id;

  await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });

  showNotification("Song deleted!");
  loadSongs();
});


function showNotification(message) {
  const notify = document.getElementById("notify");
  notify.textContent = message;
  notify.classList.add("show");

  setTimeout(() => {
    notify.classList.remove("show");
  }, 2000);
}

loadSongs();
