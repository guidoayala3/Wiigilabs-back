// src/swagger.ts
import swaggerAutogen from 'swagger-autogen';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const outputFile = path.join(__dirname, '../swagger_output.json');  
const endpointsFiles = [path.join(__dirname, 'routes/authRoutes.ts')];  

const doc = {
  info: {
    title: 'WIIGILABS API',
    description: 'Documentación de la API de ejemplo',
  },
  host: 'localhost:5000',
  schemes: ['http'],
  definitions: {
    User: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'ID del usuario', example: 'c9b1c4d2-e658-4ef4-9c72-d5a52bff1b9b' },
        name: { type: 'string', description: 'Nombre del usuario', example: 'Juan Pérez' },
        email: { type: 'string', description: 'Correo electrónico del usuario', example: 'juan.perez@example.com' },
        password: { type: 'string', description: 'Contraseña del usuario', example: 'Contraseña123!' },
        createdAt: { type: 'string', format: 'date-time', description: 'Fecha de creación', example: '2024-12-11T10:00:00Z' },
        updatedAt: { type: 'string', format: 'date-time', description: 'Fecha de la última actualización', example: '2024-12-11T10:00:00Z' },
      },
    },
    Log: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'ID del log', example: '4b35d4a9-9379-4ef8-bdef-e89901fa215d' },
        userId: { type: 'string', description: 'ID del usuario que realizó la acción', example: 'c9b1c4d2-e658-4ef4-9c72-d5a52bff1b9b' },
        action: { type: 'string', description: 'Acción realizada por el usuario', example: 'LOGIN' },
        createdAt: { type: 'string', format: 'date-time', description: 'Fecha en que se registró el log', example: '2024-12-11T10:00:00Z' },
        updatedAt: { type: 'string', format: 'date-time', description: 'Fecha de la última actualización del log', example: '2024-12-11T10:00:00Z' },
      },
    },
  },
};

async function generateSwagger() {
  try {
    await swaggerAutogen(outputFile, endpointsFiles, doc);
    console.log('Swagger documentation generated!');
  } catch (error) {
    console.error('Error generating Swagger documentation:', error);
  }
}

// Exportar la función para usarla en otros archivos
export default generateSwagger;
