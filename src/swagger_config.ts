// src/swagger_config.ts
import swaggerJsdoc from 'swagger-jsdoc';
import AppConfig from './app_config'; // To get app version, if needed

const config = AppConfig.getConfig();

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express TypeScript Boilerplate API',
      version: process.env.npm_package_version || '1.0.0', // Uses version from package.json
      description: 'API documentation for the Express TypeScript Boilerplate application.',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
      contact: {
        name: 'Your Name/Org',
        url: 'your-website.com',
        email: 'your-email@example.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.port}/`, // Base URL for the API
        description: 'Development server',
      },
      // You can add more servers here (e.g., staging, production)
    ],
    components: {
        schemas: {
            Error: {
                type: 'object',
                properties: {
                    status: {
                        type: 'string',
                        example: 'error',
                    },
                    message: {
                        type: 'string',
                    },
                    details: { 
                        type: 'object',
                    }
                },
            },
            Success: {
                 type: 'object',
                 properties: {
                    status: {
                        type: 'string',
                        example: 'success',
                    },
                    message: {
                        type: 'string',
                        example: 'Operation successful',
                    },
                    data: { 
                        type: 'object',
                    }
                 }
            },
            HealthStatus: { 
                type: 'object',
                properties: {
                    status: { type: 'string', example: 'healthy' },
                    uptime: { type: 'number', example: 120.5 },
                    timestamp: { type: 'string', format: 'date-time', example: '2023-01-01T12:00:00Z' },
                    platform: { type: 'string', example: 'darwin' },
                    freemem: { type: 'integer', example: 1073741824 },
                    totalmem: { type: 'integer', example: 8589934592 },
                    loadavg: { type: 'array', items: { type: 'number' }, example: [0.5, 0.4, 0.3]}
                }
            }
        },
    },
  },
  apis: ['./src/index/index_router.ts', './src/**/*.router.ts'], // Include index_router and other routers
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export default swaggerSpec; 