import { SwaggerConfig } from '@ioc:Adonis/Addons/Swagger';

export default {
  uiEnabled: true, //disable or enable swaggerUi route
  uiUrl: '/docs', // url path to swaggerUI
  specEnabled: true, //disable or enable swagger.json route
  specUrl: '/swagger.json',

  middleware: [], // middlewares array, for protect your swagger docs and spec endpoints

  //   ...swaggerSpec,
  options: {
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
  },

  mode: process.env.NODE_ENV === 'production' ? 'PRODUCTION' : 'RUNTIME',
  specFilePath: 'docs/swagger.json',
} as SwaggerConfig;
