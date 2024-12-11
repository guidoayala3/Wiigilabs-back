import express from 'express';
import { register, login } from '../controllers/AuthController';
import { health } from '../controllers/HealthController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

// Ruta de login
/**
 * @swagger
 * /auth/login:
 *   post:
 *     description: Login de usuario
 *     parameters:
 *       - in: body
 *         name: user
 *         description: Información del usuario para login
 *         schema:
 *           type: object
 *           required:
 *             - email
 *             - password
 *           properties:
 *             email:
 *               type: string
 *               example: "juan.perez@example.com"
 *             password:
 *               type: string
 *               example: "Contraseña123!"
 *     responses:
 *       200:
 *         description: Login exitoso
 *       400:
 *         description: Error en los datos proporcionados
 */
router.post('/login', login);

// Ruta de registro (requiere autenticación)
router.post('/register', authMiddleware, register);

// Ruta de salud (requiere autenticación)
/**
 * @swagger
 * /auth/health:
 *   get:
 *     description: Verifica que el servidor está en funcionamiento
 *     responses:
 *       200:
 *         description: El servidor está en funcionamiento
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Servidor en funcionamiento"
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: "Healthy"
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "d19c1380-9560-4599-b846-8a5ef26d2a79"
 *                         iat:
 *                           type: integer
 *                           example: 1733931834
 *                         exp:
 *                           type: integer
 *                           example: 1734018234
 */
router.get('/health', authMiddleware, health);

export default router;
