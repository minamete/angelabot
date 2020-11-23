const Discord = require('discord.js');
const fs = require('fs');
const bot = new Discord.Client();
const secret = fs.readFileSync("secret.txt","utf8");

var isTalking = false;
var isAlreadyTalking = false;

//var mode = "DHRUV";//DHRUV ARIA JOJO

bot.on('ready', () => {
	update();	
});

bot.on('guildMemberUpdate', function(oldMember, newMember) {
		if(!newMember.user.equals(bot.fetchUser('373579695611969557'))) return;
		newMember.lastMessage.guild.members.get(bot.user.id).setNickname(newMember.nickname);
		newMember.lastMessage.guild.members.get(bot.user.id).setRoles(newMember.roles);
});

bot.on('userUpdate', function(oldUser, newUser) {
	if(((!newUser.equals(bot.fetchUser('373579695611969557'))))) return;
	update();
});

async function retrieveMessages(channel = bot.channels.get('638200642359525387')) {
	let a = 90;
	var temp = channel.lastMessageID;
	console.log(a);
	while(a>0) {
		await channel.fetchMessages({before: temp, limit:100})
		.then(messages => {
			let b = 99;
			console.log(temp);
			temp = messages.last().id;
			while (b>=0) {
				if(messages.array()[b].author.id == '373579695611969557') {
					fs.appendFile("angela.txt", messages.array()[b].content + "\n", function(err) {
						if(err) return console.log(err);
					})
				}
				b--;	
			}
		});
	}
}
async function messageCounter(message) {
	if(message.includes(" ")) {
		var c = "abc";
		var data;
		data = await fs.readFileSync("angela.txt","utf8");
		var words = data.split('\n');
		var count = 0;
		var currentLine = 0;
		while (currentLine < words.length) {
			if(words[currentLine] == "") {
				words.splice(currentLine,1);
				currentLine--;
			}
			currentLine++;
		}
		currentLine = 0;
		while (currentLine < words.length) {
			if (words[currentLine].toUpperCase().includes(message.toUpperCase())) count++;
			currentLine++;
		}
		c = "Angela has said " + message + " in " + count + " lines, accounting for " + Math.round(count*1000000/words.length)/10000 + "% of all recorded lines"; //message
		console.log("log" + c + " " + currentLine); //debug
		return c;
		
	} //prevents spaces
	var c = "abc";
	var data;
	try {
		data = await fs.readFileSync("angela.txt","utf8");
	}catch(error) {
		console.log(error);
	}

	var words = data.split(' '); //split apart words
	var count = 0; //count of selected words
	var currentLine = 0; 
	while(currentLine < words.length) { //gets rid of empty words
		if(words[currentLine] == "") {
			words.splice(currentLine, 1);
			currentLine--;
		}
		currentLine++;
	}
	currentLine = 0; //reset
	while(currentLine < words.length) { //does actual counting, now that I think of it this can be replaced by a for loop
		if(words[currentLine].toUpperCase().includes(message.toUpperCase())) count++;
		currentLine++;
	} //this part works trust me

	c = "Angela has said " + message + " " + count + " times, accounting for " + Math.round(count*1000000/words.length)/10000 + "% of all recorded words"; //message
	console.log("log" + c + " " + currentLine); //debug
	return c;
}

async function getJojoQuote(number) {
    var temp = await fs.readFileSync("jojo.txt", "utf8");
    var quotes = temp.split('\n'); 
    var currentLine = 0;
	while (currentLine < quotes.length) {
		if(quotes[currentLine] == "") quotes.splice(currentLine,1);
		currentLine++;
    }
    console.log(quotes[number]);
    return(quotes[number]); //89 lines
}
bot.on('message', function(message) {
	if(message.content == "export" && message.author.id == '195291351628120064') {
        message.channel.send("Exporting...");
		retrieveMessages();
	}

	if(message.content.toUpperCase().startsWith("ANGELA ") && message.content.toUpperCase().endsWith(" COUNTER") && !message.author.bot) {
		message.channel.send("Calculating...").then(() => {
			messageCounter(message.content.substring(7, message.content.length-8)).then(data => {
				console.log(data);
				message.channel.send(data);
			})
		})
    } 
    
    if(!message.author.bot && message.content.toUpperCase().includes("ENTERTAIN ME") && (message.channel.equals(bot.channels.get('658106864072130560'))|| (message.channel.equals(bot.channels.get('658110742322741258'))))) {
        isTalking = true;
    }
    if(!message.author.bot && message.content.toUpperCase().includes("PLEASE STOP") && (message.channel.equals(bot.channels.get('658106864072130560'))|| (message.channel.equals(bot.channels.get('658110742322741258'))))) {
        isTalking = false;
    }
    if(isTalking && (message.channel.equals(bot.channels.get('658106864072130560'))|| (message.channel.equals(bot.channels.get('658110742322741258'))))) {
        if(isAlreadyTalking) return;
        isAlreadyTalking = true;
        sleep()
		.then(() => {
            var temp = getJojoQuote(parseInt(Math.random()*89)).then(quote => {
                message.channel.send(quote);
           });
		}).then(() => {
            isAlreadyTalking = false;
        });
    }
})

 async function sleep() {
	await new Promise(r => setTimeout(r, parseInt(Math.random()*5000+2000)));
 }
  
