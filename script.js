// Fetch API URL from .env file
let API_BASE_URL = "https://api.jobpromax.com";

let currentPage = 0;
const limit = 10;

// Toggle between development and production based on user input
document.getElementById("envToggle").addEventListener("change", (e) => {
  if (e.target.checked) {
    API_BASE_URL = "https://api.jobpromax.com"; // Switch to production API
  } else {
    API_BASE_URL = "https://prodapi.jobpromax.com"; // Switch back to development API
  }
  currentPage = 0;
  fetchNews(); // Fetch news again when environment changes
});

// Fetch news from API and display them
async function fetchNews() {
  const newsList = document.getElementById("newsList");
  newsList.innerHTML = "Loading...";

  try {
    const response = await fetch(
      `${API_BASE_URL}/news?skip=${currentPage * limit}&limit=${limit}`
    );
    const data = await response.json();

    // Clear the newsList before appending new items
    newsList.innerHTML = "";

    // Loop through the news items and add to the list
    data.forEach((news) => {
      const newsItem = document.createElement("div");
      newsItem.classList.add("news-item");

      newsItem.innerHTML = `
        <div>
          <h5>${news.title}</h5>
          <p>${news.description}</p>
          <p><strong>Link:</strong> <a href="${news.link}" target="_blank">${
        news.link
      }</a></p>
          <p><strong>Date:</strong> ${new Date(
            news.date
          ).toLocaleDateString()}</p>
          <p><strong>Image:</strong> <img src="${
            news.image
          }" width="100" alt="${news.title}" /></p>
        </div>
        <div>
          <button class="btn btn-danger" onclick="deleteNews('${
            news._id
          }')">Delete</button>
        </div>
      `;

      newsList.appendChild(newsItem);
    });

    // Enable or disable pagination buttons
    document.getElementById("prevPage").disabled = currentPage === 0;
    document.getElementById("nextPage").disabled = data.length < limit;
  } catch (error) {
    newsList.innerHTML = "Error loading news.";
    console.error("Error fetching news:", error);
  }
}

// Handle next and previous page buttons
function nextPage() {
  currentPage += 1;
  fetchNews();
}

function prevPage() {
  if (currentPage > 0) {
    currentPage -= 1;
    fetchNews();
  }
}

// Post a news item
async function postNews(event) {
  event.preventDefault();

  const title = document.getElementById("newsTitle").value;
  const description =
    document.getElementById("newsDescription").value ||
    "No description available";
  const image = document.getElementById("newsImage").value;
  const link = document.getElementById("newsLink").value;

  const newsItem = { title, description, image, link };

  try {
    const response = await fetch(`${API_BASE_URL}/news`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newsItem),
    });

    if (!response.ok) {
      throw new Error("Error posting news");
    }

    alert("News posted successfully!");
    document.getElementById("newsForm").reset();
    fetchNews();
  } catch (error) {
    alert("Failed to post news");
    console.error("Error posting news:", error);
  }
}

// Delete a news item
async function deleteNews(newsId) {
  const confirmDelete = confirm(
    "Are you sure you want to delete this news item?"
  );
  if (!confirmDelete) return;

  try {
    const response = await fetch(`${API_BASE_URL}/news/${newsId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Error deleting news");
    }

    alert("News deleted successfully!");
    fetchNews();
  } catch (error) {
    alert("Failed to delete news");
    console.error("Error deleting news:", error);
  }
}

// Fetch news on page load
fetchNews();
