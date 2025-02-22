import swaggerJsdoc from "swagger-jsdoc";
import swaggerDefinition from "../../../../infrastructure/swagger";

const options = {
  definition: swaggerDefinition,
  apis: ["./src/app/api/**/*.ts"], // Ensure this matches your API files
};

// Generate Swagger spec
const swaggerSpec = swaggerJsdoc(options);

export async function GET() {
  return new Response(JSON.stringify(swaggerSpec), {
    headers: { "Content-Type": "application/json" },
  });
}
