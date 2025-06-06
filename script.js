// --- i18n loader and toggle ---
let translations = {};
let currentLang = "es"; // Default language

async function loadLanguage(lang) {
  const res = await fetch(`lang/${lang}.json`);
  translations = await res.json();
  applyTranslations();
}

function applyTranslations() {
  document.querySelector("h1").textContent = translations.title;
  document.querySelector(".form-box p").textContent = translations.subtitle;
  document.querySelector('label[for="followers"]').textContent =
    translations.followersLabel;
  document.getElementById("followers").placeholder =
    translations.followersPlaceholder;
  document.querySelector('label[for="following"]').textContent =
    translations.followingLabel;
  document.getElementById("following").placeholder =
    translations.followingPlaceholder;
  let compareBtn = document.querySelector('button[onclick="compareLists()"]');
  if (compareBtn) compareBtn.textContent = translations.compare;
  document.querySelector(
    "#notFollowingBack"
  ).previousElementSibling.textContent = translations.notFollowingBack;
  document.querySelector(
    "#youDontFollowBack"
  ).previousElementSibling.textContent = translations.youDontFollowBack;
}

document.addEventListener("DOMContentLoaded", function () {
  const langToggle = document.getElementById("lang-toggle");
  function getLabel(lang) {
    return lang === "es" ? "ES" : "EN";
  }
  function updateToggle() {
    langToggle.querySelector(".lang-label").textContent = getLabel(currentLang);
  }
  langToggle.onclick = () => {
    currentLang = currentLang === "en" ? "es" : "en";
    loadLanguage(currentLang);
    updateToggle();
  };
  updateToggle();
  loadLanguage(currentLang);
});

function extractUsernames(data) {
  return data.map((entry) => entry.string_list_data[0].value);
}

function compareLists() {
  const followersRaw = document.getElementById("followers").value;
  const followingRaw = document.getElementById("following").value;

  try {
    let followersData = JSON.parse(followersRaw);
    let followingData = JSON.parse(followingRaw);

    // If the data is an object, extract the first array property
    if (!Array.isArray(followersData)) {
      followersData = Object.values(followersData)[0];
    }
    if (!Array.isArray(followingData)) {
      followingData = Object.values(followingData)[0];
    }

    const followers = extractUsernames(followersData);
    const following = extractUsernames(followingData);

    const notFollowingBack = following.filter(
      (user) => !followers.includes(user)
    );
    const youDontFollowBack = followers.filter(
      (user) => !following.includes(user)
    );

    renderList("notFollowingBack", notFollowingBack);
    renderList("youDontFollowBack", youDontFollowBack);
  } catch (error) {
    alert(translations.error || "Error parsing JSON. Please check your input.");
  }
}

function renderList(id, items) {
  const ul = document.getElementById(id);
  ul.innerHTML = "";
  items.forEach((user) => {
    const li = document.createElement("li");
    li.textContent = user;
    ul.appendChild(li);
  });
}
