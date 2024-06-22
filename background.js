//the usage of extensions api is strong in this one. basically everything i think

let isDisplayed = false;
let wpm = 0;
let animal = "keycat";
// intialize states

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ isDisplayed });
  chrome.storage.sync.set({ wpm });
  chrome.storage.sync.set({ animal });
  console.log('Default setting for the Display is set to false', `isDisplayed: ${isDisplayed}`);
  console.log('Default setting for wpm is set to 0', `wpm: ${wpm}`);
  console.log('Default setting for animal is set to keycat', `animal: ${animal}`);
});
// when the extension is installed we have default settings for each of the states. 
// i am utilizing chrome's built in storage. where we can just create global vars for this extension 
// it keeps track of current user preference. 

chrome.runtime.onConnect.addListener(function(port) {
  console.assert(port.name === "popupButton"); // this port is a long time two way connector between different parts of the extension
  port.onMessage.addListener(function(msg) {
    if (msg.status === "disClick") {
      console.log('display button got through to bg');
      if (isDisplayed)
        isDisplayed = false;
      else
        isDisplayed = true;
      chrome.storage.sync.set({ isDisplayed });
      console.log(`isDisplayed: ${isDisplayed}`);

    }
    else if (msg.status === 'rwpmClick') {
      console.log("rwpm got through to bg")
      wpm = 0;
      chrome.storage.sync.set({ wpm });
      console.log(`wpm: ${wpm}`)
    }
    else if (msg.status === 'changeAnimalClick') {
      console.log("cA got through to bg");
      if (animal === "keycat")
        animal = "keydog";
      else
        animal = "keycat";
      chrome.storage.sync.set({ animal });
      console.log(`animal: ${animal}`);
    }
    port.postMessage({ affirmation: "rodger that" });
  });
});
// communication between the popup and this page. When a button is clicked on the other side, it sends a message here and then 
// this script updates the storage accordingly. 
// with both one time requests and ports, you send message "objects?" with properties. Above the property being checked by this 
//onListener is the button "status" from the popup. 

chrome.storage.onChanged.addListener(function(changes, namespace) {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (newValue === true) {
        chrome.tabs.sendMessage(tabs[0].id, { ask: "turn display on" }, function(response) {
          console.log(response.farewell); // in order to establish a connection whist sending, each side must do something w/ the 
          // message: either send one back or other processing. The easiest thing to do here is just print for fun yknow. 
        });
        //when we display the animal. thats when the minute timer starts
        chrome.alarms.create('permin', {
          periodInMinutes: 1,
        });
      }
      else if (newValue === false) {
        chrome.tabs.sendMessage(tabs[0].id, { ask: "turn display off" }, function(response) {
          console.log(response.farewell); 
        });
        chrome.alarms.clear('permin');//^^ when we hide the animal, just terminate the active timer. 
        console.log('alarm cleared');
      }
      else if (newValue === "keydog" || newValue === "keycat") {
        chrome.tabs.sendMessage(tabs[0].id, { ask: "change animal" }, function(response) {
          console.log(response.farewell);
        });
      }
      else if (newValue === 0) {
        chrome.tabs.sendMessage(tabs[0].id, { ask: "reset count" }, function(response) {
          console.log(response.farewell);
        });
      }
    });
  }
});
// I thought this was cool & convenient feature of chrome's storage to use.
// For everytime something is being changed in storage, you can actually isolate that event and access the new and old values 
// of said change. What i did here was for each type of anticipated storage change I send a message from here to the extension's
// content script. (the actual code that is injected on the active page whlist the extension runs). Since I cant directly access 
// the popup buttons from content, this was an easy way to ensure everything remains contingent. 
 
chrome.alarms.onAlarm.addListener(() => {
  console.log('alarm sound off');
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    //^^ goes through current the open tabs
    chrome.tabs.sendMessage(tabs[0].id, { ask: "give me chars" }, function(response) {
      //^^ sends a message to tabs[0] the tab currently focused. 
      console.log(response.farewell); // on the other side should be the computed wpm. 
      wpm = response.farewell; // set it
      chrome.storage.sync.set({ wpm }); // update storage
      console.log(`wpm: ${wpm}`); // print check
    });
  });
});
//onAlarm listener: also very cool feature. When that timer goes off this piece of code runs

