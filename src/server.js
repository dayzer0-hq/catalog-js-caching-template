"use strict";

const { buildApp } = require("./app");
const { Store } = require("./store");

const store = new Store();
const app = buildApp(store);
const port = Number(process.env.PORT) || 8080;

app.listen(port, () => {
  console.log(
    `listening on :${port} — ${store.products.length} products seeded, every query pays ~${store.queryCostMs}ms`
  );
});
