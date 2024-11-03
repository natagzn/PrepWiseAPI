/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route';

import "./routes/api";

Route.get('/', async () => {
  return { hello: 'world' };
});

/*import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from '../config/swagger';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'


// Використання HttpContextContract для типізації
Route.get('/api-docs', async ({ request, response }: HttpContextContract) => {
  response.type('text/html'); // Встановлення типу контенту як HTML
  response.send(swaggerUi.setup(swaggerSpec)); // Відправлення документації Swagger
});

// Додавання JSON-версії специфікації Swagger
Route.get('/swagger.json', async ({ response }: HttpContextContract) => {
  response.type('application/json');
  response.send(swaggerSpec);
});*/
/*
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from '../config/swagger';

Route.get('/api-docs', async ({ response }) => {
  // Налаштування Swagger UI
  response.header('Content-Type', 'text/html');
  const swaggerHtml = swaggerUi.generateHTML(swaggerSpec);
  response.send(swaggerHtml);
});*/


