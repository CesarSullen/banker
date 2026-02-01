let allData = [];

const fileInput = document.getElementById("import-json");
const btnImport = document.getElementById("btn-import");
const collectorsList = document.getElementById("collectors-list");
const payoutPanel = document.getElementById("payout-panel");
const payoutList = document.getElementById("payout-list");
const winNumberInput = document.getElementById("winning-number");
const btnSearchWinners = document.getElementById("btn-search-winners");

const grandTotalFixedEl = document.getElementById("grand-total-fixed");
const grandTotalRunningEl = document.getElementById("grand-total-running");
const grandTotalCombinedEl = document.getElementById("grand-total-combined");

//	Parse data like "$1,200" and turns it into 1200
const parseCurrency = (str) => {
	if (!str) return 0;
	return parseFloat(str.replace(/[^0-9.-]+/g, "")) || 0;
};

//	Import Data
btnImport.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", async (e) => {
	const files = Array.from(e.target.files);

	for (const file of files) {
		const text = await file.text();
		const json = JSON.parse(text);

		if (json.meta && json.data) {
			const exists = allData.some(
				(item) =>
					item.meta.collector === json.meta.collector &&
					item.meta.date === json.meta.date
			);

			if (!exists) {
				allData.push(json);
			}
		}
	}

	updateUI();
	saveToLocalStorage();
	fileInput.value = "";
});

function updateUI() {
	let globalFixed = 0;
	let globalRunning = 0;

	collectorsList.innerHTML = "";

	if (allData.length === 0) {
		collectorsList.innerHTML =
			'<p class="empty-msg">No hay datos cargados aún.</p>';
		resetDisplayTotals();
		return;
	}

	allData.forEach((json) => {
		let collectorFixed = 0;
		let collectorRunning = 0;

		json.data.forEach((group) => {
			group.fixedBets.forEach(
				(bet) => (collectorFixed += parseFloat(bet.amount) || 0)
			);
			group.runningBets.forEach(
				(bet) => (collectorRunning += parseFloat(bet.amount) || 0)
			);
		});

		globalFixed += collectorFixed;
		globalRunning += collectorRunning;

		const item = document.createElement("div");
		item.className = "list-item";
		item.innerHTML = `
            <div class="collector-info">
                <strong>${json.meta.collector}</strong>
                <span>${json.data.length} clientes registrados</span>
            </div>
            <div class="amount-tag">$${(
							collectorFixed + collectorRunning
						).toLocaleString()}</div>
        `;
		collectorsList.appendChild(item);
	});

	//	Update Global Cards
	grandTotalFixedEl.textContent = `$${globalFixed.toLocaleString()}`;
	grandTotalRunningEl.textContent = `$${globalRunning.toLocaleString()}`;
	grandTotalCombinedEl.textContent = `$${(
		globalFixed + globalRunning
	).toLocaleString()}`;
}

function resetDisplayTotals() {
	grandTotalFixedEl.textContent = "$0";
	grandTotalRunningEl.textContent = "$0";
	grandTotalCombinedEl.textContent = "$0";
}

//	Functionality for btn-search-winners
/* btnSearchWinners.addEventListener("click", () => {
	const rawNum = winNumberInput.value.trim();
	if (!rawNum) {
		alert("Por favor, introduce el número ganador.");
		return;
	}

	const formattedWinNum = rawNum.padStart(2, "0");
	renderPayouts(formattedWinNum);
}); */

function populateWinningNumbers() {
	const select = document.getElementById("winning-number");
	for (let i = 0; i <= 99; i++) {
		const num = i.toString().padStart(2, "0");
		const option = document.createElement("option");
		option.value = num;
		option.textContent = num;
		select.appendChild(option);
	}
}

populateWinningNumbers();

btnSearchWinners.addEventListener("click", () => {
	const selectedNum = winNumberInput.value;
	if (!selectedNum) {
		alert("Por favor, selecciona el número ganador.");
		return;
	}
	renderPayouts(selectedNum);
});

function renderPayouts(targetNum) {
	payoutList.innerHTML = "";
	let winnersFound = false;

	allData.forEach((json) => {
		json.data.forEach((group) => {
			group.fixedBets.forEach((bet) => {
				if (bet.number === targetNum) {
					addWinnerRow(json.meta.collector, group.client, "Fijo", bet.amount);
					winnersFound = true;
				}
			});

			group.runningBets.forEach((bet) => {
				if (bet.number === targetNum) {
					addWinnerRow(
						json.meta.collector,
						group.client,
						"Corrido",
						bet.amount
					);
					winnersFound = true;
				}
			});
		});
	});

	payoutPanel.style.display = "block";
	if (!winnersFound) {
		payoutList.innerHTML = `<p class="empty-msg" style="color: #ff4d4d;">No hubo ganadores para el número ${targetNum}.</p>`;
	}
	payoutPanel.scrollIntoView({ behavior: "smooth" });
}

function addWinnerRow(collector, client, type, amount) {
	const div = document.createElement("div");
	div.className = "list-item";

	div.innerHTML = `
        <div class="collector-info">
            <strong>${client} <small style="color:#ffbf00">(${collector})</small></strong>
            <span>Ganó en ${type}</span>
        </div>
        <div class="amount-tag">Jugó: $${amount}</div>
    `;
	payoutList.appendChild(div);
}

document.getElementById("btn-clear").addEventListener("click", () => {
	if (confirm("¿Borrar todos los datos importados?")) {
		allData = [];
		payoutPanel.style.display = "none";
		winNumberInput.value = "";
		saveToLocalStorage();
		updateUI();
	}
});

//	Load and Save data
function saveToLocalStorage() {
	localStorage.setItem("banker_session_data", JSON.stringify(allData));
}

function loadFromLocalStorage() {
	const savedData = localStorage.getItem("banker_session_data");
	if (savedData) {
		allData = JSON.parse(savedData);
		updateUI();
	}
}

loadFromLocalStorage();

//	Service Worker
if ("serviceWorker" in navigator) {
	window.addEventListener("load", () => {
		navigator.serviceWorker
			.register("./sw.js")
			.then((reg) => console.log("Banker SW registrado", reg.scope))
			.catch((err) => console.error("Error en SW:", err));
	});
}
