// Campus Canteen Order Calculator
// ITE-18 · Topic 1 — JavaScript Fundamentals activity

// Menu data: an array of objects, each with a name and a unit price.
const menu = [
  { name: "Rice meal", price: 50 },
  { name: "Chicken meal", price: 80 },
  { name: "Juice", price: 20 }
];

// One customer object holds both name and category, as required.
const customer = { name: "", category: "guest" };

let stopped = false; // flips to true on cancel or invalid input; skips the rest

// --- Step 1: get and validate the name ---
const rawName = prompt("Enter your name:");
if (rawName === null) {
  // Cancel at this prompt: stop with a cancellation message.
  alert("Order cancelled.");
  stopped = true;
} else {
  const trimmedName = rawName.trim(); // trim() strips leading/trailing spaces
  if (trimmedName === "") {
    // Blank name: stop with an error message.
    alert("Error: name cannot be blank.");
    stopped = true;
  } else {
    customer.name = trimmedName;
  }
}

// --- Step 2: get the category (only if step 1 succeeded) ---
if (!stopped) {
  const rawCategory = prompt("Enter category (student, staff, or guest):");
  if (rawCategory === null) {
    alert("Order cancelled.");
    stopped = true;
  } else {
    const cleanCategory = rawCategory.trim().toLowerCase();
    // switch decides the discount category; anything unrecognized (or blank) is guest
    switch (cleanCategory) {
      case "student":
        customer.category = "student";
        break;
      case "staff":
        customer.category = "staff";
        break;
      default:
        customer.category = "guest";
    }
  }
}

// --- Step 3: get a quantity for each menu item, in order ---
const quantities = []; // filled with push(), parallel to the menu array

if (!stopped) {
  for (let i = 0; i < menu.length; i++) {
    const rawQty = prompt(`Quantity for ${menu[i].name} (0-10):`);

    if (rawQty === null) {
      alert("Order cancelled.");
      stopped = true;
      break; // do not ask further questions after stopping
    }

    if (rawQty.trim() === "") {
      alert("Error: quantity cannot be blank.");
      stopped = true;
      break;
    }

    const qty = Number(rawQty);

    // Reject anything that is not a finite whole number from 0 to 10.
    if (!Number.isFinite(qty) || !Number.isInteger(qty) || qty < 0 || qty > 10) {
      alert("Error: invalid quantity.");
      stopped = true;
      break;
    }

    quantities.push(qty);
  }
}

// --- Step 4: calculate totals and show the receipt ---
if (!stopped) {
  let subtotal = 0;
  const lines = [];

  for (let i = 0; i < menu.length; i++) {
    const lineTotal = menu[i].price * quantities[i];
    subtotal += lineTotal;
    lines.push(`${menu[i].name} x${quantities[i]} = PHP ${lineTotal.toFixed(2)}`);
  }

  // Check whether every quantity came back zero.
  let allZero = true;
  for (let i = 0; i < quantities.length; i++) {
    if (quantities[i] !== 0) {
      allZero = false;
      break;
    }
  }

  if (allZero) {
    alert("No items ordered.");
    console.log("No items ordered.");
  } else {
    let rate = 0;
    if (customer.category === "student") {
      rate = 0.10;
    } else if (customer.category === "staff") {
      rate = 0.05;
    }
    // guest keeps rate at 0

    const discount = subtotal * rate;
    const total = subtotal - discount;

    const receipt =
      `Name: ${customer.name.toUpperCase()}\n` +
      `Category: ${customer.category}\n` +
      lines.join("\n") + "\n" +
      `Subtotal: PHP ${subtotal.toFixed(2)}\n` +
      `Discount: PHP ${discount.toFixed(2)}\n` +
      `Total: PHP ${total.toFixed(2)}`;

    alert(receipt);
    console.log(receipt);
  }
}