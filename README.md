## Wiigilabs-back
Este proyecto es una API de backend construida con Node.js, TypeScript, Sequelize y PostgreSQL. Se utiliza Vitest para las pruebas unitarias y de integración.

##DB
Postgresql 
Para este proyecto, SQL es la mejor opción porque:

Las relaciones y restricciones son predecibles y estrictas (correo único, transacciones).
Fácil integración con herramientas de migración y modelado como Sequelize.
Beneficia la autenticación (consultas directas con índices en columnas clave como email).

Diagrama de Base de Datos POSTGRESQL
Estructura del Modelo
Usuarios:
+-------------------+
| Usuarios          |
+-------------------+
| id (PK, UUID)     |
| name              |
| email (Unique)    |
| password          |
| registered_by     |  (FK -> Usuarios.id)
| created_at        |
| updated_at        |
+-------------------+

+-------------------+
| Logs              |
+-------------------+
| id (PK, UUID)     |
| user_id (FK)      |
| action            | ('LOGIN' or 'REGISTER')
| timestamp         |
+-------------------+ 


## Install
npm install

.env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=wiigilabs
DB_USERNAME=postgres
DB_PASSWORD=admin
JWT_SECRET=testBackend2024

##Ejecucion
Migracion npm run migrate
Seeder npm run run-seeder-up
usuario por defecto 
{
  "email": "test@test.com",
  "password": "Admin123*"
}

ejecucion proyecto npm run dev
swagger http://localhost:3000/api-docs/

login POST http://localhost:3000/auth/login
{
  "email": "test@test.com",
  "password": "Admin123*"
}

registe POST http://localhost:3000/auth/register
{
  "name": "pedro",
  "email": "test131@test.com",
  "password": "Admin123*"
} + BearToken token

estado GET http://localhost:3000/auth/health
BearToken token

