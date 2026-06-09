async function Songs() {
  const songs = await (await fetch("https://sofia-music-api.onrender.com")).json();
  renderSongs(songs);

  document.getElementById("search").addEventListener("input", e => {
    const term = e.target.value.toLowerCase();
    const filtered = songs.filter(s =>
      s.title.toLowerCase().includes(term)
    );
    renderSongs(filtered);
  });
}

function renderSongs(list) {
  document.getElementById("song-list").innerHTML = list.map(song => `
    <div class="song-card">
      <h2>${song.title}</h2>
      <p><strong>Artist:</strong> ${song.artist}</p>
      <p><strong>Album:</strong> ${song.album}</p>
    </div>
  `).join("");
}

Songs();
