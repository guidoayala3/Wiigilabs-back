import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import AuthService from '../../services/AuthService';
import User from '../../models/User';
import Log from '../../models/Log';

// Mocking las dependencias
vi.mock('bcrypt');
vi.mock('jsonwebtoken');

// Mock explícito de los modelos de Sequelize
vi.mock('../../models/User', () => ({
  default: {
    findOne: vi.fn(),
    create: vi.fn(),
  },
}));
vi.mock('../../models/Log', () => ({
  default: {
    create: vi.fn(),
  },
}));

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Limpia todos los mocks antes de cada prueba
  });

  describe('isEmailRegistered', () => {
    it('should return true if the email is registered', async () => {
      (User.findOne as unknown as vi.Mock).mockResolvedValueOnce({ id: '1', email: 'juan.perez@example.com' });

      const result = await AuthService.isEmailRegistered('juan.perez@example.com');
      expect(result).toBe(true);
      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'juan.perez@example.com' } });
    });

    it('should return false if the email is not registered', async () => {
      (User.findOne as unknown as vi.Mock).mockResolvedValueOnce(null);

      const result = await AuthService.isEmailRegistered('invalid.email@example.com');
      expect(result).toBe(false);
    });
  });

  describe('login', () => {
    it('should return a token if login is successful', async () => {
      (User.findOne as unknown as vi.Mock).mockResolvedValueOnce({ id: '1', email: 'juan.perez@example.com', password: 'hashedPassword' });
      (bcrypt.compare as vi.Mock).mockResolvedValueOnce(true); // Mock de bcrypt
      (jwt.sign as vi.Mock).mockReturnValueOnce('fake-jwt-token'); // Mock de JWT

      const token = await AuthService.login('juan.perez@example.com', 'Contraseña123!');
      expect(token).toBe('fake-jwt-token');
      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'juan.perez@example.com' } });
      expect(bcrypt.compare).toHaveBeenCalledWith('Contraseña123!', 'hashedPassword');
      expect(Log.create).toHaveBeenCalledWith({ userId: '1', action: 'LOGIN' });
    });

    it('should throw error if user is not found', async () => {
      (User.findOne as unknown as vi.Mock).mockResolvedValueOnce(null);

      await expect(AuthService.login('nonexistent@example.com', 'Contraseña123!'))
        .rejects
        .toThrow('User not found');
    });

    it('should throw error if password is invalid', async () => {
      (User.findOne as unknown as vi.Mock).mockResolvedValueOnce({ id: '1', email: 'juan.perez@example.com', password: 'hashedPassword' });
      (bcrypt.compare as vi.Mock).mockResolvedValueOnce(false); // Mock de bcrypt

      await expect(AuthService.login('juan.perez@example.com', 'WrongPassword'))
        .rejects
        .toThrow('Invalid password');
    });
  });

  describe('register', () => {
    it('should return a token if registration is successful', async () => {
      (User.findOne as unknown as vi.Mock).mockResolvedValueOnce(null); // Email no registrado
      (User.create as unknown as vi.Mock).mockResolvedValueOnce({ id: '1', email: 'juan.perez@example.com', name: 'Juan Pérez' });
      (bcrypt.hash as vi.Mock).mockResolvedValueOnce('hashedPassword'); // Mock del hash
      (jwt.sign as vi.Mock).mockReturnValueOnce('fake-jwt-token'); // Mock de JWT

      const token = await AuthService.register('Juan Pérez', 'juan.perez@example.com', 'Contraseña123!');
      expect(token).toBe('fake-jwt-token');
      expect(User.create).toHaveBeenCalledWith({ name: 'Juan Pérez', email: 'juan.perez@example.com', password: 'hashedPassword' });
      expect(Log.create).toHaveBeenCalledWith({ userId: '1', action: 'REGISTER' });
    });

    it('should throw error if email is already registered', async () => {
      (User.findOne as unknown as vi.Mock).mockResolvedValueOnce({ id: '1', email: 'juan.perez@example.com' });

      await expect(AuthService.register('Juan Pérez', 'juan.perez@example.com', 'Contraseña123!'))
        .rejects
        .toThrow('El correo electrónico ya está registrado');
    });
  });
});
