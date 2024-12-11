import { login, register } from '../../controllers/AuthController'; // Asegúrate de que la ruta sea correcta
import  AuthService  from '../../services/AuthService'; // Asegúrate de que la ruta sea correcta
import  { validateRequiredFields, validatePassword }  from '../../utils/validationsUtils';
import { Request, Response } from 'express';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// Mocking de las dependencias
vi.mock('../../services/AuthService');
vi.mock('../../utils/validationsUtils');

describe('Auth Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {}; // Limpiar las propiedades de req
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    }; // Limpiar las propiedades de res
  });

  afterEach(() => {
    vi.clearAllMocks(); // Limpiar mocks después de cada prueba
  });

  describe('login', () => {
    it('should return 400 if email or password is missing', async () => {
      (validateRequiredFields as vi.Mock).mockReturnValue(false); // Usamos mockReturnValue para devolver un valor simple

      req.body = { email: '', password: '' };

      await login(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Email and password are required' });
    });

    it('should return 400 if password is invalid', async () => {
      (validatePassword as vi.Mock).mockReturnValue(false); // Usamos mockReturnValue para devolver un valor simple

      req.body = { email: 'test@example.com', password: '123' };

      await login(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid password' });
    });

    it('should return 200 if login is successful', async () => {
      (validatePassword as vi.Mock).mockReturnValue(true); // Simulamos una contraseña válida

      const mockUser = { id: '1', email: 'test@example.com', name: 'Test User' };
      (AuthService.login as vi.Mock).mockResolvedValue(mockUser); // Usamos mockResolvedValue para simular promesas

      req.body = { email: 'test@example.com', password: 'validpassword' };

      await login(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it('should return 500 if an error occurs', async () => {
      (validatePassword as vi.Mock).mockReturnValue(true); // Simulamos una contraseña válida

      const mockError = new Error('Simulated error');
      (AuthService.login as vi.Mock).mockRejectedValue(mockError); // Simulamos que la promesa se rechaza

      req.body = { email: 'test@example.com', password: 'validpassword' };

      await login(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
  });

  describe('register', () => {
    it('should return 400 if name, email, or password is missing', async () => {
      (validateRequiredFields as vi.Mock).mockReturnValue(false);

      req.body = { email: '', password: '' };

      await register(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Name, email, and password are required' });
    });

    it('should return 400 if email is already registered', async () => {
      (AuthService.register as vi.Mock).mockResolvedValue(null); // Simulamos un error de registro (correo ya registrado)

      req.body = { name: 'Test User', email: 'existing@example.com', password: 'validpassword' };

      await register(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Email is already registered' });
    });

    it('should return 400 if password is invalid', async () => {
      (validatePassword as vi.Mock).mockReturnValue(false);

      req.body = { name: 'Test User', email: 'test@example.com', password: '123' };

      await register(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid password' });
    });

    it('should return 201 if registration is successful', async () => {
      (AuthService.register as vi.Mock).mockResolvedValue({ id: '1', email: 'test@example.com', name: 'Test User' });

      req.body = { name: 'Test User', email: 'test@example.com', password: 'validpassword' };

      await register(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ id: '1', email: 'test@example.com', name: 'Test User' });
    });

    it('should return 500 if an error occurs', async () => {
      const mockError = new Error('Simulated error');
      (AuthService.register as vi.Mock).mockRejectedValue(mockError);

      req.body = { name: 'Test User', email: 'test@example.com', password: 'validpassword' };

      await register(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
  });
});
