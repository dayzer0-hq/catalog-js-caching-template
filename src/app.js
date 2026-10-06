"use strict";

const express = require("express");

function buildApp(store) {
  const app = express();
  app.use(express.json());

  app.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/products/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "id must be a number" });
    }
    const product = await store.get(id);
    if (!product) {
      return res.status(404).json({ error: "no such product" });
    }
    res.json(product);
  });

  // The full list — a large, uncompressed, unpaginated payload, on purpose.
  app.get("/products", async (req, res) => {
    res.json(await store.byCategory(req.query.category));
  });

  return app;
}

module.exports = { buildApp };
