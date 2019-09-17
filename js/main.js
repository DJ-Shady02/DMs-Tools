"use strict";

// =========== Single Page Application functionality =========== //

// hide all pages
function hideAllPages() {
  let pages = document.querySelectorAll(".page");
  for (let page of pages) {
    page.style.display = "none";
  }
}

// show page or tab
function showPage(pageId) {
  hideAllPages();
  document.querySelector(`#${pageId}`).style.display = "block";
  location.href = `#${pageId}`;
  setActiveTab(pageId);
}

// sets active tabbar/ menu item
function setActiveTab(pageId) {
  let pages = document.querySelectorAll(".tabbar a");
  for (let page of pages) {
    if (`#${pageId}` === page.getAttribute("href")) {
      page.classList.add("active");
    } else {
      page.classList.remove("active");
    }

  }
}

// set default page
function setDefaultPage() {
  let page = "home";
  if (location.hash) {
    page = location.hash.slice(1);
  }
  showPage(page);
}

setDefaultPage();

// show a spinning loader when loading
function showLoader(show) {
  let loader = document.querySelector('#loader');
  if (show) {
    loader.classList.remove("hide");
  } else {
    loader.classList.add("hide");
  }
}

// =========== Firebase Application functionality =========== //

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD8hDricLqN06iKIlKq_s3EkWa-L6ghg1o",
  authDomain: "dm-s-tools-examen.firebaseapp.com",
  databaseURL: "https://dm-s-tools-examen.firebaseio.com",
  projectId: "dm-s-tools-examen",
  storageBucket: "dm-s-tools-examen.appspot.com",
  messagingSenderId: "1024990819908",
  appId: "1:1024990819908:web:8df40e3b4b10f08dbeee11"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//Make auth and firestore references
const auth = firebase.auth();
const db = firebase.firestore();

db.settings({
  experimentalForceLongPolling: true
});
const partyRef = db.collection("parties");

let selectedPartyId = "";

// =========== Firebase sign in functionality =========== //

// Listen for auth status changes
auth.onAuthStateChanged(function(user) {
  let tabbar = document.querySelector('#tabbar');
  console.log("User: ", user);
  if (user) { // if user exists and is authenticated
    setDefaultPage(); // Go to home
    showNav(true); // Show nav
  } else { // if user is not logged in
    showPage("login");
    showNav(false); // Hide nav
    // Show login form
    document.querySelector("#login-form").innerHTML = `
    <div id="auth-header">
      <h1>Sign in</h1>
    </div>
    <div id="auth-content">
      <label for="email">Email</label>
      <input type="email" id="login-email" placeholder="type here" required />
      <label for="password">Password</label>
      <input type="password" id="login-password" placeholder="type here" required>
    </div>
    <div id="auth-actions">
      <a id="go-to-sign-up" onclick="goToSignUp()">No account? Sign up here!</a>
      <button type="submit">Sign in</button>
    </div>
    `;
    console.log(document.querySelector('#login-form'));
  }
  showLoader(false);
});

// Show or hide navigation
function showNav(show) {
  let nav = document.querySelector('#tabbar');
  if (show) { // If show = true
    // Show navigation
    nav.innerHTML = `
    <a onclick="showPage('home')"><img src="img/icon-tavern.png" alt="tavern button icon"></a>
    <a onclick="showPage('party')"><img src="img/icon-party.png" alt="party manager button icon"></a>
    <a onclick="showPage('builder'), loadMonsters()"><img src="img/icon-builder.png" alt="encounter builder button icon"></a>
    <a onclick="showPage('tracker')"><img src="img/icon-tracker.png" alt="encounter tracker button icon"></a>
    <a onclick="showPage('lore')"><img src="img/icon-lore.png" alt="lore wikipedia button icon"></a>
    `;
  } else { // If show = false
    nav.innerHTML = ""; // Make nav empty
  }
}

// Login
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', e => {
  e.preventDefault();

  // Get user info
  const email = document.querySelector('#login-email').value;
  const password = document.querySelector('#login-password').value;
  console.log(email, password);

  // If email and password is correct
  auth.signInWithEmailAndPassword(email, password).then(cred => {
    loginForm.reset();
    showPage("home");
  });
});

