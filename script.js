const searchInputEl = document.querySelector("#search-input");
const searchButtonEl = document.querySelector("#search-button");

searchButtonEl.addEventListener("click", function () {
  playerIdSearch();
  window.location.href = "stats.html";
});

// Converts SteamID64 to SteamID3, without brackets and only numbers.
// Reference used https://gist.github.com/bcahue/4eae86ae1d10364bb66d
function playerIdSearch() {
  let accountId = searchInputEl.value;
  let steamId64 = 76561197960265728n;
  let steamCalc = BigInt(accountId) - steamId64;
  let convertedId = steamCalc.toString();

  localStorage.setItem("steamId", JSON.stringify(convertedId));
}
