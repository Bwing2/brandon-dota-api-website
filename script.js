const searchInputEl = document.querySelector('#search-input');
const searchButtonEl = document.querySelector('#search-button');

searchButtonEl.addEventListener('click', function () {
  playerIdSearch();
  window.location.href = 'stats.html';
});

// Converts SteamID64 to SteamID3, without brackets and only numbers.
// Reference used https://gist.github.com/bcahue/4eae86ae1d10364bb66d
function playerIdSearch() {
  let accountId = searchInputEl.value;
  // Uses regular expression to find any digit 0-9 \d + all occurences in string g for global.
  // Returns array matching one or more digits in accountId string using join method with empty string.
  let numbers = accountId.match(/\d+/g).join('');
  let steamId64 = 76561197960265728n;
  let steamCalc = BigInt(numbers) - steamId64;
  let convertedId = steamCalc.toString();

  localStorage.setItem('steamId', JSON.stringify(convertedId));
}
