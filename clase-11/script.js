const resultsDiv = document.getElementById("results");
const searchBtn = document.getElementById("search-button");

function renderCharacters(characters) {
  resultsDiv.innerHTML = "";
  characters.forEach(char => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${char.image}" alt="${char.name}">
      <h3>${char.name}</h3>
      <p><strong>Status:</strong> ${char.status}</p>
      <p><strong>Species:</strong> ${char.species}</p>
      <p><strong>Gender:</strong> ${char.gender}</p>
    `;
    resultsDiv.appendChild(card);
  });
}

function showError(message) {
  resultsDiv.innerHTML = `<p style="color: rgb(200,0,0); font-weight: bold;">${message}</p>`;
}

async function fetchCharacters(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Request failed");
    const data = await res.json();
    renderCharacters(data.results);
  } catch (error) {
    showError("No characters found or an error occurred.");
  }
}

searchBtn.addEventListener("click", () => {
  const name = document.getElementById("name").value.trim();
  const status = document.getElementById("status").value.trim();
  const species = document.getElementById("species").value.trim();
  const type = document.getElementById("type").value.trim();
  const gender = document.getElementById("gender").value.trim();

  const params = new URLSearchParams();
  if (name) params.append("name", name);
  if (status) params.append("status", status);
  if (species) params.append("species", species);
  if (type) params.append("type", type);
  if (gender) params.append("gender", gender);

  const url = params.toString()
    ? `https://rickandmortyapi.com/api/character/?${params.toString()}`
    : `https://rickandmortyapi.com/api/character`;

  fetchCharacters(url);
});
