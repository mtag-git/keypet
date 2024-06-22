How to install: 
this works on chrome and chrome only.
1. click the puzzle piece in the top right of the browser
2. click manage extensions
3. turn on developer mode (top right)
4. click load unpacked
5. select keypet_Ext
6. bam it should be installed
actually running it:
1. open a tab, put an actual url in it chrome doesnt enable
extensions on the default landing page.
2. in a other tab have manage extensions open.
3. click "update" -> make sure the service worker isnt inactive
4. reload the tab you just made .
5. you're ready to use.
** warning functions while on active elements only!

hello this is a doc that i created just so that i can track progress/write down things that i have done/ need to do.

for the sake of transparency: 
this entire project I have referred to "Extensions" on the chrome developers page. 
It reads like a dictionary. Some of it is helpful but most of all it has been up to me to properly implement it and trouble shoot. I have been resisting using tutorials because hey, look at the amount of APIs im using. 

**List: storage, runtime, alarms, onMessage, tabs

I have not been using pure java bc chrome abandoned it a while ago. But I am ok with pushing forward with just js.

Most of the script in the background file utilizes chrome extension apis. 
Why: 
-> chrome keeps bg actions separate from the rest
-> within bg.js: chrome's apis have their own Listeners tailored to accessing elements of the browser itself.
ex) alarms, extension's installation, extension's runtime etc. the bg.js is where you will find it.

how extensions work: it is an add on to your browser at it stands. when invoked, the extension "injects" your code
as part of running the entire browser. thus "extending". bc of this, most functions must run asynchronusly.  
the nature of extensions is that each of your js files exist in "isolated worlds". hence the word "injects". 
your code runs but it isnt within a singular scope with the page you're on, unless you send messages to unite your files. 

making content 
-> isn't you modifying/rewriting the existing content of webpages. its more like youre adding on top.
overriding?? sometimes,,, not sure if the word quite fits.
-> like the actual webpage is behind a glass and you are just putting things on another layer. 

done:
week 1: 
the html & css of the entire project are the simplest parts which I got done v quickly bc it doesn't need to be pretty rn
The manifest file is literally the bare minumum to get things to work. There was a lot more that did not need to understand so
i am just using what I know how to use for now. learning curve to formatting and using the three languages in tandem again took a bit
figuring out how to pass Messages from popups -> bg -> content scripts. ** 

learning:
- msg ports have limited scope! if its not in a function then function doesn't know her. 
- you can store things in chrome. like the state of variables. user preference
- button clicks must run asynch??
*  stuff above the week one is included also ap tests dw, its over now.
*  there are a lot more moving parts than I anticipated. What if keycat becomes my project for the next 3 weeks?

week 2:

literally trying to do the message passing between
popup => bg => content is like sucking denim through a straw. 

 i know that these run in isolated worlds. the popup & bg scripts aren't supposed to know anything about the tab. Only the content script does, and passing messages with the correct tab enclosed is annoyiNG and inflexible. I cant even send the tab  to the background page + store it in a ref variable. or else it comes undef. 

 I am testing everything just through chrome's "manage extensions" with developer mode on (it isnt reliable half the time) . Its compiler catches type errors for you but most of the logic I have had to double check with printing, both through the bg script DevTools and the an actual google.com tab console itself. 

 ^^ I have 5 versions of my bg.js, all of different approaches to messaging, some with two ports others with one port, one with a content script, one using just the popup for all functionality. 
 that doesn't include all the ones I have scrapped that are overfilling my trash bin. 

week 3: (literally the lamest week but hey it was concert week aka rehearsals afterschool :P + I was stressed out of my mind)

figured out message passing,,, and what format to use:
- in order to establish a connection, you must send and recieve from both ends.
- even a one time request must be followed up by a msg response. which is common sense and I hate that it took me this long. 
popups -> bg script: a port sending which buttons user presses on the popup & then returning confirmation
bg script -> content script: one time requests, telling content what needs to execute & then content returns the information collected from the page after/during execution. 


aha I fixed alarms, if u wanna use things,,, DECLARE THEM IN THE MANIFEST PLEASE. like importing classes cmon. 

 
Week 4: 
keypresses and display 
bing boom now that the bg stuff & messaging is sorted(fairly) lets move on to the actual functionality part. 

For below, you need to figure out how to access the top frame / replace the top frame. *** active tab more like. 

work on keypress 
- if you cant listen for keypress events on the active tab then what is the way round that?
->figure out what elements on pages recieve inputs for key presses explicity
->if you could get it to work would you have it work for docs specifically?

***nvm,,, it worked. just listen through the content script bc the content script is the only one to have access to dom events anyways. i originally tried through the bg script for across the browser events but quickly found out that they dont have
keypress listeners across the entire browser for a good reason.

