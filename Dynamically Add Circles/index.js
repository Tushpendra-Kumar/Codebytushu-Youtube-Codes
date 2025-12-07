// Watch for circles added/removed
const wrapper = document.querySelector(".wrapper");
const observer = new MutationObserver(indexCircles);
observer.observe(wrapper, { childList: true });

function indexCircles() {
	document.querySelectorAll(".circle")
		.forEach((el, i) => {
		//secret sauce. applies property to inline style
		el.style.setProperty("--i", i + 1);
	});
	console.log("mutated");
	updateMessage();
}

document.getElementById("add").addEventListener("click", () => {
	const newCircle = document.createElement("div");
	newCircle.className = "circle";
	wrapper.appendChild(newCircle);
});

/* only for output of new div html */


function updateMessage() {
	const children = wrapper.children;
	/* loop through the wrapper and grab the code for each circle */
	output.textContent = "";
	for (const child of children) {
		output.textContent += child.outerHTML.toString() + "\n";
	}
	output.classList.remove("prettyprinted");
	PR.prettyPrint();
}

indexCircles();
