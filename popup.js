// this entire page gives functionality to the buttons

// lets initialize the buttons
let display = document.getElementById("display");
let resetWpm = document.getElementById("resetWpm");
let changeAnimal = document.getElementById("changeAnimal"); 

//listen for button clicks
display.addEventListener("click", async() => {
  if(display.innerText === "hide")
    display.innerText = "show";
  else
    display.innerText = "hide";
  let[tab] = await chrome.tabs.query({ active: true, currentWindow: true }); // surveys the tab in which we r working in
  console.log('click registered'); 
  chrome.scripting.executeScript({
    target: {tabId: tab.id},
    function: toggleDisplay
  }); // uses the tab as a target in which to create the port from. 
}); 
// you can see why I avoided the press & inject method & went with a content file. like when I tried it it could only execute one 
// function at a time. 
//I cant initialize the tab array as a constant variable bc extensions would like it to be in async functions only. which makes 
//sense bc then it would automatically reset itself on its own whilst the extension is running.
// the problem is we have to do it every single time within the event listeners. 

//more buttons
resetWpm.addEventListener("click", async() => {
  let[tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: {tabId: tab.id},
    function: setToZero
  });
});

changeAnimal.addEventListener("click", async() => {
  let[tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: {tabId: tab.id},
    function: switchBuds
  });
});

//repetative functions >:(
function toggleDisplay() {
let popport = chrome.runtime.connect({name:"popupButton"});
  console.log('togg display reached through button'); 
   popport.postMessage({status:"disClick"});
  popport.onMessage.addListener(function(msg) {
    if (msg.affirmation === "rodger that")
    {
      console.log('both ends recieved');
    }
  });
 }

function setToZero() {
  let popport = chrome.runtime.connect({name:"popupButton"});
  console.log('resetWpm reached through button');
  popport.postMessage({status:"rwpmClick"});
  popport.onMessage.addListener(function(msg) {
    if (msg.affirmation === "rodger that")
      console.log('both ends recieved');  
  });
}
function switchBuds() {
  let popport = chrome.runtime.connect({name:"popupButton"});
  console.log('changeAnimal reached through button')
  popport.postMessage({status:"changeAnimalClick"});
  popport.onMessage.addListener(function(msg){
    if(msg.affirmation === "rodger that")
    console.log('both ends recieved');
  });
}

// same kinda thing with the ports. the scope of the functions cannot allow for one universal port. Not sure why. but def a lot of ref errors. i'll include this approach just for you to see it and what I tried. 
// but if I had more time I would change this entire comm line to one time requests. 