// Logout
const logout = document.querySelector('#logout');
console.log(logout);
logout.addEventListener('click', (e) => {
  e.preventDefault();
  auth.signOut();
});

// ========== Party Manager functionality ====== //

partyRef.onSnapshot(function(snapshotData) {
  let parties = snapshotData.docs;
  appendParties(parties);
});

function appendParties(parties) {
  let htmlTemplate = "";
  for (let party of parties) {
    console.log(party.id);
    console.log(party.data().name);
    htmlTemplate += `
    <article>
      <h3>${party.data().name}</h3>
      <p># of characters ${party.data().amount}</p>
      <p>|</p>
      <p>Avg. level ${party.data().level}</p>
      <button onclick="saveSessionStorage">Use Party</button>
      <button onclick="selectParty('${party.id}', '${party.data().name}', '${party.data().level}' )">Edit</button>
      <button onclick="deleteParty('${party.id}')">Delete</button>
    </article>
    `;
  }
  document.querySelector('#party-container').innerHTML = htmlTemplate;

}



// add another character input box ///


// W3S modal functionality //
// Get the modal
let modal = document.getElementById("myModal");

// Get the button that opens the modal
//let btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
let span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
function openModal(btn) {
  modal.style.display = "block";
}

function closeModal(btn) {
  modal.style.display = "none";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// ===== CREATE PARTY =======//
function createParty() {
  // references to the input fields
  let newParty = [];
  for (let i = 0; i < characterCount; i++) {
    let nameInput = document.querySelector('#name');
    let levelInput = document.querySelector(`#character${i}Level`);
    console.log(nameInput.value);
    console.log(levelInput.value);

    let newCharacter = {
      name: nameInput.value,
      level: levelInput.value
    };
    newParty.push(newCharacter);
  }

  partyRef.add(newParty);
}

//character count //
function appendCharacterInputs() {
  let characterCount = sessionStorage.getItem("characterCount");
  let newParty = [];

  for (let i = 0; i < characterCount - 1; i++) {
    let nameInput = document.querySelector('#name');
    let levelInput = document.querySelector(`#character${i}Level`);

    let newCharacter = {
      name: nameInput.value,
      level: levelInput.value
    };
    newParty.push(newCharacter);
  }

  document.querySelector('#characterContainer').innerHTML = "";
  let htmlTemplate = "";
  for (let i = 0; i < characterCount; i++) {
    htmlTemplate += `
    <div id="newCharacter">
    <span id="slider${i}Value">1</span>
    <input oninput="updateSliderValue(${i})" class="slider" id="character${i}Level" type="range" min="1" max="20" value="${returnCharacterDefaults(newParty, i, "level")}">
    </div>
    `
  }
  document.querySelector('#characterContainer').innerHTML = htmlTemplate;
}

// If no values given, return defaults
function returnCharacterDefaults(characterArray, iteration, property) {
  // Check if characterArray[i].property exists
  if (characterArray[iteration].property == null) {
    console.log("I set value to default");
    if (property == "level") {
      return 1; // Return default
    } else if (property == "name") {
      return;
    }
  } else {
    console.log("I set value to the "+property+" value");
    return characterArray[iteration].property; // Return value
  }
}

function resetCharacterCount() {
  let characterCount = 1;
  sessionStorage.setItem("characterCount", characterCount);
}

function addMember() {
  let characterCount = sessionStorage.getItem("characterCount");
  characterCount++;
  sessionStorage.setItem("characterCount", characterCount);
  appendCharacterInputs();

}

function deleteMember() {
  sessionStorage.getItem(characterCount);
  characterCount--;
  sessionStorage.setItem("characterCount", characterCount);

}

// ========== UPDATE PARTY ==========//

// function selectParty(id, name, members, level) {
// references to the input fields
//   let nameInput = document.querySelector('#name-update');
// let membersInput = document.querySelector('#members-update');
// let levelInput = document.querySelector('#level-update');
// nameInput.value = name;
// membersInput.value = members;
// levelInput.value = level;
// console.log(id);
// selectedPartyId = id;
// }

// function updateParty() {
// let nameInput = document.querySelector('#name-update');
//   let membersInput = document.querySelector('#members-update');
//   let levelInput = document.querySelector('#level-update');

//   let partyToUpdate = {
//   name: nameInput.value,
//   members: membersInput.value,
//   level: levelInput.value
//   };
//   partyRef.doc(selectedPartyId).set(partyToUpdate);

// }

// ========== DELETE PARTY ========== //
function deleteParty(id) {
  console.log(id);


  let result = confirm("Do you want to delete this party?");
  if (result == true) {
    partyRef.doc(id).delete();
  }

}


//======== Add party member ======//


function updateSliderValue(index) {
  let slider = document.querySelector(`#character${index}Level`);
  let output = document.querySelector(`#slider${index}Value`);
  output.innerHTML = slider.value;

}


//====== SAVE TO SESSION STORAGE ======//
function saveSessionStorage() {
  let i = 0;
  let name = document.querySelector("#name").value;
  let level = document.querySelector(`#character${i}Level`).value;
  console.log(name);
  console.log(level);

  // store value in session storage
  sessionStorage.setItem("name", name);
  sessionStorage.setItem("level", level);
  // call loadFromStorage to update displayed values
  loadFromStorage();

  let sessionSavedName = sessionStorage.getItem("name");
  let sessionSavedLevel = sessionStorage.getItem("level");
  console.log("sessionSavedName", sessionSavedName);
  console.log("sessionSavedLevel", sessionSavedLevel);

  // set input field with email values from storage

  document.querySelector("#name").value = sessionSavedName;
  document.querySelector("`#character${i}Level`").value = sessionSavedLevel;

  // set span tags with email values from storage


}

loadFromStorage();





// =========== Encounter Builder functionality =========== //

/* TO-DO:
- ability to add monsters to encounter via session storage and display in summary
- ?
*/

// Creating the party's levels, and from there the amount of characters
// For now, a bootleg version of a party recieved from sessionStorage, aka. one I make.
function tempCreateParty() {
  let selectedParty = sessionStorage.getItem("selectedParty");
  if (selectedParty == null) {
    selectedParty = "The Mighty Nein";
    sessionStorage.setItem("selectedParty", selectedParty);
  }
  let selectedPartyLevels = JSON.parse(sessionStorage.getItem("selectedPartyLevels"));
  if (selectedPartyLevels == null) {
    selectedPartyLevels = [7, 7, 7, 7, 6, 6, 6];
    sessionStorage.setItem("selectedPartyLevels", JSON.stringify(selectedPartyLevels));
  }
}

// Append the party to the DOM
function appendPartyOnLoad() {
  // Get the values from session storage
  let selectedParty = sessionStorage.getItem("selectedParty");
  let selectedPartyLevels = JSON.parse(sessionStorage.getItem("selectedPartyLevels"));

  // Append the values
  document.querySelector("#builderPartyManager").innerHTML = selectedParty;
  document.querySelector("#builderPartyInfo").innerHTML = `
  ${selectedPartyLevels.length} Characters | Avg. Level: ${calcAvgLvl(selectedPartyLevels)}
  `;

  // Correct summary difficulty
  appendSummaryDifficulty();
}

// Easy reference to the '5e SRD monster' json link
let monsterJson = 'https://dl.dropboxusercontent.com/s/iwz112i0bxp2n4a/5e-SRD-Monsters.json'
// NOTE: monsters in Dungeons and Dragons all have unique names. Therefore, we can treat names as ids.

let monsters = [];

// load and append json monster data to the DOM
function loadMonsters() {
  // Load json
  fetch(monsterJson)
    .then(function(response) {
      return response.json();
    })
    .then(function(monstersArray) {
      // Save as global array
      monsters = monstersArray;
      console.log("Monsters Array: ", monsters);
      // Append to the DOM
      let htmlTemplate = "";
      for (let monster of monstersArray) {
        htmlTemplate += `
        <tr>
          <td><img src="img/monster-avatar.png"></td>
          <td>${monster.challenge_rating}</td>
          <td><span style="font-weight: bold;">${monster.name}</span><br>${monster.size} ${monster.type}</td>
          <td><button type="button" onclick="addToSummary('${monster.name}')">+</button></td>
        </tr>
        `;
      }
      document.querySelector("#monsterTable").innerHTML += htmlTemplate;

      // Also, call all other functions which needs to load; (helps to append on refresh)
      // Some of these functions rely on monsters to have finished loading before being called. therefore we called them from here instead of if (location.hash == '#builder').
      tempCreateParty();
      appendPartyOnLoad();
      appendSummary();
    });
}

// If refresh in #builder
if (location.hash == "#builder") {
  loadMonsters();
};

// Add monster to session storage
function addToSummary(monsterName) {
  // Load stored array and add monster
  let selectedMonsters = JSON.parse(sessionStorage.getItem("selectedMonsters"));
  if (selectedMonsters == null) {
    selectedMonsters = [];
    selectedMonsters.push(monsterName);
  } else {
    selectedMonsters.push(monsterName);
  };
  // Update array of to session storage
  // NOTE: session storage only supports strings. We use JSON.stringify() to turn our array into a string, and JSON.parse() it when we load the stringified array to turn it into an array.
  sessionStorage.setItem("selectedMonsters", JSON.stringify(selectedMonsters));

  // Append the summary
  appendSummary();
}

function deleteFromSummary(monsterName) {
  // Get array from session storage
  let selectedMonsters = JSON.parse(sessionStorage.getItem("selectedMonsters"));

  // Remove the first value equal to monsterName from the !!!BACK!!! of the array
  // If not from the back, monsters will skift up and down on delete
  console.log("about to delete ", monsterName);
  for (let i = selectedMonsters.length - 1; i >= 0; i--) {
    console.log("I swear i will do it!");
    if (selectedMonsters[i] == monsterName) {
      // Remove the item
      selectedMonsters.splice(i, 1);
      // Stop looping, as we don't want more to be deleted
      break;
    }
  }
  // Update array to session storage
  sessionStorage.setItem("selectedMonsters", JSON.stringify(selectedMonsters));

  // Append the summary
  appendSummary();
}

// Append the summary difficulty to the DOM
function appendSummaryDifficulty() {
  // Firstly, get all the values needed

  // Get array of levels from session storage
  let selectedPartyLevels = JSON.parse(sessionStorage.getItem("selectedPartyLevels"));

  // Returns an object with the different thresholds
  let thresholds = calcXpThreshold(selectedPartyLevels);

  // Returns Total XP
  let totalXp = calcTotalXp();

  // Determine the difficulty through threshold and totalXP
  let difficulty = "";
  if (totalXp >= thresholds.deadly) {
    difficulty = "Deadly";
  } else if (totalXp >= thresholds.hard) {
    difficulty = "Hard";
  } else if (totalXp >= thresholds.medium) {
    difficulty = "Medium";
  } else if (totalXp >= thresholds.easy) {
    difficulty = "Easy";
  } else if (totalXp == 0) { // If none selected
    difficulty = "None";
  } else { // If lower than easy
    difficulty = "Trivial";
  }

  let encounterModifier = calcEncounterMultiplier();

  let axp = totalXp * encounterModifier;

  let htmlTemplate = `
  <div>
    <p><b>Difficulty</b><br>${difficulty}</p>
    <p><b>Total XP</b><br>${totalXp} XP</p>
    <p><b>Adjusted XP (AXP)</b><br>${axp} XP (x${encounterModifier})</p>
  </div>
  <div>
    <p><b>Easy:</b> ${thresholds.easy} XP</p>
    <p><b>Medium:</b> ${thresholds.medium} XP</p>
    <p><b>Hard:</b> ${thresholds.hard} XP</p>
    <p><b>Deadly:</b> ${thresholds.deadly} XP</p>
    <p><b>Daily Budget:</b> ${thresholds.daily_budget} XP</p>
  </div>
  <div id="difficultyBar" style="width: 100%; height: 20px; background-color: #777777;">
    <div id="difficultyBarFill" style="width: 50%; height: 20px; background-color: #65B52F;"></div>
  </div>
  `;
  document.querySelector("#difficulty").innerHTML = htmlTemplate;
};

// Append the summary to the DOM
function appendSummary() {
  // Also, append the new diffuculty as well
  appendSummaryDifficulty();

  // Get array from session storage
  let selectedMonsters = JSON.parse(sessionStorage.getItem("selectedMonsters"));

  // Ready the table by clearing
  document.querySelector("#summaryTable").innerHTML = "";

  // Loop through selected monsters
  // But first check if anything to append, else error
  if (JSON.parse(selectedMonsters == null)) {
    console.log("No summary to append");
    return;
  } else {
    // Ready array to store appended Monsters
    let appendedMonsters = [];

    for (let selectedMonster of selectedMonsters) {
      // Get the index of selected monster from the global monster array
      let monsterIndex = monsters.findIndex(function(monsterObject) {
        return monsterObject.name == selectedMonster;
      });

      // "Custom" else to act as an else to the if in the for loop
      let customElse = true;
      // Loop to check if a similar monster was appended
      console.log("Different Monsters Appended", appendedMonsters);
      for (let appendedMonster of appendedMonsters) {
        if (selectedMonster == appendedMonster) {
          let counter = JSON.parse(document.querySelector(`#counter${monsterIndex}`).innerHTML);
          counter++;
          document.querySelector(`#counter${monsterIndex}`).innerHTML = counter;
          // If similar monster was appended, don't run the rest of the function.
          customElse = false;
        }
      }
      // Else of the if in for loop
      if (customElse == true) {
        // Else (since it won't run the "return") append as new monster
        // Append to the DOM with the given index
        document.querySelector("#summaryTable").innerHTML += `
        <tr>
          <td><img src="img/monster-avatar.png"></td>
          <td><b>${selectedMonster /* monsters[monsterIndex].name */}</b><br>${monsters[monsterIndex].size} ${monsters[monsterIndex].type}</td>
          <td>CR: ${monsters[monsterIndex].challenge_rating}<br>XP: ${calcXpFromCr(monsters[monsterIndex].challenge_rating)}</td>
          <td id="counter${monsterIndex}">1</td>
          <td><button type="button" onclick="addToSummary('${selectedMonster}')">+</button><br><button type="button" onclick="deleteFromSummary('${selectedMonster}')">-</button></td>
        </tr>
        `;
        // Only push to appendedMonsters if new monster
        appendedMonsters.push(selectedMonster);
      }
    }
  }
}

// =========== Encounter Builder: Calculators =========== //

// Calculation of the xp value for the 34 different challenge ratings, as XP is not given in the JSON. Say hello to if sentences.
function calcXpFromCr(CR /* Challenge Rating */ ) {
  if (CR == "0") {
    return 10;
  } else if (CR == "1/8") {
    return 25;
  } else if (CR == "1/4") {
    return 50;
  } else if (CR == "1/2") {
    return 100;
  } else if (CR == "1") {
    return 200;
  } else if (CR == "2") {
    return 450;
  } else if (CR == "3") {
    return 700;
  } else if (CR == "4") {
    return 1100;
  } else if (CR == "5") {
    return 1800;
  } else if (CR == "6") {
    return 2300;
  } else if (CR == "7") {
    return 2900;
  } else if (CR == "8") {
    return 3900;
  } else if (CR == "9") {
    return 5000;
  } else if (CR == "10") {
    return 5900;
  } else if (CR == "11") {
    return 7200;
  } else if (CR == "12") {
    return 8400;
  } else if (CR == "13") {
    return 10000;
  } else if (CR == "14") {
    return 11500;
  } else if (CR == "15") {
    return 13000;
  } else if (CR == "16") {
    return 15000;
  } else if (CR == "17") {
    return 18000;
  } else if (CR == "18") {
    return 20000;
  } else if (CR == "19") {
    return 22000;
  } else if (CR == "20") {
    return 25000;
  } else if (CR == "21") {
    return 33000;
  } else if (CR == "22") {
    return 41000;
  } else if (CR == "23") {
    return 50000;
  } else if (CR == "24") {
    return 62000;
  } else if (CR == "25") {
    return 75000;
  } else if (CR == "26") {
    return 90000;
  } else if (CR == "27") {
    return 105000;
  } else if (CR == "28") {
    return 120000;
  } else if (CR == "29") {
    return 135000;
  } else if (CR == "30") {
    return 155000;
  }
}

// Determine XP threshold for the array of characters, again say hello to if sentences...
// Returns an object of XP threshold ranging from easy to deadly plus daily budget
function calcXpThreshold(levelArray) {
  // Appearently NASA uses THOLD as the abbreviation for Threshold... Thanks abbreviations.com
  let easyThold = 0;
  let mediumThold = 0;
  let hardThold = 0;
  let deadlyThold = 0;
  let dailyThold = 0;
  // Loop through the levels and add values to Threshold variables
  for (let level of levelArray) {
    if (level == 1) {
      easyThold += 25;
      mediumThold += 50;
      hardThold += 75;
      deadlyThold += 100;
      dailyThold += 300;
      // Continue to skip this iteration of the rest of the loop and loop next instead
      continue;
    } else if (level == 2) {
      easyThold += 50;
      mediumThold += 100;
      hardThold += 150;
      deadlyThold += 200;
      dailyThold += 600;
      continue;
    } else if (level == 3) {
      easyThold += 75;
      mediumThold += 150;
      hardThold += 225;
      deadlyThold += 400;
      dailyThold += 1200;
      continue;
    } else if (level == 4) {
      easyThold += 125;
      mediumThold += 250;
      hardThold += 375;
      deadlyThold += 500;
      dailyThold += 1700;
      continue;
    } else if (level == 5) {
      easyThold += 250;
      mediumThold += 500;
      hardThold += 750;
      deadlyThold += 1100;
      dailyThold += 3500;
      continue;
    } else if (level == 6) {
      easyThold += 300;
      mediumThold += 600;
      hardThold += 900;
      deadlyThold += 1400;
      dailyThold += 4000;
      continue;
    } else if (level == 7) {
      easyThold += 350;
      mediumThold += 750;
      hardThold += 1100;
      deadlyThold += 1700;
      dailyThold += 5000;
      continue;
    } else if (level == 8) {
      easyThold += 450;
      mediumThold += 900;
      hardThold += 1400;
      deadlyThold += 2100;
      dailyThold += 6000;
      continue;
    } else if (level == 9) {
      easyThold += 550;
      mediumThold += 1100;
      hardThold += 1600;
      deadlyThold += 2400;
      dailyThold += 7500;
      continue;
    } else if (level == 10) {
      easyThold += 600;
      mediumThold += 1200;
      hardThold += 1900;
      deadlyThold += 2800;
      dailyThold += 9000;
      continue;
    } else if (level == 11) {
      easyThold += 800;
      mediumThold += 1600;
      hardThold += 2400;
      deadlyThold += 3600;
      dailyThold += 10500;
      continue;
    } else if (level == 12) {
      easyThold += 1000;
      mediumThold += 2000;
      hardThold += 3000;
      deadlyThold += 4500;
      dailyThold += 11500;
      continue;
    } else if (level == 13) {
      easyThold += 1100;
      mediumThold += 2200;
      hardThold += 3400;
      deadlyThold += 5100;
      dailyThold += 13500;
      continue;
    } else if (level == 14) {
      easyThold += 1250;
      mediumThold += 2500;
      hardThold += 3800;
      deadlyThold += 5700;
      dailyThold += 15000;
      continue;
    } else if (level == 15) {
      easyThold += 1400;
      mediumThold += 2800;
      hardThold += 4300;
      deadlyThold += 6400;
      dailyThold += 18000;
      continue;
    } else if (level == 16) {
      easyThold += 1600;
      mediumThold += 3200;
      hardThold += 4800;
      deadlyThold += 7200;
      dailyThold += 20000;
      continue;
    } else if (level == 17) {
      easyThold += 2000;
      mediumThold += 3900;
      hardThold += 5900;
      deadlyThold += 8800;
      dailyThold += 25000;
      continue;
    } else if (level == 18) {
      easyThold += 2100;
      mediumThold += 4200;
      hardThold += 6300;
      deadlyThold += 9500;
      dailyThold += 27000;
      continue;
    } else if (level == 19) {
      easyThold += 2400;
      mediumThold += 4900;
      hardThold += 7300;
      deadlyThold += 10900;
      dailyThold += 30000;
      continue;
    } else if (level == 20) {
      easyThold += 2800;
      mediumThold += 5700;
      hardThold += 8500;
      deadlyThold += 12700;
      dailyThold += 40000;
      continue;
    }
  }
  let xpThresholds = {
    easy: easyThold,
    medium: mediumThold,
    hard: hardThold,
    deadly: deadlyThold,
    daily_budget: dailyThold
  };
  return xpThresholds;
}

// Calculate the average level of the party
function calcAvgLvl(levelArray) {
  // Calculate the sum
  let sum = levelArray.reduce(function(total, num) {
    return total + num
  }, 0);
  // Calculate average level
  let average = sum / levelArray.length;
  // Return average level with 1 digit after the decimal point
  return average.toFixed(1);
}

// Calculate total XP of the encounter from selected monsters
function calcTotalXp() {
  let selectedMonsters = JSON.parse(sessionStorage.getItem("selectedMonsters"));
  let totalXp = 0;

  if (selectedMonsters == null) { //If no monsters chosen, there is no XP;
    return 0;
  } else {
    // Loop through and find the XP of the individual monsters
    for (let selectedMonster of selectedMonsters) {
      // Get the index of selected monster from the global monster array
      let monsterIndex = monsters.findIndex(function(monsterObject) {
        return monsterObject.name == selectedMonster;
      });

      totalXp += calcXpFromCr(monsters[monsterIndex].challenge_rating);
    };
  }

  return totalXp;
};

// Calculate Encounter Multiplier for Adjusted XP
function calcEncounterMultiplier() {
  let amountOfMonsters = JSON.parse(sessionStorage.getItem("selectedMonsters")).length;
  let amountOfCharacters = JSON.parse(sessionStorage.getItem("selectedPartyLevels")).length;

  if (amountOfMonsters == 1 || amountOfMonsters == 0) { // If 0, show value for 1 as well
    if (amountOfCharacters < 3) { // If 2 or fewer
      return 1.5;
    } else if (amountOfCharacters >= 3 && amountOfCharacters <= 5) { // If 3 to 5
      return 1;
    } else { // If 6 or more
      return 0.5;
    }
  } else if (amountOfMonsters == 2) {
    if (amountOfCharacters < 3) { // If 2 or fewer
      return 2;
    } else if (amountOfCharacters >= 3 && amountOfCharacters <= 5) { // If 3 to 5
      return 1.5;
    } else { // If 6 or more
      return 1;
    }
  } else if (amountOfMonsters >= 3 && amountOfMonsters <= 6) {
    if (amountOfCharacters < 3) { // If 2 or fewer
      return 2.5;
    } else if (amountOfCharacters >= 3 && amountOfCharacters <= 5) { // If 3 to 5
      return 2;
    } else { // If 6 or more
      return 1.5;
    }
  } else if (amountOfMonsters >= 7 && amountOfMonsters <= 10) {
    if (amountOfCharacters < 3) { // If 2 or fewer
      return 3;
    } else if (amountOfCharacters >= 3 && amountOfCharacters <= 5) { // If 3 to 5
      return 2.5;
    } else { // If 6 or more
      return 2;
    }
  } else if (amountOfMonsters >= 11 && amountOfMonsters <= 14) {
    if (amountOfCharacters < 3) { // If 2 or fewer
      return 4;
    } else if (amountOfCharacters >= 3 && amountOfCharacters <= 5) { // If 3 to 5
      return 3;
    } else { // If 6 or more
      return 2.5;
    }
  } else if (amountOfMonsters > 14) { // 15 or more;
    if (amountOfCharacters < 3) { // If 2 or fewer
      return 5;
    } else if (amountOfCharacters >= 3 && amountOfCharacters <= 5) { // If 3 to 5
      return 4;
    } else { // If 6 or more
      return 3;
    }
  }
};
