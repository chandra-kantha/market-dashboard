/* ---------------- GOLD PRICE (NO API KEY) ---------------- */

async function loadGoldPrice() {
  const res = await fetch(
    "https://query1.finance.yahoo.com/v7/finance/quote?symbols=GC=F,USDINR=X"
  );
  const data = await res.json();

  const quotes = data.quoteResponse.result;

  const goldUSD = quotes.find(q => q.symbol === "GC=F").regularMarketPrice;
  const usdInr = quotes.find(q => q.symbol === "USDINR=X").regularMarketPrice;

  // Gold futures are per ounce
  const goldInrPerGram = (goldUSD * usdInr / 31.1035).toFixed(0);

  document.getElementById("goldPrice").innerText =
    `₹${goldInrPerGram} / gram`;
}

/* ---------------- GOLD LAST 30 DAYS (SIMPLIFIED) ---------------- */

async function loadGoldChart() {
  const res = await fetch(
    "https://query1.finance.yahoo.com/v8/finance/chart/GC=F?range=1mo&interval=1d"
  );
  const data = await res.json();

  const timestamps = data.chart.result[0].timestamp;
  const prices = data.chart.result[0].indicators.quote[0].close;

  const labels = timestamps.map(t =>
    new Date(t * 1000).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })
  );

  new Chart(document.getElementById("goldChart"), {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Gold (USD/oz)",
        data: prices,
        borderWidth: 2
      }]
    }
  });
}

/* ---------------- STOCKS + MARKET MOOD ---------------- */

async function loadStocks() {
  const symbols = [
    "RELIANCE.NS",
    "TCS.NS",
    "HDFCBANK.NS",
    "INFY.NS",
    "ICICIBANK.NS"
  ];

  const res = await fetch(
    `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols.join(",")}`
  );
  const data = await res.json();

  const stocks = data.quoteResponse.result;
  const ul = document.getElementById("stocks");
  ul.innerHTML = "";

  let green = 0;

  stocks.forEach(stock => {
    const change = stock.regularMarketChangePercent;
    if (change > 0) green++;

    const arrow = change >= 0 ? "▲" : "▼";
    const li = document.createElement("li");

    li.innerText =
      `${stock.shortName} ${arrow} ${change.toFixed(2)}%`;

    ul.appendChild(li);
  });

  const ratio = green / stocks.length;
  let mood = "Neutral 🟡";

  if (ratio >= 0.7) mood = "Bullish 🟢";
  else if (ratio < 0.4) mood = "Bearish 🔴";

  document.getElementById("marketMood").innerText = mood;
}

/* ---------------- INIT ---------------- */

loadGoldPrice();
loadGoldChart();
loadStocks();
