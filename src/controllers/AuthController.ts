import { Request, Response } from 'express';
import AuthService from '../services/AuthService';
import { sendResponse } from '../utils/responseUtil';
import { validateRequiredFields, validatePassword } from '../utils/validationUtil';


export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validar que los campos no estén vacíos
    const requiredFieldsError = validateRequiredFields([email, password]);
    if (!requiredFieldsError) {
      sendResponse(res, 400, { message: 'Email y contraseña son requeridos' });
      return;
    }

    const passwordValidationError = validatePassword(password);
    if (!passwordValidationError) {
      sendResponse(res, 400, { message: 'La contraseña debe tener al menos una letra mayúscula, un número, un carácter especial y un mínimo de 6 caracteres' });
      return;
    }


    const token = await AuthService.login(email, password);
    sendResponse(res, 200, { message: 'Login exitoso', data: { token } });
    return;
  } catch (error) {
    sendResponse(res, 500, { message: 'Error interno del servidor' });
    return;
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Validar que los campos no estén vacíos
    const requiredFieldsError = validateRequiredFields([name, email, password]);
    if (!requiredFieldsError) {
      sendResponse(res, 400, { message: 'Nombre, email y contraseña son requeridos' });
      return;
    }

    const validateMail = await AuthService.isEmailRegistered(email);
    if(validateMail){
      sendResponse(res, 400, { message: 'Este email no se puede registrar' });
      return;
    }

    const passwordValidationError = validatePassword(password);
    if (!passwordValidationError) {
      sendResponse(res, 400, { message: 'La contraseña debe tener al menos una letra mayúscula, un número, un carácter especial y un mínimo de 6 caracteres' });
      return;
    }

    await AuthService.register(name, email, password);  // No necesitamos el token
    sendResponse(res, 201, { message: 'Registro exitoso'  });
    return;
  } catch (error) {
    sendResponse(res, 500, { message: 'Error interno del servidor' });
    return;
  }
};
