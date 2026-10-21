function requestResources(shouldFail) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if (shouldFail) {
				reject(new Error("Resources could not be loaded."));
				return;
			}

			resolve([
				{ title: "JavaScript Events", minutes: 15 },
				{ title: "Closures Practice", minutes: 20 },
				{ title: "Promises and Await", minutes: 25 }
			]);
		}, 1200);
	});
}

function makeCounter() {
	let count = 0;

	return function increment() {
		count += 1;
		return count;
	};
}

class Resource {
	constructor(title) {
		this.title = title;
	}

	describe() {
		return this.title;
	}
}

class TimedResource extends Resource {
	constructor(title, minutes) {
		super(title);
		this.minutes = minutes;
	}

	describe() {
		return `${super.describe()} | ${this.minutes} min`;
	}
}

const form = document.querySelector("#resourceForm");
const failNext = document.querySelector("#failNext");
const loadButton = document.querySelector("#loadButton");
const attempts = document.querySelector("#attempts");
const status = document.querySelector("#status");
const resourceList = document.querySelector("#resourceList");
const pingButton = document.querySelector("#pingButton");
const pings = document.querySelector("#pings");
const trace = document.querySelector("#trace");

const attemptCounter = makeCounter();
const pingCounter = makeCounter();
let busy = false;

function logTrace(message) {
	trace.textContent += `${message}\n`;
}

form.addEventListener("submit", async (e) => {
	e.preventDefault();

	if (busy) {
		return;
	}

	busy = true;
	loadButton.disabled = true;
	const capturedMode = failNext.checked;
	attempts.textContent = attemptCounter();
	status.textContent = "Loading...";
	resourceList.replaceChildren();
	trace.textContent = "";

	logTrace("A: handler starts");
	setTimeout(() => logTrace("D: timer task"), 0);
	Promise.resolve().then(() => logTrace("C: promise microtask"));
	logTrace("B: before await");

	try {
		const resources = await requestResources(capturedMode);

		resources.forEach(({ title, minutes }) => {
			const resource = new TimedResource(title, minutes);
			const listItem = document.createElement("li");
			listItem.textContent = resource.describe();
			resourceList.append(listItem);
		});

		status.textContent = "Loaded 3 resources";
		logTrace("E: success");
	} catch (error) {
		status.textContent = error.message;
		logTrace("E: failure");
	} finally {
		busy = false;
		loadButton.disabled = false;
		logTrace("F: cleanup");
	}
});

pingButton.addEventListener("click", () => {
	pings.textContent = pingCounter();
});
