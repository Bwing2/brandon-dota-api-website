var searchInputEl = document.querySelector("#search-input");
var searchButtonEl = document.querySelector("#search-button");
var playerAccountIdEl = document.querySelector("#player-account-id");

searchButtonEl.addEventListener("click", function() {
    playerIdSearch();
    window.location.href = "stats.html";
});

// Converts SteamID64 to SteamID3, without brackets and only numbers.
// Reference used https://gist.github.com/bcahue/4eae86ae1d10364bb66d
function playerIdSearch() {
    var accountId = searchInputEl.value;
    var steamId64 = 76561197960265728n;
    var steamCalc = BigInt(accountId) - steamId64;
    var convertedId = steamCalc.toString()
    console.log(accountId);
    console.log(steamCalc);
    console.log(convertedId);
    
    localStorage.setItem("steamId", JSON.stringify(convertedId));
    getPlayerData(convertedId);
};

function getPlayerData(convertedId) {
    var openDotaUrl = `https://api.opendota.com/api/players/${convertedId}`;

    fetch(openDotaUrl)
    .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);
      });
};

