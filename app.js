const express = require("express");
const app = express();
const productRoutes = require("./routes/productRoutes");
const { swaggerUi, swaggerSpec } = require("./swagger");

app.use(express.json());
app.use("/products", productRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 3001;
// Start the server and log the URLs
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
});