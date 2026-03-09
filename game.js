/* ======================================================
   CLOTHING BUDGET GAME
   One JS file handles BOTH pages
====================================================== */

/* ---------------- GLOBAL STATE ---------------- */


// Exact placement anchors for mannequin layers
const layerAnchors = {
  top: {
    top: 5,
    width: 400,
    height:250
  },
  bottom: {
    top: 270,
    width: 400,
    height: 250
  }
};
// Controls visual stacking order
const layerOrder = {

  bottom:1,
  top: 2,

};
// Vertical positioning for each clothing category
const layerOffsets = {
  top: 0,        // shirts stay normal
    // move pants down (adjust this number)
  shoes: 140,
  outerwear: 0,
  accessory: -20
};

const budgets = [70, 90, 120, 150,180,220];

let budget = 0;
let spinning = false;
let totalSpent = 0;

let selectedItems = {};     // { category : itemData }
let currentColors = [];     // color index per clothing item


/* ---------------- CLOTHING DATA ---------------- */

const clothingItems = [
{
  name: "Basic Pick: Tops",
  category: "top",
  price: 35,
  width: 360,
  height: 230,
  images: ["images/Budget_Pick/budget_pick1.png","images/Budget_Pick/budget_pick2.png","images/Budget_Pick/budget_pick3.png"]
},
{
  name: "Standard: Tops",
  category: "top",
  price: 65,
   yOffset: -20,
  images: ["images/Smart_Pick/smart_choice1.png","images/Smart_Pick/smart_choice2.png","images/Smart_Pick/smart_choice3.png"]
},
{
  name: "Luxury Choice: Tops",
  category: "top",
   yOffset: -8,
  price: 110,
  images: ["images/Luxury_Pick/luxury_pick1.png","images/Luxury_Pick/luxury_pick2.png","images/Luxury_Pick/luxury_pick3.png"]
},
{
  name: "Basic Pick: Bottoms",
  category: "bottom",
  price: 35,
  images: ["images/Budget_Pick/budget_pants1.png","images/Budget_Pick/budget_pants2.png","images/Budget_Pick/budget_pants3.png"]
}
,
{
  name: "Standard Choice: Bottoms",
  category: "bottom",
  price: 65,
  images: ["images/Smart_Pick/smart_pants1.png","images/Smart_Pick/smart_pants2.png","images/Smart_Pick/smart_pants3.png"]
}
,
{
  name: "Luxury Pick: Bottoms",
  category: "bottom",
  price: 110,
  images: ["images/Luxury_Pick/luxury_pants1.png","images/Luxury_Pick/luxury_pants2.png","images/Luxury_Pick/luxury_pants3.png"]
}
];


/* ======================================================
   PAGE DETECTION
====================================================== */

document.addEventListener("DOMContentLoaded", () => {

  // Wheel page
  if (document.getElementById("wheel")) {
    document.fonts.ready.then(initWheel);
    initWheel();
  }

  // Game page
  if (document.getElementById("itemsContainer")) {
    initGame();
  }

});



/* ======================================================
   WHEEL PAGE LOGIC
====================================================== */

function initWheel() {

  const wheel = document.getElementById("wheel");
  const spinBtn = document.getElementById("spinBtn");

  const budgets = [70, 220, 90, 180, 120, 150];
  const segments = budgets.length;
  const segmentAngle = 360 / segments;

  let currentRotation = 0;
  let spinning = false;

  spinBtn.onclick = function () {

    if (spinning) return;
    spinning = true;

    const selectedIndex = Math.floor(Math.random() * segments);
    const selectedBudget = budgets[selectedIndex];

    const rotationToSlice = (selectedIndex * segmentAngle) + (segmentAngle / 2);
    const totalRotations = 5;

    const finalRotation =
      currentRotation +
      (totalRotations * 360) +
      (360 - rotationToSlice);

    wheel.style.transition = "transform 5s ease-out";
    wheel.style.transform = `rotate(${finalRotation}deg)`;

    currentRotation = finalRotation % 360;

    setTimeout(() => {

      document.getElementById("budgetDisplay").innerText =
        "Your Budget: $" + selectedBudget;

      document.getElementById("startGameBtn").style.display = "inline-block";

      localStorage.setItem("budget", selectedBudget);

      spinning = false;

    }, 5000);
  };
}


