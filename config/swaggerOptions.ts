// swaggerOptions.ts

import { IOptions } from 'swagger-jsdoc';

const options: IOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'My AdonisJS API',
      version: '1.0.0',
      description: 'API documentation for my AdonisJS project',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./app/Controllers/**/*.ts'], // Шлях до файлів, що містять Swagger коментарі
};

export default options;
