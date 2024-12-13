// // content.js

// // Function to extract stock data from the watchlist
// function getWatchlistData() {
//     const stockElements = document.querySelectorAll("vddl-draggable instrument up index19"); // Replace with actual class names from Kite's DOM
//     console.log(stockElements,"stock Element");
//     const watchlistData = [];

//     stockElements.forEach((element) => {
//         const name = element.querySelector(".stock-name").innerText; // Adjust selector
//         const price = element.querySelector(".stock-price").innerText; // Adjust selector
//         const change = element.querySelector(".stock-change").innerText; // Adjust selector

//         watchlistData.push({ name, price, change });
//     });

//     return watchlistData;
// }

// const observer = new MutationObserver((mutations) =>
//     {
//     const stockContainer = document.querySelector('#app > div.container.wrapper > div.container-left > div > div.instruments > div'); // Update this selector
//     console.log(stockContainer,"stockContainer",stockContainer.className);
//     const stockData=[];
//     if (stockContainer && !stockContainer.classList.contains('loading-bar')) {
//         try
//         {
//             const stockElements=stockContainer.querySelectorAll('.vddl-draggable.instrument');
//             stockElements.forEach((element) => {
//                 console.log("element",element);
//                 let temp_nameElement= element.cloneNode(true);
//                 let temp_priceElement = element.cloneNode(true);
//                 const nameElement = temp_nameElement.querySelector('.nice-name')?.textContent.trim();
//                 const priceElement = temp_priceElement.querySelector('.last-price')?.textContent.trim;
//                 console.log("name,price element",nameElement,priceElement,element.querySelector('.last-price'))
//                 // Check if both elements are found
//                 if (nameElement && priceElement) {
//                     const instrumentName = nameElement.textContent.trim();
//                     const lastPrice = priceElement.textContent.trim();

//                     const stockObject = {
//                         instrument: instrumentName,
//                         price: parseFloat(lastPrice.replace(',', '')) // Convert to a number
//                     };
//                     console.log("stock object",stockObject);
//                     stockData.push(stockObject);
//                 } else {
//                     // console.warn('Element not found for:', element);
//                 }
//             });
//             // console.log("stock container/element/data is loaded.",stockContainer,stockElements,stockData);
//         }
//         catch(ex){
//             console.log(ex);
//         }
//         finally{
//             console.log("finally disconnected");
//             observer.disconnect(); // Stop observing once the table is found
//         }
//     }
// });

// observer.observe(document.body, { childList: true, subtree: true });

