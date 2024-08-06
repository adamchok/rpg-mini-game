let xp = 0; // Create variables
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["stick"];

const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterHealthText = document.querySelector("#monsterHealth");
const monsterNameText = document.querySelector("#monsterName");
const locations = [
	{
		name: "townsquare",
		"button text": ["Go Store", "Go Cave", "Fight Dragon"],
		"button functions": [goStore, goCave, fightDragon],
		text: 'You\'re in the town square. You see a sign that says "Store".',
	},
	{
		name: "store",
		"button text": [
			"Buy 10 Health (10 gold)",
			"Buy Weapon (30 gold)",
			"Go Town Square",
		],
		"button functions": [buyHealth, buyWeapon, goTownSquare],
		text: "You have entered the store...",
	},
	{
		name: "cave",
		"button text": ["Fight Slime", "Fight Fanged Beast", "Go Town Square"],
		"button functions": [fightSlime, fightBeast, goTownSquare],
		text: "You have entered the cave...",
	},
	{
		name: "fight",
		"button text": ["Attack", "Dodge", "Run"],
		"button functions": [attack, dodge, goTownSquare],
		text: "You are fighting a monster...",
	},
	{
		name: "kill monster",
		"button text": ["Go Town Square", "Go Town Square", "Go Town Square"],
		"button functions": [goTownSquare, goTownSquare, easterEgg],
		text: "The monster screams 'Arggg!' as it dies. You gained experience points and found some gold.",
	},
	{
		name: "lose",
		"button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
		"button functions": [restart, restart, restart],
		text: "You died.",
	},
	{
		name: "win",
		"button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
		"button functions": [restart, restart, restart],
		text: "You defeated the dragon! You Won!",
	},
	{
		name: "easter egg",
		"button text": ["2", "8", "Go Town Square"],
		"button functions": [pickTwo, pickEight, goTownSquare],
		text: "You discovered a secret game. Pick a number above. 10 numbers will be randomly chosen between 0 and 10. If the number you chose matches one of the random numbers, you will be awarded 20 gold. If you don't, there will be consequences!",
	},
];
const weapons = [
	{
		name: "stick",
		power: 5,
	},
	{
		name: "dagger",
		power: 30,
	},
	{
		name: "claw hammer",
		power: 50,
	},
	{
		name: "sword",
		power: 100,
	},
];
const monsters = [
	{
		name: "slime",
		level: 2,
		health: 15,
	},
	{
		name: "fanged beast",
		level: 8,
		health: 60,
	},
	{
		name: "dragon",
		level: 20,
		health: 300,
	},
];

// Initialize buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function update(location) {
	monsterStats.style.display = "none";
	button1.innerText = location["button text"][0];
	button2.innerText = location["button text"][1];
	button3.innerText = location["button text"][2];
	button1.onclick = location["button functions"][0];
	button2.onclick = location["button functions"][1];
	button3.onclick = location["button functions"][2];
	text.textContent = location.text;
}

function goTownSquare() {
	update(locations[0]);
}

function goStore() {
	update(locations[1]);
}

function goCave() {
	update(locations[2]);
}

function buyHealth() {
	if (gold >= 10) {
		gold -= 10;
		health += 10;
		healthText.innerText = health;
		goldText.innerText = gold;
		text.innerText = "Transaction successful. Health increased by 10.";
	} else {
		text.innerText = "Insufficient gold.";
	}
}

function buyWeapon() {
	if (currentWeapon < weapons.length - 1) {
		if (gold >= 30) {
			gold -= 30;
			currentWeapon++;
			inventory.push(weapons[currentWeapon].name);
			goldText.innerText = gold;
			text.innerText =
				"Transaction successful. You now have a " +
				inventory[currentWeapon] +
				". In your inventory you have: " +
				inventory;
		} else {
			text.innerText = "Insufficient gold.";
		}
	} else {
		text.innerText = "You already have the most powerful weapon";
		button2.innerText = "Sell Weapon for 15 gold";
		button2.onclick = sellWeapon;
	}
}

function sellWeapon() {
	if (inventory.length > 1) {
		gold += 15;
		goldText.innerText = gold;
		let currentWeapon = inventory.shift();
		text.innerText =
			"Transaction successful. You sold a " +
			currentWeapon +
			". In your inventory you have: " +
			inventory +
			".";
	} else {
		text.innerText = "Don't sell your only weapon!";
	}
}

function fightSlime() {
	fighting = 0;
	goFight();
}

function fightBeast() {
	fighting = 1;
	goFight();
}

function fightDragon() {
	fighting = 2;
	goFight();
}

function goFight() {
	update(locations[3]);
	monsterHealth = monsters[fighting].health;
	monsterNameText.innerText = monsters[fighting].name;
	monsterHealthText.innerText = monsterHealth;
	monsterStats.style.display = "block";
}

function attack() {
	text.innerText =
		"The " +
		monsters[fighting].name +
		" attacks." +
		"You attack it with your " +
		weapons[currentWeapon].name +
		".";

	if (isMonsterHit()) {
		health -= getMonsterAttackValue(monsters[fighting].level);
	} else {
		text.innerText += " The monster missed.";
	}

	monsterHealth -=
		weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;

	healthText.innerText = health;
	monsterHealthText.innerText = monsterHealth;

	if (health <= 0) {
		lose();
	} else if (monsterHealth <= 0) {
		fighting === 2 ? winGame() : defeatMonster();
	}

	if (Math.random() <= 0.1 && inventory.length !== 1) {
		text.innerText += " Your " + inventory.pop() + " breaks.";
		currentWeapon--;
	}
}

function dodge() {
	text.innerText =
		"You dodge the attack from the " + monsters[fighting].name + ".";
}

function defeatMonster() {
	gold += Math.floor(monsters[fighting].level * 6.7);
	xp += monsters[fighting].level;
	goldText.innerText = gold;
	xpText.innerText = xp;
	update(locations[4]);
}

function lose() {
	update(locations[5]);
}

function restart() {
	xp = 0;
	health = 100;
	gold = 50;
	currentWeapon = 0;
	inventory = ["stick"];
	goldText.innerText = gold;
	healthText.innerText = health;
	xpText.innerText = xp;
	goTownSquare();
}

function winGame() {
	update(locations[6]);
}

function getMonsterAttackValue(level) {
	let hit = level * 5 - Math.floor(Math.random() * xp);
	return hit;
}

function isMonsterHit() {
	return Math.random() > 0.2 || health < 20;
}

function easterEgg() {
	update(locations[7]);
}

function pickTwo() {
	pick(2);
}

function pickEight() {
	pick(8);
}

function pick(guess) {
	let numbers = [];
	while (numbers.length < 10) {
		numbers.push(Math.floor(Math.random() * 11));
	}

	text.innerText = "You picked " + guess + ". The random numbers are:\n";

	for (let i = 0; i < 10; i++) {
		i === 9
			? (text.innerText += numbers[i])
			: (text.innerText += numbers[i] + ", ");
	}

	if (numbers.indexOf(guess) !== -1) {
		text.innerText += "You're right! You won 20 gold!";
		gold += 20;
		goldText.innerText = gold;
	} else {
		text.innerText += "Wrong! You lose 10 health.";
		health -= 10;
		healthText.innerText = health;
		if (health <= 0) {
			lose();
		}
	}
}
