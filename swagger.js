// swagger.js
// This file configures Swagger JSDoc and Swagger UI Express.

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require('path'); // Import the 'path' module for robust path resolution.

// Options for swagger-jsdoc.
const options = {
  definition: {
    openapi: "3.0.0", // Specify the OpenAPI version.
    info: {
      title: "Online Retail API", // Title of your API documentation.
      version: "1.0.0", // Version of your API.
      description: "A simple CRUD API for online retail data using Node.js, Express, and PostgreSQL, documented with Swagger.",
    },
    servers: [
      {
        url: "http://localhost:3001", // Base URL for your API.
        description: "Development server",
      },
    ],
  },
  // Define the paths to the API documentation files.
  // Using path.join(__dirname, './routes/*.js') ensures the path is resolved correctly
  // regardless of the current working directory when the application starts.
  apis: [path.join(__dirname, './routes/*.js')],
};

// Initialize swagger-jsdoc with the defined options.
const swaggerSpec = swaggerJsdoc(options);

// Export swaggerUi and swaggerSpec for use in your main application file.
module.exports = { swaggerUi, swaggerSpec };