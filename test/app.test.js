// The tests shrink the dataset and zero the simulated round-trip so they stay
// fast; the slow defaults exist for the running server, not for npm test.
"use strict";

process.env.SEED_ROWS = "100";
process.env.DB_DELAY_MS = "0";

const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const { buildApp } = require("../src/app");
const { Store } = require("../src/store");

let server;
let base;

before(async () => {
  const app = buildApp(new Store());
  await new Promise((resolve) => {
    server = app.listen(0, "127.0.0.1", () => {
      base = `http://127.0.0.1:${server.address().port}`;
      resolve();
    });
  });
});

after(() => server.close());

test("GET /health answers 200 ok", async () => {
  const res = await fetch(`${base}/health`);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { status: "ok" });
});

test("GET /products/1 returns the product", async () => {
  const res = await fetch(`${base}/products/1`);
  assert.equal(res.status, 200);
  const product = await res.json();
  assert.equal(product.id, 1);
});

test("GET /products/99999 is a 404", async () => {
  const res = await fetch(`${base}/products/99999`);
  assert.equal(res.status, 404);
});
