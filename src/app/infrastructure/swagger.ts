const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "Automatically generated API documentation using Swagger",
    },
    servers: [
      {
        url: "http://localhost:3000/api",
        description: "Local development server",
      },
    ],
  };
 
  export default swaggerDefinition;