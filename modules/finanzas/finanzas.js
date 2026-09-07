const STORAGE_KEY = "clara_finanzas_v1";
const currency = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

const setupView = document.getElementById("setupView");
const dashboardView = document.getElementById("dashboardView");
const setupForm = document.getElementById("setupForm");
const sharedList = document.getElementById("sharedList");
const expenseForm = document.getElementById("expenseForm");
let appData = null;

function loadData() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : null;
    } catch (error) {
        return null;
    }
}

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
}

function formatMoney(value) {
    return currency.format(Number(value) || 0);
}

function addSharedRow(name = "", amount = "", people = 2, contributionPercentage = "") {
    const row = document.createElement("div");
    row.className = "shared-row";
    row.innerHTML = `<input class="shared-name" type="text" maxlength="40" placeholder="Ej. Netflix compartido" value="${name}"><label class="compact-field"><span>Total del gasto</span><div class="money-input"><span>$</span><input class="shared-amount" type="number" min="0" step="1000" placeholder="0" value="${amount}"></div></label><label class="compact-field"><span>Personas</span><input class="shared-people" type="number" min="2" step="1" value="${people}"></label><label class="compact-field"><span>Mi porcentaje</span><div class="percentage-input"><input class="shared-percentage" type="number" min="0" max="100" step="1" placeholder="0" value="${contributionPercentage}"><span>%</span></div></label><div class="shared-total"><span>Mi aporte</span><strong class="shared-my-amount-label">${formatMoney(Number(amount) * Number(contributionPercentage) / 100)}</strong></div><button class="remove-button" type="button" aria-label="Eliminar gasto compartido">×</button>`;
    const updateContribution = () => {
        const total = Number(row.querySelector(".shared-amount").value) || 0;
        const percentage = Math.min(100, Math.max(0, Number(row.querySelector(".shared-percentage").value) || 0));
        row.querySelector(".shared-percentage").value = percentage || "";
        row.querySelector(".shared-my-amount-label").textContent = formatMoney(total * percentage / 100);
    };
    row.querySelectorAll(".shared-amount, .shared-people, .shared-percentage").forEach((input) => input.addEventListener("input", updateContribution));
    row.querySelector(".remove-button").addEventListener("click", () => row.remove());
    sharedList.appendChild(row);
}

document.getElementById("addShared").addEventListener("click", () => addSharedRow());

setupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const income = Number(document.getElementById("income").value);
    const fixedExpenses = Number(document.getElementById("fixedExpenses").value);
    const sharedExpenses = [...document.querySelectorAll(".shared-row")].map((row) => ({
        name: row.querySelector(".shared-name").value.trim() || "Gasto compartido",
        amount: Number(row.querySelector(".shared-amount").value) || 0,
        people: Number(row.querySelector(".shared-people").value) || 2,
        contributionPercentage: Number(row.querySelector(".shared-percentage").value) || 0,
        myAmount: (Number(row.querySelector(".shared-amount").value) || 0) * (Number(row.querySelector(".shared-percentage").value) || 0) / 100
    })).filter((expense) => expense.amount > 0);

    if (income < 0 || fixedExpenses < 0 || fixedExpenses > income) {
        document.getElementById("setupError").textContent = "Revisa los valores: los gastos fijos no pueden superar tus ingresos.";
        return;
    }
    appData = { income, fixedExpenses, sharedExpenses, expenses: [], configuredAt: new Date().toISOString() };
    saveData();
    renderDashboard();
});

expenseForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const amount = Number(document.getElementById("expenseAmount").value);
    const description = document.getElementById("expenseDescription").value.trim();
    if (!description || amount <= 0) {
        document.getElementById("expenseError").textContent = "Escribe una descripción y un valor mayor que cero.";
        return;
    }
    appData.expenses.unshift({ id: Date.now(), description, category: document.getElementById("expenseCategory").value, amount, date: new Date().toISOString() });
    saveData();
    expenseForm.reset();
    document.getElementById("expenseError").textContent = "";
    renderDashboard();
});

document.getElementById("resetButton").addEventListener("click", () => {
    if (window.confirm("¿Quieres borrar tu configuración y todos tus movimientos?")) {
        localStorage.removeItem(STORAGE_KEY);
        appData = null;
        setupForm.reset();
        sharedList.innerHTML = "";
        showSetup();
    }
});

