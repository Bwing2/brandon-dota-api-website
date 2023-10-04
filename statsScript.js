var searchInputEl = document.querySelector("#search-input");
var searchButtonEl = document.querySelector("#search-button");
var playerAccountIdEl = document.querySelector("#player-account-id");

function getLocalStorage() {
    var idSearch = JSON.parse(localStorage.getItem("steamId"))
    console.log(idSearch);
    getPlayerData(idSearch);
};

function getPlayerData(idSearch) {
    var openDotaUrl = `https://api.opendota.com/api/players/${idSearch}`;

    fetch(openDotaUrl)
    .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        var name = data.profile.personaname;
        var mmr = data.mmr_estimate.estimate;
        var pic = data.profile.avatarmedium;
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
    
};

getLocalStorage();