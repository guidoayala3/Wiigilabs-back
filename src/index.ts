import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';  
import swaggerAutogen from 'swagger-autogen'; 
import authRoutes from './routes/authRoutes';
import sequelize from './config/database';
import path from 'path';
import generateSwagger from './swagger'; 


dotenv.config();

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Middleware para permitir solicitudes desde otros dominios (CORS)
app.use(cors());

// Rutas de autenticación
app.use('/auth', authRoutes);

// Generar la documentación Swagger antes de iniciar el servidor
generateSwagger().then(() => {
  // Definir la ruta para servir la documentación Swagger
  const swaggerDoc = path.join(__dirname, '../swagger_output.json');
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(require(swaggerDoc)));

  // Iniciar la conexión a la base de datos
  sequelize
    .authenticate()
    .then(() => {
      console.log('Conexión con la base de datos exitosa');
      
      // Iniciar el servidor después de la conexión exitosa
      const PORT = process.env.PORT || 5000;
      app.listen(PORT, () => {
        console.log(`Servidor corriendo en el puerto ${PORT}`);
      });
    })
    .catch((error) => {
      console.error('Error al conectar con la base de datos:', error);
      process.exit(1);  // Finalizar el proceso si no se puede conectar
    });
}).catch((error) => {
  console.error('Error generando la documentación Swagger:', error);
});
