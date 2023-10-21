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
  profileImage.innerHTML = `<img class="profile" src="${pic}"/>`;
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

  var longMatchIndex;
  var shortMatchIndex;

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

        if (arrayDuration > startingLDuration) {
          startingLDuration = arrayDuration;
          longMatchId = matchId;
          longMatchIndex = i;
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
          shortMatchIndex = i;
          shortestHeroNum = heroNumber;
          killsS = kills;
          deathsS = deaths;
          assistsS = assists;
          var shortest = Math.round(startingSDuration / 60);
          console.log(playerSlot, radiantWin, shortMatchId);
        }
      }

      if (matchesArray[longMatchIndex].player_slot <= 4) {
        if (matchesArray[longMatchIndex].radiant_win === true) {
          longestWin = "Win!";
        } else {
          longestWin = "Loss.";
        }
      } else if (matchesArray[longMatchIndex].radiant_win === true) {
        longestWin = "Loss.";
      } else {
        longestWin = "Win!";
      }

      if (matchesArray[shortMatchIndex].player_slot <= 4) {
        if (matchesArray[shortMatchIndex].radiant_win === true) {
          shortestWin = "Win!";
        } else {
          shortestWin = "Loss.";
        }
      } else if (matchesArray[shortMatchIndex].radiant_win === true) {
        shortestWin = "Loss.";
      } else {
        shortestWin = "Win!";
      }

      console.log(
        longestWin,
        longMatchId,
        matchesArray[longMatchIndex].radiant_win
      );
      console.log(shortestWin, shortMatchId);

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
            let heroNameL = data[longestHeroNum].img;
            let heroNameS = data[shortestHeroNum].img;
            addContent(heroInfoLong, heroInfoShort, heroNameL, heroNameS);
          });
      }

      fetchHeroInformation();

      // Creates 2 divs with called information inside
      function addContent(heroInfoLong, heroInfoShort, heroNameL, heroNameS) {
        // Longest match data
        let heroLDiv = document.createElement("div");
        heroLDiv.classList.add("hero-div");
        matchContainerEl.appendChild(heroLDiv);

        // Hero image L div
        let heroImgLDiv = document.createElement("div");
        heroImgLDiv.classList.add("hero-img-div");
        heroLDiv.appendChild(heroImgLDiv);

        let heroImgL = document.createElement("img");
        heroImgL.src = `https://api.opendota.com${heroNameL}`;
        heroImgLDiv.appendChild(heroImgL);

        // Longest match data div
        let longMatchDiv = document.createElement("div");
        longMatchDiv.classList.add("long-match-div");
        heroLDiv.appendChild(longMatchDiv);

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

        // Hero S image and match info div
        let heroSDiv = document.createElement("div");
        heroSDiv.classList.add("hero-div");
        matchContainerEl.appendChild(heroSDiv);

        // Hero S image div
        let heroImgSDiv = document.createElement("div");
        heroImgSDiv.classList.add("hero-img-div");
        heroSDiv.appendChild(heroImgSDiv);

        let heroImgS = document.createElement("img");
        heroImgS.src = `https://api.opendota.com${heroNameS}`;
        heroImgSDiv.appendChild(heroImgS);

        // Shortest match data div
        let shortMatchDiv = document.createElement("div");
        shortMatchDiv.classList.add("short-match-div");
        heroSDiv.appendChild(shortMatchDiv);

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
