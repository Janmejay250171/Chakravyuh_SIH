const fs = require('fs');

const countries = ["IN (AS9498)", "RU (AS48852)", "SG (AS45102)", "NL (AS6830)", "US (AS7018)"];
const sources = ["Cluster #772 (DarkWeb Escrow)", "Syndicate P2P Node", "Mixer Relay #4", "Unverified Wallet Pool", "Sanctioned Gateway Alpha"];
const statuses = ["FLAGGED", "INVESTIGATING", "CONTAINED", "VERIFIED"];

let txs = [];
for (let i = 1; i <= 1000; i++) {
  let hash = Array.from({length: 16}, () => Math.floor(Math.random()*16).toString(16)).join("");
  let amount = +(Math.random() * 45 + 0.1).toFixed(2);
  let risk = amount > 25 ? "CRITICAL" : amount > 10 ? "HIGH" : "MEDIUM";
  
  txs.push({
    id: i,
    timestamp: "2026-09-04 14:" + String(Math.floor(Math.random()*59)).padStart(2,"0") + " IST",
    src_ip: "10." + Math.floor(Math.random()*255) + "." + Math.floor(Math.random()*255) + "." + Math.floor(Math.random()*255),
    dst_ip: "192.168." + Math.floor(Math.random()*255) + "." + Math.floor(Math.random()*255),
    src_port: Math.floor(Math.random() * 50000 + 1024),
    dst_port: 8333,
    txid: hash + "..." + hash.slice(-4),
    input_addresses: ["bc1q" + hash.slice(0,8), "1Boat" + hash.slice(8,14)],
    output_addresses: ["3FZb" + hash.slice(2,10), "bc1qsw" + hash.slice(4,12)],
    input_amounts: [+(amount * 0.7).toFixed(2), +(amount * 0.3).toFixed(2)],
    output_amounts: [amount],
    geo_country_asn: countries[Math.floor(Math.random() * countries.length)],
    source: sources[Math.floor(Math.random() * sources.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    riskLevel: risk,
    amountStr: amount + " BTC"
  });
}

if (!fs.existsSync("src/components/modules")) {
  fs.mkdirSync("src/components/modules", { recursive: true });
}

fs.writeFileSync("src/components/modules/mockTransactions.json", JSON.stringify(txs, null, 2));
console.log("Dataset generated successfully!");