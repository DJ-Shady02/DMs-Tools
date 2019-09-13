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
var firebaseConfig = {
 apiKey: "AIzaSyD8hDricLqN06iKIlKq_s3EkWa-L6ghg1o",
 authDomain: "dm-s-tools-examen.firebaseapp.com",
 databaseURL: "https://dm-s-tools-examen.firebaseio.com/",
 projectId: "dm-s-tools-examen",
 storageBucket: "",
 messagingSenderId: "1024990819908",
 appId: "1:1024990819908:web:8df40e3b4b10f08dbeee11"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//Make auth and firestore references
const auth = firebase.auth();
const db = firebase.firestore();
db.settings({experimentalForceLongPolling:true});
