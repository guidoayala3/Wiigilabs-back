import { Request, Response } from 'express';
import { sendResponse } from '../utils/responseUtil';


interface CustomRequest extends Request {
  user?: string | object;
}


export const health = (req: CustomRequest, res: Response): void => {
  try {
    const user = req.user;  
    sendResponse(res, 200, { 
      message: 'Servidor en funcionamiento', 
      data: { status: 'Healthy', user }
    });
  } catch (error) {
    sendResponse(res, 500, { message: 'Error en el servidor', error });
  }
};