function pointerBounce() {
  const pointer = document.getElementById('stopper');
  pointer.style.transform = 'translateX(-50%) translateY(-10px)';
  setTimeout(() => {
    pointer.style.transform = 'translateX(-50%) translateY(0)';
  }, 100);
}

function launchConfetti() {
  const confettiContainer = document.createElement('div');
  confettiContainer.style.position = 'fixed';
  confettiContainer.style.top = 0;
  confettiContainer.style.left = 0;
  confettiContainer.style.width = '100%';
  confettiContainer.style.height = '100%';
  confettiContainer.style.pointerEvents = 'none';
  document.body.appendChild(confettiContainer);

  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'absolute';
    confetti.style.width = '8px';
    confetti.style.height = '8px';
    confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 80%, 60%)`;
    confetti.style.top = '0px';
    confetti.style.left = `${Math.random() * window.innerWidth}px`;
    confetti.style.opacity = 1;
    confetti.style.transform = `rotate(${Math.random()*360}deg)`;
    confettiContainer.appendChild(confetti);

    const fall = confetti.animate([
      { transform: `translateY(0px) rotate(${Math.random()*360}deg)`, opacity: 1 },
      { transform: `translateY(${window.innerHeight + 100}px) rotate(${Math.random()*720}deg)`, opacity: 0 }
    ], {
      duration: 2000 + Math.random() * 1000,
      easing: 'ease-out',
      iterations: 1
    });

    fall.onfinish = () => confetti.remove();
  }

  setTimeout(() => confettiContainer.remove(), 3000);
}



function startGame() {

  const savedBudget = localStorage.getItem("budget");

  if (!savedBudget) {
    alert("Spin first!");
    return;
  }

  window.location.href = "game.html";
}


/* ======================================================
   GAME PAGE LOGIC
====================================================== */



/* ---------------- RACK RENDER ---------------- */

function renderRack() {

  const container = document.getElementById("itemsContainer");
  container.innerHTML = "";

  clothingItems.forEach((item, i) => {

    const div = document.createElement("div");
    div.className = "item";

    div.innerHTML = `
      <button class="arrow left"
        onclick="prevColor(${i}, event)">&#8592;</button>

      <img src="${item.images[currentColors[i]]}"
           width="60"
           id="img-${i}">

      <button class="arrow right"
        onclick="nextColor(${i}, event)">&#8594;</button>

      <br>${item.name}<br>$${item.price}
    `;

    div.onclick = () => selectItem(i);

    container.appendChild(div);
  });
}


/* ---------------- COLOR CYCLING ---------------- */

function nextColor(index, event) {
  event.stopPropagation();

  const item = clothingItems[index];

  currentColors[index] =
    (currentColors[index] + 1) % item.images.length;

  document.getElementById("img-"+index).src =
    item.images[currentColors[index]];
}

function prevColor(index, event) {
  event.stopPropagation();

  const item = clothingItems[index];

  currentColors[index] =
    (currentColors[index] - 1 + item.images.length)
    % item.images.length;

  document.getElementById("img-"+index).src =
    item.images[currentColors[index]];
}


/* ---------------- SELECT CLOTHING ---------------- */

function selectItem(index) {

const rackItem =
  document.getElementById("img-" + index);

rackItem.classList.add("pop");

setTimeout(() =>
  rackItem.classList.remove("pop"), 250);

  const item = clothingItems[index];
  const category = item.category;

  // remove previous category item
  if (selectedItems[category]) {

    totalSpent -= selectedItems[category].price;

    const oldLayer =
      document.getElementById("layer-" + category);

    if (oldLayer) oldLayer.remove();
  }

  selectedItems[category] = {
    ...item,
    colorIndex: currentColors[index]
  };

  totalSpent += item.price;

  const mannequinLayer =
    document.getElementById("mannequinLayer");

// Remove old slot if exists
const oldLayer = document.getElementById("layer-" + category);
if (oldLayer) oldLayer.remove();

const anchor = layerAnchors[item.category];

// ---------- SLOT ----------
const slot = document.createElement("div");
slot.id = "layer-" + item.category;
slot.style.position = "absolute";
slot.style.left = "50%";
slot.style.transform = "translateX(-50%)";
slot.style.top = anchor.top + "px";
slot.style.width = anchor.width + "px";
slot.style.height = anchor.height + "px";
slot.style.zIndex = layerOrder[item.category] || 1;
slot.style.pointerEvents = "none";

// ---------- IMAGE ----------
const img = document.createElement("img");
img.src = item.images[currentColors[index]];

img.style.width = "100%";
img.style.height = "100%";
img.style.objectFit = "contain";

// ⭐ MISSING LINE
slot.appendChild(img);

slot.classList.add("clothing-drop");
mannequinLayer.appendChild(slot);


  updateTotal();
}


/* ---------------- UI UPDATES ---------------- */

function updateTotal() {

  const totalDisplay =
    document.getElementById("totalSpent");

  totalDisplay.innerText = totalSpent;

if (totalSpent > budget) {
  totalDisplay.style.color = "red";
  totalDisplay.classList.add("budget-shake");

  setTimeout(() =>
    totalDisplay.classList.remove("budget-shake"), 400);
} else {
  totalDisplay.style.color = "black";
}
}


/* ---------------- SUBMIT ---------------- */

function submitOutfit() {

  const drawer = document.getElementById("drawer");

  if (totalSpent === 0) {
    alert("Put clothes on first!");
    return;
  }

  if (totalSpent <= budget) {
    drawer.classList.remove("locked");
    drawer.classList.add("unlocked");
    drawer.innerText = "🗄️ Drawer Unlocked! Code: 371";
    launchConfetti();
  } else {
    alert("Over budget!");
  }
}


/* ---------------- RESET ---------------- */

function resetOutfit() {

  selectedItems = {};
  totalSpent = 0;

  document.getElementById("mannequinLayer").innerHTML = "";

  currentColors = clothingItems.map(() => 0);

  renderRack();
  updateTotal();

  const drawer = document.getElementById("drawer");
  drawer.className = "locked";
  drawer.innerText = "🔒 Locked Drawer";
}

function initGame() {
  const savedBudget = localStorage.getItem("budget");

  if (!savedBudget) {
    alert("Spin the wheel first!");
    window.location.href = "index.html";
    return;
  }

  budget = parseInt(savedBudget);
  document.getElementById("budget").innerText = budget;

  currentColors = clothingItems.map(() => 0);

  renderRack();
  updateTotal();

  // --------- Disable submit for 1 minute ----------
  const submitBtn = document.getElementById("submitBtn");
  if (submitBtn) {
    submitBtn.disabled = true; // prevent clicks
    submitBtn.innerText = "Wait 30 seconds..."; // show countdown text

    let timeLeft = 30;
    const timer = setInterval(() => {
      timeLeft--;
      submitBtn.innerText = `Wait ${timeLeft} seconds...`;
      if (timeLeft <= 0) {
        clearInterval(timer);
        submitBtn.disabled = false;
        submitBtn.innerText = "Submit Outfit";
      }
    }, 1000);
  }
}

function backToWheel() {
  // Clear saved budget
  localStorage.removeItem("budget");

  // Optional: reset selected items
  resetOutfit();

  // Go back to wheel page
  window.location.href = "wheel.html";
}

