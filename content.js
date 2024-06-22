//lets put my html/js knowlege to the test. 
console.log('content script go?'); // check if this page runs on the current tab automatically. 

// lets initialize everything we need 
let charNum = 0; // to keep track of number of characters
let anichoice = "keycat"; // keeps track of animal. look i could've sent this from the bg page but also,, thats an extra step. 
let startedCounting = false; // ensures counting() method only runs once. 
const myImage = document.createElement('img'); // keypet's physical form. 
const ctxt = document.createElement('small'); // the text that actually tells user their wpm. 

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.ask === "turn display on") {
      sendResponse({ farewell: "display bg -> content" });
      if (!startedCounting) {
        counting(); // explained in the read me but tldr: counting asynch function. Not sure how to turn off. 
        //it will thriple/quadruple increment bc functions are stacked on top of each other. 
        startedCounting = !startedCounting;// dont run it several times.  
      }
      display(); 
      reset(); // I thought since we cant turn off counting(). after hiding just redo the count when you show.
      // If the user hid the animal, they didn't want to track said activity period anyway. 
      console.log('went through canvas script & counting'); // print check for me
    }
    else if (request.ask === "turn display off") {
      sendResponse({ farewell: "turning it off" });
      hide();
    }
    else if (request.ask === "give me chars") {
      //^ this is the ask for when the timer goes off. 
      sendResponse({ farewell: calc() });
      readtxt = "" + calc(); // concatenation. 
      ctxt.innerText = "wpm: " + readtxt; // changing the html of the display wpm. 
      charNum = 0; //reset charcount every minute. 
    }
    else if (request.ask === "reset count") {
      reset(); // self explanantory 
      sendResponse({ farewell: "count resetted" });
    }
    else if (request.ask === "change animal") {
      abracadabra(); // magic magic animal change woosh. 
      sendResponse({ farewell: "switched" });
    }
  }
);
// okay actual nitty gritty. here is where all the calls from the bg go. I had it this way because I would rather have a whole 
// page that does things when told rather than injecting tiny snippets of code everytime a button presses.
// plus with a whole content script I have constant access to active tabs and have stagnant  + asynch functions. 
// I'm sure there is actually a proper way to link these three files together or even do everything without having to pass messages
// But hey again. my tip of the ice berg understanding came to this resolution. 

//LETS GO OVER FUNCTIONS!!

async function counting() {
//^^ i really should have named this counting + animating 
  var left = false; // for aesthetics I wanted alternating limbs simple check to switch everytime. 
  document.activeElement.addEventListener("keypress", function() {
  //^^ listens for keypresses. because I have no idea what elements a page would have, I just chose the one that is currently focused
    if (left)
      myImage.src = chrome.runtime.getURL('/' + anichoice + '/leftdown.png'); // initalizes the image on page to left paw
      // I used concatenation to alter the file path for each animal. I have folders of the images for each. 
    else
      myImage.src = chrome.runtime.getURL('/' + anichoice + '/rightdown.png'); // right paw
    left = !left; // switch!
    charNum = charNum + 1; // increment 
    console.log(charNum); // print check to make sure the counts were right
  });
  document.activeElement.addEventListener("keyup", function() {
  // ^^ same thing just for ups. 
    if (left)
      myImage.src = chrome.runtime.getURL('/' + anichoice + '/leftup.png');
    else
      myImage.src = chrome.runtime.getURL('/' + anichoice + '/rightup.png');
  });
}
// this is my solution to "animating". choppy but very simple because we don't need much. 


function display() {
// initializes & sets up the dimensions/position of the image 
  iurl = chrome.runtime.getURL('start.png'); // starting postion of animal
  myImage.src = iurl;
  ctxt.innerText = "wpm:"; 
  myImage.style = "position: fixed; left: 5px; bottom: 5px; height: 100px; width: 105px; border-radius: 5px;"; // placement & size
  ctxt.style = "position: fixed; left: 5px; bottom: 90px; color: #000000;"; // """ for text
  document.body.appendChild(myImage); // attach the elements I made to the active tab's HTML
  document.body.appendChild(ctxt);
}
function hide() {
  document.body.removeChild(myImage); // I can remove it the same way. 
  document.body.removeChild(ctxt);
}
function reset() {
  charNum = 0;
  ctxt.innerText = "wpm: 0";
}
function abracadabra() {
//if its one, change to the other. 
  if (anichoice === "keycat")
    anichoice = "keydog";
  else
    anichoice = "keycat";
}
function calc() {
  return charNum / 5;
}
