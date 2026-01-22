import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Auth App Test API",                 //kotelezo
            version: "1.0.0",                           //kotelezo
            description: "API documntation for the Auth App",
            contact: {
                name: "Support",
                url: "http://localhost:3300",
                email: "support@example.com"
            },
            licence: {                                  
                name: "Private"
            }
        },
        servers: [
            {
                url: "/api/v1",
                description: "API v1",
            },
        ],
        components: {
            securitySchema: {
                bearerAuth: {
                    type:"http",
                    schema: "bearer",
                    bearerFormat: "JWT"
                },
            },
        },
        security: [
        {
            bearerAuth: [],
        },

    ],
    },

    apis: ["./controllers/*.js"]
};

const swaggerSpec = swaggerJSDoc(options);

export function setupSwagger(app) {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
        explorer: true,
        
    }))
}