const http = require("http");
const fs = require("fs");
const { URL } = require("url");

const port = process.env.PORT || 3000;
const users = [];
const orders = [];
let products = [
  { id: 1, name: "Laptop", price: 799 },
  { id: 2, name: "Headphones", price: 49 },
  { id: 3, name: "Keyboard", price: 29 }
];

function json(res, data, code = 200) {
  res.writeHead(code, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

function body(req) {
  return new Promise((resolve, reject) => {
    let value = "";
    req.on("data", chunk => value += chunk);
    req.on("end", () => {
      try { resolve(JSON.parse(value || "{}")); } catch (error) { reject(error); }
    });
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  try {
    if (req.method === "GET" && url.pathname === "/") {
      res.writeHead(200, { "Content-Type": "text/html" });
      return res.end(fs.readFileSync("index.html"));
    }

    if (req.method === "GET" && url.pathname === "/api/products") {
      const query = (url.searchParams.get("q") || "").toLowerCase();
      return json(res, products.filter(product => product.name.toLowerCase().includes(query)));
    }

    if (req.method === "POST" && url.pathname === "/api/register") {
      users.push(await body(req));
      return json(res, { message: "Registration successful" });
    }

    if (req.method === "POST" && url.pathname === "/api/login") {
      const credentials = await body(req);
      const valid = users.some(user =>
        user.email === credentials.email && user.password === credentials.password
      );
      return json(res, { message: valid ? "Login successful" : "Login failed" });
    }

    if (req.method === "POST" && url.pathname === "/api/products") {
      const product = await body(req);
      const created = { id: Date.now(), name: product.name, price: product.price };
      products.push(created);
      return json(res, { message: "Product added", product: created });
    }

    if (req.method === "POST" && url.pathname === "/api/orders") {
      const orderData = await body(req);
      const total = orderData.items.reduce((sum, item) => sum + item.price * item.qty, 0);
      const order = { id: orders.length + 1, items: orderData.items, total };
      orders.push(order);
      return json(res, { message: "Order placed", order });
    }

    if (req.method === "GET" && url.pathname === "/api/orders") {
      return json(res, orders);
    }

    return json(res, { error: "Not found" }, 404);
  } catch (error) {
    return json(res, { error: error.message }, 400);
  }
});

server.listen(port, () => console.log(`eShop running at http://localhost:${port}`));