function showSetup() {
    setupView.hidden = false;
    dashboardView.hidden = true;
}

function renderDashboard() {
    setupView.hidden = true;
    dashboardView.hidden = false;
    const sharedTotal = appData.sharedExpenses.reduce((total, item) => total + (item.myAmount || item.amount || 0), 0);
    const commitments = appData.fixedExpenses + sharedTotal;
    const totalSpent = appData.expenses.reduce((total, item) => total + item.amount, 0);
    const todayKey = new Date().toDateString();
    const todaySpent = appData.expenses.filter((item) => new Date(item.date).toDateString() === todayKey).reduce((total, item) => total + item.amount, 0);
    const available = appData.income - commitments - totalSpent;

    document.getElementById("incomeValue").textContent = formatMoney(appData.income);
    document.getElementById("commitmentsValue").textContent = formatMoney(commitments);
    document.getElementById("availableValue").textContent = formatMoney(available);
    document.getElementById("availableValue").classList.toggle("negative", available < 0);
    document.getElementById("availableCaption").textContent = available < 0 ? "Has superado tu presupuesto base" : "Después de compromisos y gastos";
    document.getElementById("todayValue").textContent = formatMoney(todaySpent);
    document.getElementById("todayCaption").textContent = todaySpent ? "Registrado durante el día" : "Todavía no hay gastos";
    document.getElementById("todayDate").textContent = new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "short" }).format(new Date());
    document.getElementById("availableProgress").style.width = `${Math.min(100, Math.max(0, (Math.max(0, available) / Math.max(1, appData.income)) * 100))}%`;
    updateBudgetAlert(commitments, totalSpent, available);
    renderExpenses();
}

function updateBudgetAlert(commitments, totalSpent, available) {
    const alert = document.getElementById("budgetAlert");
    const messages = [];
    const initialAvailable = appData.income - commitments;
    const latestExpense = appData.expenses[0];

    if (commitments > appData.income) {
        messages.push(`Tus compromisos iniciales superan el monto inicial de ingresos por ${formatMoney(commitments - appData.income)}.`);
    }
    if (latestExpense && latestExpense.amount > initialAvailable - (totalSpent - latestExpense.amount)) {
        messages.push(`El gasto "${escapeHtml(latestExpense.description)}" supera el monto inicial disponible.`);
    }
    if (available < 0) {
        messages.push(`La suma de tus gastos supera tus ingresos mensuales por ${formatMoney(Math.abs(available))}.`);
    }

    alert.innerHTML = messages.map((message) => `<span>!</span><p>${message}</p>`).join("");
    alert.hidden = messages.length === 0;
}

function renderExpenses() {
    const list = document.getElementById("expenseList");
    document.getElementById("movementCount").textContent = appData.expenses.length;
    if (!appData.expenses.length) {
        list.innerHTML = '<div class="empty-state"><span>＋</span><p>Aún no hay movimientos.<br>Tu próximo gasto aparecerá aquí.</p></div>';
        return;
    }
    list.innerHTML = appData.expenses.slice(0, 8).map((item) => `<article class="expense-item"><div class="category-icon">${getCategoryIcon(item.category)}</div><div class="expense-info"><strong>${escapeHtml(item.description)}</strong><span>${item.category} · ${formatDate(item.date)}</span></div><b>−${formatMoney(item.amount)}</b><button class="delete-expense" type="button" data-expense-id="${item.id}" aria-label="Eliminar ${escapeHtml(item.description)}">×</button></article>`).join("");
    list.querySelectorAll(".delete-expense").forEach((button) => button.addEventListener("click", () => {
        appData.expenses = appData.expenses.filter((item) => String(item.id) !== button.dataset.expenseId);
        saveData();
        renderDashboard();
    }));
}

function getCategoryIcon(category) {
    return { Alimentación: "◒", Transporte: "↗", Hogar: "⌂", Ocio: "✦", Salud: "+", Otros: "•" }[category] || "•";
}

function formatDate(date) {
    return new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "short" }).format(new Date(date));
}

function escapeHtml(value) {
    return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character]));
}

document.addEventListener("DOMContentLoaded", () => {
    appData = loadData();
    if (appData && Number.isFinite(appData.income)) renderDashboard();
    else showSetup();
});
