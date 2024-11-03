import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import swaggerOptions from './swaggerOptions';

const swaggerSpec = swaggerJsDoc(swaggerOptions);

export { swaggerUi, swaggerSpec };
