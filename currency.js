const currencyRates = {
    USD: 1,
    EUR: 0.88,
    GBP: 0.74,
    JOD: 0.71
};

const currencyLabels = {
    USD: "$",
    EUR: "EUR ",
    GBP: "GBP ",
    JOD: "JOD "
};

function getSelectedCurrency() {
    return localStorage.getItem("selectedCurrency") || "USD";
}

function makeEndingPrice(amount) {
    if (amount <= 0) {
        return 0;
    }

    let roundedAmount = Math.max(1, Math.round(amount));
    return roundedAmount - 0.01;
}

function formatCurrency(usdPrice) {
    let currency = getSelectedCurrency();
    let convertedPrice = Number(usdPrice) * currencyRates[currency];
    let endingPrice = makeEndingPrice(convertedPrice);

    return currencyLabels[currency] + endingPrice.toFixed(2);
}

function applyCurrency() {
    let priceElements = document.querySelectorAll("[data-usd-price]");

    priceElements.forEach(element => {
        let prefix = element.getAttribute("data-price-prefix") || "";
        element.innerText = prefix + formatCurrency(element.getAttribute("data-usd-price"));
    });
}

function addCurrencySelector() {
    if (document.getElementById("currencySelect")) {
        return;
    }

    let pageBox = document.querySelector(".myDiv");

    if (!pageBox) {
        return;
    }

    let currencyBox = document.createElement("p");
    currencyBox.innerHTML = `
        Currency:
        <select id="currencySelect">
            <option value="USD">USD</option>
            <option value="EUR">Euros</option>
            <option value="GBP">Pounds</option>
            <option value="JOD">JODs</option>
        </select>
    `;

    let icons = pageBox.querySelectorAll(".icon");

    if (icons.length > 0) {
        icons[icons.length - 1].parentNode.insertAdjacentElement("afterend", currencyBox);
    } else {
        pageBox.insertBefore(currencyBox, pageBox.firstChild);
    }

    let select = document.getElementById("currencySelect");
    select.value = getSelectedCurrency();

    select.onchange = function () {
        localStorage.setItem("selectedCurrency", select.value);
        applyCurrency();
    };
}

document.addEventListener("DOMContentLoaded", function () {
    addCurrencySelector();
    applyCurrency();
});
