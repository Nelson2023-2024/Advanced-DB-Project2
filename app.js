// app.js
// This is the main application file, setting up the Express server and routes.

const express = require("express");
const app = express();
const productRoutes = require("./routes/productRoutes"); // Import product routes.
const { swaggerUi, swaggerSpec } = require("./swagger"); // Import Swagger UI and spec.

// Middleware to parse JSON request bodies.
app.use(express.json());

// Use the product routes for all requests to /products.
app.use("/products", productRoutes);

// Set up Swagger UI at the /api-docs endpoint.
// swaggerUi.serve serves the Swagger UI files, and swaggerUi.setup initializes it with your spec.
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Define the port the server will listen on.
const PORT = process.env.PORT || 3001;

// Start the server and log the URLs for the API and Swagger documentation.
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
});
