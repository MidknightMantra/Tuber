// script.js — Tuber: YouTube, without the surveillance.
// Built on Ubuntu. With no API keys. No servers. No tracking.
// By a developer who believes the web should be free.

const searchInput = document.getElementById("search-input");
const searchSubmit = document.getElementById("search-submit");
const videoList = document.querySelector(".video-list");
const placeholder = document.querySelector(".placeholder");

// --- SEARCH FUNCTION: NO API. NO PAYMENT. PURE WEB SCRAPING ---
async function searchVideos(query) {
  if (!query.trim()) return;

  videoList.innerHTML = "<div class='placeholder'>Loading…</div>";

  try {
    // YouTube's public search page — no login, no auth, no API key needed
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Could not reach YouTube. Try again later.");
    }

    const html = await response.text();

    // Parse HTML with DOMParser — built into every browser
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Find all video links — YouTube's class names are stable
    const videoElements = doc.querySelectorAll('a#video-title');

    if (videoElements.length === 0) {
      videoList.innerHTML = "<div class='placeholder'>No videos found. Try another search.</div>";
      return;
    }

    // Clear previous results
    videoList.innerHTML = "";

    // Render each video
    videoElements.forEach(link => {
      const href = link.href;
      const videoId = href.split('v=')[1]?.split('&')[0];
      const title = link.textContent.trim();

      // Skip if no ID or title
      if (!videoId || !title) return;

      // Thumbnail URL — YouTube’s public pattern
      const thumbnail = `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`;

      // Create card
      const card = document.createElement("div");
      card.className = "video-card";
      card.innerHTML = `
        <img src="${thumbnail}" alt="${title}" onerror="this.src='https://i.ytimg.com/vi/default/mqdefault.jpg'">
        <div class="title">${title}</div>
        <div class="channel">— YouTube —</div>
      `;

      // Open video in new tab — no iframe, no tracking
      card.addEventListener("click", () => {
        window.open(`https://www.youtube.com/watch?v=${videoId}`, "_blank");
      });

      videoList.appendChild(card);
    });

  } catch (error) {
    videoList.innerHTML = `<div class="placeholder">Error: ${error.message}<br><small>YouTube may be blocking requests. Try again later.</small></div>`;
  }
}

// --- EVENT LISTENERS ---
searchSubmit.addEventListener("click", () => {
  searchVideos(searchInput.value);
});

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchVideos(searchInput.value);
  }
});

// --- INITIAL STATE ---
placeholder.style.display = "block";

// --- OPTIONAL: SEARCH HISTORY (LOCAL ONLY) ---
function saveSearch(query) {
  let history = JSON.parse(localStorage.getItem('tuberHistory') || '[]');
  if (!history.includes(query)) {
    history.unshift(query);
    if (history.length > 10) history.pop();
    localStorage.setItem('tuberHistory', JSON.stringify(history));
  }
}

function showHistory() {
  const history = JSON.parse(localStorage.getItem('tuberHistory') || '[]');
  if (history.length === 0) return;

  const historyEl = document.createElement('div');
  historyEl.className = 'search-history';
  historyEl.innerHTML = '<p>Recent searches:</p>';
  history.forEach(q => {
    const btn = document.createElement('button');
    btn.textContent = q;
    btn.className = 'history-btn';
    btn.onclick = () => {
      searchInput.value = q;
      searchVideos(q);
    };
    historyEl.appendChild(btn);
  });
  document.querySelector('.search-bar').after(historyEl);
}

// Run on load
window.addEventListener('load', showHistory);

// Save search when user submits
searchSubmit.addEventListener("click", () => {
  if (searchInput.value.trim()) saveSearch(searchInput.value);
});
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && searchInput.value.trim()) saveSearch(searchInput.value);
});