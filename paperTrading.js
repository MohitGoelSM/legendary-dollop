let portfolio = []; // Portfolio to store { instrumentName, quantity, avgPrice }

// Function to handle buying or adding quantity
function addPosition(instrumentName, quantity, avgPrice) {
  // Check if the instrument already exists in the portfolio
  let instrument = portfolio.find(item => item.instrumentName === instrumentName);
  
  if (instrument && instrument.quantity>=0) { //already have some quantity
    // Update quantity and avgPrice when the instrument exists

    instrument.quantity += quantity;
    if (instrument.quantity > 0) {
      // Recalculate average price when the position is positive (long position)
      instrument.avgPrice = ((instrument.avgPrice * (instrument.quantity - quantity)) + (avgPrice * quantity)) / instrument.quantity;
    }
  }else if(instrument && instrument.quantity<0){
    // here i already short sell the instrument now i wanted to cover or add more +ve
    //like -100qty -> 0 or -100qty -> +20qty
    if(Math.abs(instrument.quantity)<quantity)
    {
        instrument.quantity+=quantity;
        instrument.avgPrice=avgPrice
    }
    else{
        //-100 to 0 or -100 -> -80
        instrument.quantity+=quantity;
    }

  }else {
    // Add new instrument to the portfolio if it doesn't exist
    portfolio.push({
      instrumentName,
      quantity,//add pnl for this instrument, total investment.
      avgPrice
    });
  }

  updateUI();
}

// Function to handle selling or reducing quantity (and going short if necessary)
function sellPosition(instrumentName, quantity,avgPrice) {
  // Find the instrument in the portfolio
  let instrument = portfolio.find(item => item.instrumentName === instrumentName);

  if (instrument && instrument.quantity <= 0) {
    //we already made position in past now we again wanted to make short position into it
    instrument.quantity-=quantity;
    instrument.avgPrice = ((instrument.avgPrice * Math.abs(instrument.quantity + quantity)) + (avgPrice * quantity)) / Math.abs(instrument.quantity);
  }
  else if (instrument && instrument.quantity >0) {
    //we have some +ve quantity and we want to sell 
    instrument.quantity -= quantity;
    if(instrument.quantity<0)
    {
        instrument.avgPrice=avgPrice;
    }
    console.log(`Sold ${quantity} of ${instrumentName} at average price ${instrument.avgPrice}`);
  } else {
    // Case 2: Sell more than the available quantity (go short)
    // First, sell all of the existing quantity
    
    portfolio.push({
      instrumentName,
      quantity: -quantity,  // Negative quantity indicates short position
      avgPrice: avgPrice // The average price remains the same for the short
    });
    console.log(`Short sold ${shortQuantity} of ${instrumentName} at price ${instrument.avgPrice}`);
  }

  updateUI();
}

// Function to update UI (console log for now)
function updateUI() {
  console.log("Portfolio:", portfolio);
}

// Example Usage:

// Step 1: Buy 100 units of XYZ at ₹50
addPosition("XYZ", 100, 50); 

// Step 2: Sell 150 units of XYZ (this will sell all 100 and short 50)
sellPosition("XYZ", 150,70);

// Step 3: Sell 50 units of XYZ again (this will be a further short position)
sellPosition("XYZ", 50,80);

addPosition("XYZ",100,75);

sellPosition("XYZ",200,50);
