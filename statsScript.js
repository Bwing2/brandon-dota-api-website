const playerAccountIdEl = document.querySelector("#player-account-id");
const matchContainerEl = document.querySelector(".match-container");

function getLocalStorage() {
  var idSearch = JSON.parse(localStorage.getItem("steamId"));
  console.log(idSearch);
  getPlayerData(idSearch);
}

function userProfile(name, mmr, pic) {
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
}

function getPlayerData(idSearch) {
  const openDotaUrl = `https://api.opendota.com/api/players/${idSearch}`;

  fetch(openDotaUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      let pic = data.profile.avatarmedium;
      let name = data.profile.personaname;
      let mmr = data.mmr_estimate.estimate;

      userProfile(name, mmr, pic);
      getMatchesLongShort(idSearch);
    });
}

// Fetches all match data for searched ID
function getMatchesLongShort(idSearch) {
  let startingLDuration = 0;
  let longestHeroNum;
  let longMatchId;
  let killsL;
  let deathsL;
  let assistsL;
  let longestWin;

  let startingSDuration = 9999;
  let shortestHeroNum;
  let shortMatchId;
  let killsS;
  let deathsS;
  let assistsS;
  let shortestWin;

  fetch(`https://api.opendota.com/api/players/${idSearch}/matches`)
    .then(function (response) {
      return response.json();
    })
    .then(function (matchesArray) {
      console.log(matchesArray);

      for (let i = 0; i < matchesArray.length; i++) {
        let arrayDuration = matchesArray[i].duration;
        let matchId = matchesArray[i].match_id;
        let heroNumber = matchesArray[i].hero_id;
        let kills = matchesArray[i].kills;
        let deaths = matchesArray[i].deaths;
        let assists = matchesArray[i].assists;
        let playerSlot = matchesArray[i].player_slot;
        let radiantWin = matchesArray[i].radiant_win;

        if (playerSlot <= 4 && radiantWin === true) {
          longestWin = "Win!";
          shortestWin = "Loss.";
        } else if (playerSlot >= 128 && radiantWin === false) {
          longestWin = "Loss.";
          shortestWin = "Win.";
        }

        if (arrayDuration > startingLDuration) {
          startingLDuration = arrayDuration;
          longMatchId = matchId;
          longestHeroNum = heroNumber;
          killsL = kills;
          deathsL = deaths;
          assistsL = assists;
          var longest = Math.round(startingLDuration / 60);
          console.log(playerSlot, radiantWin, longestWin, longMatchId);
        }

        if (arrayDuration < startingSDuration) {
          startingSDuration = arrayDuration;
          shortMatchId = matchId;
          shortestHeroNum = heroNumber;
          killsS = kills;
          deathsS = deaths;
          assistsS = assists;
          var shortest = Math.round(startingSDuration / 60);
          console.log(playerSlot, radiantWin, shortestWin, shortMatchId);
        }
      }

      // Fetch hero information for each hero ID
      function fetchHeroInformation() {
        const heroInfoUrl =
          "https://raw.githubusercontent.com/odota/dotaconstants/master/build/heroes.json";

        fetch(heroInfoUrl)
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            let heroInfoLong = data[longestHeroNum];
            let heroInfoShort = data[shortestHeroNum];
            addContent(heroInfoLong, heroInfoShort);
          });
      }

      fetchHeroInformation();

      // Creates 2 divs with called information inside
      function addContent(heroInfoLong, heroInfoShort) {
        // Longest match data
        let longMatchDiv = document.createElement("div");
        longMatchDiv.classList.add("long-match");
        matchContainerEl.appendChild(longMatchDiv);

        let longMatchNum = document.createElement("h3");
        longMatchNum.innerHTML = `Longest Match ID: ${longMatchId}`;
        longMatchDiv.appendChild(longMatchNum);

        let longestGame = document.createElement("p");
        longestGame.innerHTML = `Duration: ${longest} minutes`;
        longMatchDiv.appendChild(longestGame);

        let longestWL = document.createElement("p");
        longestWL.innerHTML = `Game Result: ${longestWin}`;
        longMatchDiv.appendChild(longestWL);

        let heroL = document.createElement("p");
        heroL.innerHTML = `Hero: ${heroInfoLong.localized_name}`;
        longMatchDiv.appendChild(heroL);

        let kdaL = document.createElement("p");
        kdaL.innerHTML = `KDA: ${killsL}/${deathsL}/${assistsL}`;
        longMatchDiv.appendChild(kdaL);

        // Shortest match data
        let shortMatchDiv = document.createElement("div");
        shortMatchDiv.classList.add("short-match");
        matchContainerEl.appendChild(shortMatchDiv);

        let shortMatchNum = document.createElement("h3");
        shortMatchNum.innerHTML = `Shortest Match ID: ${shortMatchId}`;
        shortMatchDiv.appendChild(shortMatchNum);

        let shortestGame = document.createElement("p");
        shortestGame.innerHTML = `Duration: ${shortest} minutes`;
        shortMatchDiv.appendChild(shortestGame);

        let shortestWL = document.createElement("p");
        shortestWL.innerHTML = `Game Result: ${shortestWin}`;
        shortMatchDiv.appendChild(shortestWL);

        let heroS = document.createElement("p");
        heroS.innerHTML = `Hero: ${heroInfoShort.localized_name}`;
        shortMatchDiv.appendChild(heroS);

        let kdaS = document.createElement("p");
        kdaS.innerHTML = `KDA: ${killsS}/${deathsS}/${assistsS}`;
        shortMatchDiv.appendChild(kdaS);
      }
    });
}

getLocalStorage();