learned: 
keypress v.s. keydown -> one gets all types of presses  the other gets only the keys that produce a char value. 
sometimes the one time request cant establish a connection: i realized it was because I was switching in between tabs my 
google.com test tab and the manage extensions tab. One of which you cannot run extensions on. so i would get error messages saying 
that the connection didnt exist when the alarm goes off. (i.e. stay on the same page whilst keycat is running.)

I am trying to decide what induces more productivity... 
-> live raw wpm: goes up and down reflecting your current speed
   ~(# chars typed / 5) / (time elapsed from when keycat started counting)
-> Net wpm: static number that renews every minute. very stagnant. *** my current code reflects this method. 
  ~ after each minute just return # chars typed / 5. 

Week 5:
work on display
- would I have it work as like an overlay over the page? -> how to do that?
-  or insert a canvas into the html using js and alter the position/order of elements?
** I am ditching the canvas drawing idea. It's kinda extraneous. i found it would be easier to just load an <img> straight. 

learning: I am trying to figure out how to have elements exist on a top separate layer of the active tab. 
-> appendChild: i googled this not going to lie. What this did with my image was attach it to the bottom of the body of the 
active tab's html. Which gets it on the page but obviously not as an overlay.
-> removeChild: tis what I'll use to hide the animals. 

*** i used img tag style attribute to fix the image's size & absolute position which I gathered you can do through helping out 
with uyen's project. I originally thought eveything HAD to go in a stylesheet but bing bang now i can place the element over 
anything. 

something that is real hilarous: keycat isnt working on google docs. which,,, makes sense and kinda doesnt at the same time. 
Right now I have keyboard event listeners for the active tab. what I think is happening is when you type into a document on docs, 
the tab is a container for what ever entity the document is and for keycat to work he needs to listen more specifically upon the 
doc 
itself. which sucks. I can finish adding my features but to be honest I wanted it to work for docs the most because where else do 
most people need to remain productive whist composing? Lets see. 

^^^ went into an untitled doc, inspected the page trying to find flags: I found lots of div containers. but what stood out to me
was an iframe with class "docs-texteventtarget-iframe..."

how i was introduced to iframes was that you could use them to embed other websites within your own html so the user wouldn't have 
to open another tab to do so. 

I am guessing that the input is taken & computed through this iframe. a way around that is to have the event listeners go through 
the iframe itself. 

added functionality to the rest of the buttons. 

test test test the new additions
^^^ 
reset wpm was the easiest out of all of them. just set to zero.
showing and hiding keycat is a lot harder. 
mainly because i didn't separate each instance of a counter(keycat appearance). all of it is global. which is a bad program 
development move on my end. 
I was testing the hide/show feature and realized my charNum count went into the hundreds after a few keystrokes. + super high wpm 
prints for no reason. 
what was happening:
-> i ran many different asych functions because everytime I would "display" it would tell the content script to run counting(). 
-> Those functions would make a ton of listeners that would listen and increment charNum simultaniously, racking up the numbers.
-> how to fix??? aha not sure yet. ensure that there is only one instance of the counting method??? 
-> Have it run for the first time but not other times. easy. booleans

for switching animals i wanna see if a ref variable works + concatenation. cause it kinda works with calc().

Finals week (two days more like)

day 1:
ok hold on question would a while loop work with an async function? 
-> N OP E AHA google doesn't like that too much. Which is understanable. it rendered the page unresponsive. 
~ i used a boolean just to police running counting() more than once.
~is it really smart to leave it counting in the background? or have it check every single keypress that the animal is displayed?? not sure. but I don't know how to stop/start it. like we cant just delete the current function running. 

ahora por los animales. 
WORKS! concatenation everybody. but uh whats funny is that he keeps changing for no reason, 
logic error? 
times when it changes: 
each time we are given a new wpm
when we click the other buttons? 
on the second time we click when it goes from keydog -> keycat. 
storage changed might be doing all of them??? for some reason?? 
^^^ that doesnt make any sense. because if it were doing all of them,,, it would be activating the show/hide feature as well. 
^^^ just kidding,,, a pesky semicolon ruined it. its fixed now. 

day 2:
clean. please clean & test

something that doesn't work as intended: 
Whist keypet is in use, the minute timer keeps it awake. but when that timer is off (when keypet is hidden) the service worker 
unloads because it has been idle for a bit. which is what we wanted. BUT when I would try to press a button in order to get it 
back to an active state,, it doesn't execute it's intended call. but all of the data still changes. 

a fail safe I would say is after hiding keypet for a prolonged amount of time, click reset wpm before displaying. that way all of 
the data stays intact. 

tried to get it running on docs but still doesnt seem to be albe to listen for events even after i specifically focused on the 
acitve element.
-> tried getting the iframe mentioned earlier by its class name & just adding the listeners soley through that. 
-> still wasn't responsive. I have a feeling it is a bit more complicated than I think

if i had more time I would get on that ^^^ amongst other things:
small easter eggs
display animation
rewiring comms. the port idea is so ugly from popup -> bg I would change to one time requests but hey it was my first time. 






