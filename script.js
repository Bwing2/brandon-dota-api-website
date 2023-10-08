var searchInputEl = document.querySelector("#search-input");
var searchButtonEl = document.querySelector("#search-button");

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

    localStorage.setItem("steamId", JSON.stringify(convertedId));    
};



