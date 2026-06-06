document.getElementById("add-song-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const song = {
    title: document.getElementById("title").value,
    artist: document.getElementById("artist").value,
    album: document.getElementById("album").value
  };

  await fetch("http://localhost:3000/songs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(song)
  });

  const notify = document.getElementById("notify");
  notify.textContent = "Song added!";
  notify.classList.add("show");

  setTimeout(() => {
    notify.classList.remove("show");
  }, 2000);

  e.target.reset();
});