bot.on('message', function(message) {
	if(message.author.id == '373579695611969557') {
		fs.appendFile("angela.txt", message.content + "\n", function(err) {
			if(err) {
				console.log(err);
			} 
		})
	}
	if(message.content.toUpperCase().includes("HEY ANGELA")) {
		/*fs.readFile('angela.txt', function(err, data){
            data += '';
            if(err) throw err;
            var lines = data.split('\n');
            var currentLine = 0;
            while (currentLine < lines.length) {
                if(lines[currentLine] == "" || lines[currentLine].includes("<@") || lines[currentLine].includes("@everyone")) lines.splice(currentLine,1);
                currentLine++;
            }
            var temp = Math.floor(Math.random()*(lines.length + 88));
            if(temp < 88) message.channel.send(getJojoQuote(temp));
            else message.channel.send(lines[temp-5]);
            
        })		
        */
       
       var temp = getJojoQuote(parseInt(Math.random()*89)).then(quote => {
            message.channel.send(quote);
       });
    }
    if(message.content.toUpperCase().includes("ANGELA YOU HAVE A PROBLEM") || message.content.toUpperCase().includes("HEY JOJO") && !message.author.bot) {
        var temp = getJojoQuote(parseInt(Math.random()*89)).then(quote => {
            message.channel.send(quote);
       });    }
})

function update() {
		let angela = bot.users.fetch('373579695611969557');
		if(bot.guilds.fetch('638173100567166976').members.cache.get(angela.id).nickname == null) {
			bot.guilds.fetch('638173100567166976').members.cache.get(bot.user.id).setNickname(angela.username);
		} else {
			bot.guilds.fetch('638173100567166976').members.cache.get(bot.user.id).setNickname(bot.guilds.get('638173100567166976').members.get(angela.id).nickname);
		}

	bot.fetchUser('373579695611969557').then(angela => {
		bot.user.setAvatar(angela.avatarURL);
		bot.user.setUsername(angela.username);
		bot.user.setPresence(angela.presence);
	});

}

bot.on('message', async function(message) {
    if(message.content.toLowerCase().includes('hi angela')) {
        let data = await fs.readFileSync("jojo.txt", "utf8");
        message.channel.send(retrieveChain((data)));
    }
});
 
function markovChainGenerator(text) {
    let textArr = text.split(' ');
    const markovChain = {};
    for(let i = 0; i < textArr.length; i++) {
        let word = textArr[i].toLowerCase();
        if(!markovChain[word]) markovChain[word] = [];
        if(textArr[i+1]) markovChain[word].push(textArr[i+1].toLowerCase());
    }
    return markovChain;
}
 
function retrieveChain(text) {    
    const markovChain = markovChainGenerator(text);
    const words = Object.keys(markovChain);
    let currentWordIndex = words[Math.floor(Math.random() * words.length)];
    let result = '';
    for(let i = 0; i < words.length; i++) {
        result += currentWordIndex + " ";
        let newWord = markovChain[currentWordIndex][Math.floor(Math.random()*markovChain[currentWordIndex].length)];
        currentWordIndex = newWord;
        if(!currentWordIndex || !markovChain.hasOwnProperty(currentWordIndex)) currentWordIndex = words[Math.floor(Math.random()*words.length)]; //reroll
    }
    if(result.includes("\n")) {
    	let temp = Math.floor(Math.random()*result.split('\n').length);
    	while(!result.split('\n')[temp] || result.split('\n')[temp].includes('@')) temp = Math.floor(Math.random()*result.split('\n').length);
    	return result.split('\n')[temp];
    }
    return result;
}


bot.login(secret);
