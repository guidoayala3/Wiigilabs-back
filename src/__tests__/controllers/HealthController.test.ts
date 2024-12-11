import { describe, it, expect, vi } from 'vitest';
import { Request, Response } from 'express';
import { health } from '../../controllers/HealthController';
import { sendResponse } from '../../utils/responseUtil';

// Mock de `sendResponse`
vi.mock('../../utils/responseUtil', () => ({
  sendResponse: vi.fn(),
}));

// Extender el tipo Response para incluir `statusCode` y `data`
type MockResponse = Partial<Response> & {
  statusCode?: number;
  data?: any;
};

describe('health', () => {
  it('should respond with status 200 and a healthy message', () => {
    const mockReq = {
      user: { id: '123', name: 'Test User' },
    } as Partial<Request>;

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

    health(mockReq as Request, mockRes as Response);

    expect(sendResponse).toHaveBeenCalledWith(mockRes, 200, {
      message: 'Servidor en funcionamiento',
      data: { status: 'Healthy', user: { id: '123', name: 'Test User' } },
    });
  });

  it('should respond with status 500 if an error occurs', () => {
    const mockReq = {} as Partial<Request>;
    const mockRes: MockResponse = {
      statusCode: 0,
      data: null,
    };

    // Forzar un error simulando que `sendResponse` lanza una excepción
    (sendResponse as vi.Mock).mockImplementation(() => {
      throw new Error('Simulated error');
    });

    // Ejecutar la función health dentro de un bloque try-catch para capturar errores inesperados
    try {
      health(mockReq as Request, mockRes as Response);
    } catch (error) {
      console.error('Error capturado en el test:', error);
    }

    expect(sendResponse).toHaveBeenCalledWith(mockRes, 500, {
      message: 'Error en el servidor',
      error: expect.any(Error),
    });
  });
});
