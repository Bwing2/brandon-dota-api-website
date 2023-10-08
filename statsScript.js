var playerAccountIdEl = document.querySelector("#player-account-id");
var matchContainerEl = document.querySelector(".match-container");

function getLocalStorage() {
  var idSearch = JSON.parse(localStorage.getItem("steamId"));
  console.log(idSearch);
  getPlayerData(idSearch);
}

function getPlayerData(idSearch) {
  var openDotaUrl = `https://api.opendota.com/api/players/${idSearch}`;

  fetch(openDotaUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var pic = data.profile.avatarmedium;
      var name = data.profile.personaname;
      var mmr = data.mmr_estimate.estimate;

      console.log(data);
      console.log(name, mmr, pic);

      var profileImage = document.createElement("div");
      profileImage.classList.add("image-div");
      profileImage.innerHTML = `<img src="${pic}"/>`;
      playerAccountIdEl.appendChild(profileImage);

      var nameParagraph = document.createElement("h2");
      nameParagraph.innerHTML = `Steam Name: ${name}`;
      playerAccountIdEl.appendChild(nameParagraph);

      var mmrParagraph = document.createElement("h2");
      mmrParagraph.innerHTML = `Estimated MMR: ${mmr}`;
      playerAccountIdEl.appendChild(mmrParagraph);
    });

  // Fetches all match data for searched ID
  fetch(`https://api.opendota.com/api/players/${idSearch}/matches`)
    .then(function (res) {
      return res.json();
    })
    .then(function (matchesArray) {
      console.log(matchesArray);

      var startingLDuration = 0;
      var startingSDuration = 9999;
      var longMatchId;
      var shortMatchId;

      for (var i = 0; i < matchesArray.length; i++) {
        var arrayDuration = matchesArray[i].duration;
        var matchId = matchesArray[i].match_id;

        if (arrayDuration > startingLDuration) {
          startingLDuration = arrayDuration;
          longMatchId = matchId;
          var conversion = startingLDuration / 60;
          var longest = Math.round(conversion);
        }

        if (arrayDuration < startingSDuration) {
          startingSDuration = arrayDuration;
          shortMatchId = matchId;
          var conversion = startingSDuration / 60;
          var shortest = Math.round(conversion);
        }
      }

      var longMatchDiv = document.createElement("div");
      longMatchDiv.classList.add("long-match");
      matchContainerEl.appendChild(longMatchDiv);

      var longMatchNum = document.createElement("h3");
      longMatchNum.innerHTML = `Longest Match ID: ${longMatchId}`;
      longMatchDiv.appendChild(longMatchNum);

      var longestGame = document.createElement("p");
      longestGame.innerHTML = `Duration: ${longest} minutes`;
      longMatchDiv.appendChild(longestGame);

      var shortMatchDiv = document.createElement("div");
      shortMatchDiv.classList.add("short-match");
      matchContainerEl.appendChild(shortMatchDiv);

      var shortMatchNum = document.createElement("h3");
      shortMatchNum.innerHTML = `Shortest Match ID: ${shortMatchId}`;
      shortMatchDiv.appendChild(shortMatchNum);

      var shortestGame = document.createElement("p");
      shortestGame.innerHTML = `Duration: ${shortest} minutes`;
      shortMatchDiv.appendChild(shortestGame);
    });
}

getLocalStorage();
