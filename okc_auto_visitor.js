/*
Code to "ping"/visit all OKC profiles at match percentage at or above 85%.
Current and working as of 2/12/2014
Inspired by http://www.wired.com/wiredscience/2014/01/how-to-hack-okcupid and the corresponding book, http://www.amazon.com/dp/B00HY351S2
By Lee Yanco (lyanco)
*/

//setup

var links = [];
var startNum = 0;
var killSwitch = 0;
var profcnt = 0;
console.log("To end window opening without closing the matches window, run stopOpening();");

//Comma separated list of usernames you do not want to visit
var blacklist = ["test1", "test2"];

if (document.URL.search("www.okcupid.com/match") === -1) {
	console.error("Error: Not on matches page.");
	throw new Error();
}

if (document.URL.search("matchOrderBy=MATCH") === -1) {
	console.error("Error: Order matches by match % before proceeding.");
	throw new Error();
}


//Main

var windowCheckInt = setInterval(function() {
	if (document.body.scrollTop + window.innerHeight != document.body.scrollHeight) {
		window.scrollTo(0,document.body.scrollHeight);
	}
	if (window.find('84% Match')) {
		clearInterval(windowCheckInt);
		setTimeout( function() {
			grabLinks();
			startOpening();
		}, 10000);
	}
}, 1000);

function grabLinks() {
	links = [];
	var profiles = document.getElementsByClassName('image_wrapper ajax_load_profile_link loaded');
	for (var i = 0; i < profiles.length; i++) {
		var profile_obj = {"href": profiles[i].href, "username": profiles[i].getAttribute("data-username")};
		links.push(profile_obj);
	}
	console.log(links);
}

function startOpening() {
	killSwitch = 0;
	profcnt = 0;
	visitLink(startNum);
}

function visitLink(num) {
	if (num < links.length && killSwitch === 0) {
		if (blacklist.indexOf(links[num].username) === -1) {
			var myWindow = window.open(links[num].href);
			if (myWindow) {
				profcnt++;
				myWindow.addEventListener("load" , function() {
					var rand = Math.random() * 2000;
					setTimeout(function() {
						myWindow.close();
						console.log("Closing " + num + ": " + links[num].username );
						var rand2 = Math.random() * 2000;
						setTimeout( function() {
							visitLink(++num);
						}, rand2);
					}, rand);
				}
				, false);
			}
		} else {
			console.log("Skipping " + num + ": " + links[num].username );
			visitLink(++num);
		}
	} else {
		startNum = num;
		console.log("Done. Visited " + profcnt + " profiles.");
	}
}


//Helpers

function stopOpening() {
	killSwitch = 1;
	console.warn("Manually ending opening of windows.");
	console.log("To continue where you left off, run startOpening();");
}

//Used to generate a blacklist of users who have messaged you
function grabMessagersUsernames() {
	if (document.URL.search("www.okcupid.com/messages") === -1) {
		console.error("Error: Not on messages page.");
	} else {
		var usernames = [];
		var messages = document.getElementsByClassName('subject');
		for (var i = 0; i < messages.length; i++) {
			usernames.push(messages[i].innerHTML);
		}
		console.log(JSON.stringify(usernames));
	}
}


