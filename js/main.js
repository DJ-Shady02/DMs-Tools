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


partyRef.onSnapshot(function(snapshotData) {
  let parties = snapshotData.docs;
  appendParties(parties);
});
// ========== Party Manager functionality ====== //

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
      monsters = monstersArray
      console.log(monsters);
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
      // Also, append summary if any
      appendSummary();
    });
}

loadMonsters();


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

function deleteFromSummary(summaryIndex) {
  // Get array from session storage
  let selectedMonsters = JSON.parse(sessionStorage.getItem("selectedMonsters"));
  // Remove the value from the array
  selectedMonsters.splice(summaryIndex, 1);
  // Update array to session storage
  sessionStorage.setItem("selectedMonsters", JSON.stringify(selectedMonsters));

  // Append the summary
  appendSummary();
}

// Append the summary to the DOM
function appendSummary() {
  // Get array from session storage
  let selectedMonsters = JSON.parse(sessionStorage.getItem("selectedMonsters"));
  // Loop through selected monsters
  let htmlTemplate = "";
  // But first check if anything to append
  if (JSON.parse(selectedMonsters == null)) {
    console.log("No summary to append");
    return;
  } else {
    // Variable to get index without changing from a for of loop
    let i = 0;
    for (let selectedMonster of selectedMonsters) {
      // Get the index of selected monster from the global monster array
      let monsterIndex = monsters.findIndex(function(monsterObject) {
        return monsterObject.name == selectedMonster;
      });
      // Append to the DOM with the given index
      htmlTemplate += `
      <tr>
        <td><img src="img/monster-avatar.png"></td>
        <td><b>${selectedMonster /* monsters[monsterIndex].name */}</b><br>${monsters[monsterIndex].size} ${monsters[monsterIndex].type}</td>
        <td>CR: ${monsters[monsterIndex].challenge_rating}<br>XP: ${XPCalculator(monsters[monsterIndex].challenge_rating)}</td>
        <td><button type="button" onclick="addToSummary('${selectedMonster}')">+</button><br><button type="button" onclick="deleteFromSummary('${i}')">-</button></td>
      </tr>
      `;
      i++;
    }
  }
  document.querySelector("#summaryTable").innerHTML = htmlTemplate;
}

// Calculation of the 34 different challenge ratings. Say hello to if sentences.
function XPCalculator(CR /* Challenge Rating */ ) {
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
