// popup.js

// document.getElementById("refresh").addEventListener("click", fetchWatchlistData);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'updateStockData') {
        const stockData = message.stockData;
        // console.log("inside the popup.js data : ",stockData);
        displayWatchlistData(stockData);
    }
});


function displayWatchlistData(stockData) {
    // const stockListContainer = document.getElementById("watchlist");
    const stockTableBody = document.querySelector('#stockTable tbody');
    stockTableBody.innerHTML = ''; // Clear the previous list

    // Loop through the stock data and display each stock's instrument and price
    for (const instrument in stockData) {
        const stock = stockData[instrument];
        // const stockElement = document.createElement('div');
        // stockElement.classList.add('stock-item');
        // stockElement.innerHTML = `<strong>${stock.instrument}</strong>: $${stock.price.toFixed(2)}`;
        // stockListContainer.appendChild(stockElement);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${stock.instrument}</td>
            <td>${stock.price.toFixed(2)}</td>
            <td>
                <button class="buyBtn" data-instrument="${stock.instrument}" data-price="${stock.price}">B</button>
                <button class="sellBtn" data-instrument="${stock.instrument}" data-price="${stock.price}">S</button>
            </td>
        `;
        stockTableBody.appendChild(row);

        const buyButton = row.querySelector('.buyBtn');
        const sellButton = row.querySelector('.sellBtn');

        buyButton.addEventListener('click', handleButtonClick);
        sellButton.addEventListener('click', handleButtonClick);
    }
}

function handleButtonClick(event) {
    const instrument = event.target.getAttribute('data-instrument');
    const price = event.target.getAttribute('data-price');
    
    // Log the instrument name and price to the console
    console.log(`${event.target.textContent} - Instrument: ${instrument}, Price: ${price}`);
}

function updateCurrentTime() {
    const currentTimeElement = document.getElementById('currentTime');
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    currentTimeElement.textContent = `Current Time: ${hours}:${minutes}:${seconds}`;
    // console.log(currentTimeElement);
}
setInterval(updateCurrentTime, 1000);
// Fetch data on popup open
// fetchWatchlistData();
