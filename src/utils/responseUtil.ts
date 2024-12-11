// src/utils/responseUtil.ts
import { Response } from 'express';

interface ResponseData {
  message: string;
  data?: any;
  error?: any;
}

export const sendResponse = (res: Response, statusCode: number, responseData: ResponseData): Response => {
  const response: any = {
    message: responseData.message || 'No message provided',  
  };

  if (responseData.data !== undefined && responseData.data !== null) {
    response.data = responseData.data;
  }

  if (responseData.error !== undefined && responseData.error !== null) {
    response.error = responseData.error;
  }

  return res.status(statusCode).json(response);
};