// // Send data to background script
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.action === "getWatchlistData") {
//         const data = getWatchlistData();
//         sendResponse({ data });
//     }
// });

// content.js

// Function to check if the button is available in the DOM
const processedButtons = new Set();

function addClickListener(button, label) {
  if (!processedButtons.has(button)) {
    button.addEventListener("click", () => {
      console.log(`${label} button clicked`);

      // Wait for the form (popup) to appear after button click
      setTimeout(() => {
        // Find the form after the button click (Buy/Sell popup)
        const orderWindow = document.querySelector(
          'form[data-drag-boundary="true"][role="dialog"]'
        );

        if (orderWindow) {
          // Add the custom button based on whether it's a Buy or Sell form
          addCustomButtonToPopup(orderWindow, label);
        }
      }, 200); // Adjust the delay if needed
    });
    processedButtons.add(button); // Mark the button as processed
  }
}

function addCustomButtonToPopup(form, action) {
  // Remove any previously added custom buttons
  removeCustomButtons(form);

  // Check if the form is a "Buy" form or "Sell" form based on the class
  const isBuyPopup = form.classList.contains("buy");
  const isSellPopup = form.classList.contains("sell");

  // Find the submit button inside the form (which is the Buy/Sell button in the form)
  const submitButton = form.querySelector("button.submit");

  if (submitButton) {
    // Create the custom button to add to the popup
    let customButton = document.createElement("button");
    customButton.type = "button";
    customButton.classList.add("custom-action-button");

    // Assign text and color based on the popup type
    if (isBuyPopup) {
      customButton.textContent = "B";
      customButton.style.backgroundColor = "yellow"; // Yellow for Buy
    } else if (isSellPopup) {
      customButton.textContent = "S";
      customButton.style.backgroundColor = "red"; // Red for Sell
    }
    customButton.style.marginRight = "6px";
    customButton.addEventListener("click", () => {
      // Fetch and log the instrument, qty, price, and action (B or S)
      logFormData(form, action);
    });
    // Add the custom button next to the submit button
    submitButton.insertAdjacentElement("beforebegin", customButton);
  }
}

function logFormData(form, action) {
  // Extracting instrument name
  console.log("inside the logFormData",form)
  const instrumentName = document
    .querySelector(".tradingsymbol .name")
    .textContent.trim();

  // Extracting current price
  const currentPrice = document
    .querySelector(".exchange-selector .last-price")
    .textContent.trim();

  // Extracting minimum quantity and quantity (from the 'input' field with id 'u0el8j9any')
  const quantityInput = document.querySelector('.quantity input[type="number"]');
  const minimumQuantity = quantityInput.getAttribute("min");
  const quantity = quantityInput.value; // This will give the current value (if set)

  // Extracting margin
  const margin = document.querySelector(".block .value").textContent.trim();

  // Log the collected data
  console.log(
    `Instrument : ${instrumentName}, Quantity : ${quantity}, MinimumQTY : ${minimumQuantity} , Price : ${currentPrice}, Action : ${action} , MarginRequired : ${margin} `
  );
}

// // Function to add event listener to a button
// function addClickListener(button, label) {
//   if (!processedButtons.has(button)) {
//     button.addEventListener('click', () => {
//       console.log(`${label} button clicked`);
//     });
//     processedButtons.add(button);  // Mark the button as processed
//   }
// }

// Function to remove any previously added custom buttons
function removeCustomButtons(form) {
  const customButtons = form.querySelectorAll(".custom-action-button");
  customButtons.forEach((button) => {
    button.remove();
  });
}

// Function to check if the buttons are available in the DOM
function checkButtons() {
  // Find all the buttons
  const sellButtons = document.querySelectorAll("button.button-orange.sell");
  const buyButtons = document.querySelectorAll("button.button-blue.buy");

  // Add event listeners to all sell buttons if not already done
  sellButtons.forEach((button) => addClickListener(button, "Sell"));

  // Add event listeners to all buy buttons if not already done
  buyButtons.forEach((button) => addClickListener(button, "Buy"));
}

// Observe DOM for changes (in case buttons are added dynamically)
const observer = new MutationObserver(checkButtons);
observer.observe(document.body, { childList: true, subtree: true });

// Initial check to handle the case where buttons are already in the DOM
checkButtons();

function getCurrentTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0"); // Format hours as 2 digits
  const minutes = String(now.getMinutes()).padStart(2, "0"); // Format minutes as 2 digits
  const seconds = String(now.getSeconds()).padStart(2, "0"); // Format seconds as 2 digits
  return `${hours}:${minutes}:${seconds}`;
}

const stockData = []; // Initialize the array to hold stock data
const stockDataMap = {};
function fetchStockData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      const stockContainer = document.querySelector(".vddl-list.list-flat");
      // console.log('stockContainer',stockContainer);
      if (stockContainer) {
        const stockElements = stockContainer.querySelectorAll(
          ".vddl-draggable.instrument"
        );

        // Process each stock element
        stockElements.forEach((element) => {
          const nameElement = element.querySelector(".nice-name");
          const priceElement = element.querySelector(".last-price");
          // console.log("name,price",nameElement,priceElement);
          if (nameElement && priceElement) {
            const instrumentName = nameElement.textContent.trim();
            const lastPrice = priceElement.textContent.trim();

            // Convert the price to a number (removes commas)
            const price = parseFloat(lastPrice.replace(",", ""));

            // If the stock already exists in the map, just update the price
            if (stockDataMap[instrumentName]) {
              stockDataMap[instrumentName].price = price;
            } else {
              // If it's a new stock, add it to the map
              stockDataMap[instrumentName] = {
                instrument: instrumentName,
                price: price,
              };
            }
          }
        });
      }

      resolve(stockDataMap); // Resolve the promise with the stock data
    }, 1000); // Adjust the delay as needed
  });
}

// Execute the fetch and log the data
// fetchStockData().then(data => {
//     console.log(data);
// });

// Function to keep fetching data every second
function startFetchingData() {
  // Call fetchStockData every second
  setInterval(() => {
    fetchStockData().then((data) => {
      const currentTime = getCurrentTime(); // Get the current time
      // console.log(`[${currentTime}] Fetched stock data:`, data);
      // You can now send this data to the background script or update the UI here
      // For example, send data to background script or update UI in real-time.
      chrome.runtime.sendMessage({
        action: "updateStockData",
        stockData: data,
      });
    });
  }, 1000); // Fetch data every 1000 ms (1 second)
}

// Start fetching stock data when the script runs
startFetchingData();
