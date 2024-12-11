import { describe, it, expect, vi } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { sendResponse } from '../../utils/responseUtil';
import * as jwt from 'jsonwebtoken';

// Mock de sendResponse
vi.mock('../../utils/responseUtil', () => ({
  sendResponse: vi.fn(),
}));

// Interfaz extendida para incluir 'data' en Response
interface MockResponse extends Partial<Response> {
  statusCode?: number;
  data?: any;
}

describe('authMiddleware', () => {
  const mockNext: NextFunction = vi.fn();

  it('should respond with 401 if token is missing', () => {
    const mockReq = { headers: {} } as Partial<Request>;

    const mockRes: MockResponse = {
      statusCode: 0,
      data: null,
    };

    (sendResponse as vi.Mock).mockImplementation(
      (res: MockResponse, statusCode: number, data: any) => {
        res.statusCode = statusCode;
        res.data = data;
      }
    );

    authMiddleware(mockReq as Request, mockRes as Response, mockNext);

    expect(sendResponse).toHaveBeenCalledWith(mockRes, 401, {
      message: 'Authorization token required',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should respond with 401 if token is invalid', () => {
    const mockReq = {
      headers: { authorization: 'Bearer invalid.token' },
    } as Partial<Request>;

    const mockRes: MockResponse = {
      statusCode: 0,
      data: null,
    };

    // Simular un error al intentar verificar el token
    vi.spyOn(jwt, 'verify').mockImplementation(() => {
      throw new Error('Invalid token');
    });

    (sendResponse as vi.Mock).mockImplementation(
      (res: MockResponse, statusCode: number, data: any) => {
        res.statusCode = statusCode;
        res.data = data;
      }
    );

    authMiddleware(mockReq as Request, mockRes as Response, mockNext);

    expect(sendResponse).toHaveBeenCalledWith(mockRes, 401, {
      message: 'Invalid token',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should call next if token is valid', () => {
    const mockReq = {
      headers: { authorization: 'Bearer valid.token' },
    } as Partial<Request>;

    const mockRes: MockResponse = {};

    const decodedToken = { id: '123', name: 'Test User' }; // Simular un token decodificado

    // Espiar jwt.verify y simular un retorno exitoso
    vi.spyOn(jwt, 'verify').mockImplementation((token: string, secretOrPublicKey: any) => {
      // Verifica que el token tenga el formato esperado y que se pase el secreto
      expect(token).toBe('valid.token');
      expect(secretOrPublicKey).toBeDefined(); // En pruebas, no se necesita comprobar el valor exacto de JWT_SECRET
      return decodedToken; // Retorna el token decodificado simulado
    });

    authMiddleware(mockReq as Request, mockRes as Response, mockNext);

    // Verifica que `jwt.verify` fue llamado con los parámetros correctos
    expect(jwt.verify).toHaveBeenCalledWith(
      'valid.token',
      expect.anything()  // Verifica que el secreto esté definido (sin necesidad de especificar el valor exacto)
    );
    expect((mockReq as any).user).toEqual(decodedToken);
    expect(mockNext).toHaveBeenCalled();
    expect(sendResponse).not.toHaveBeenCalled();
  });
});
