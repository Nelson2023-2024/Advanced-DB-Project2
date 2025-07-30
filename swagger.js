const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require("path");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Online Retail API",
      version: "1.0.0",
      description:
        "A simple CRUD API for online retail data using Node.js, Express, and PostgreSQL, documented with Swagger.",
    },
    servers: [
      {
        url: "http://localhost:3001",
        description: "Development server",
      },
    ],
    components: {
      schemas: {
        Product: {
          type: "object",
          properties: {
            invoice_no: { type: "string" },
            stock_code: { type: "string" },
            description: { type: "string" },
            quantity: { type: "integer" },
            invoice_date: { type: "string", format: "date-time" },
            unit_price: { type: "number", format: "float" },
            customer_id: { type: "integer" },
            country: { type: "string" },
          },
          required: ["invoice_no", "stock_code", "quantity", "invoice_date", "unit_price", "country"],
        },
        ProductInput: {
          type: "object",
          properties: {
            invoice_no: { type: "string" },
            stock_code: { type: "string" },
            description: { type: "string" },
            quantity: { type: "integer" },
            invoice_date: { type: "string", format: "date-time" },
            unit_price: { type: "number", format: "float" },
            customer_id: { type: "integer" },
            country: { type: "string" },
          },
          required: ["invoice_no", "stock_code", "quantity", "invoice_date", "unit_price", "country"],
        },
      },
    },
  },
  apis: [path.join(__dirname, "./routes/*.js")],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };
