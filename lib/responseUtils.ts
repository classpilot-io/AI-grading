import { NextApiResponse } from 'next';
import { HTTP_STATUS_CODES } from './constants';

interface TypedResponse<T = any> {
    statusCode: number;
    hasError: boolean;
    errors?: string[];
    result?: T;
}

export function generateErrorResponse(res: NextApiResponse, errorMessage: string, errorCode = HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR, error?: Error): void {
    const responseBody: TypedResponse = {
        hasError: true,
        statusCode: errorCode,
        errors: [errorMessage]
    };
    return res.status(errorCode).send(responseBody);
}
export function generateResultResponse<T = any>(res: NextApiResponse, result: T): void {
    const responseBody: TypedResponse<T> = {
        statusCode: HTTP_STATUS_CODES.HTTP_SUCCESS,
        hasError: false,
        result: result,
        errors: []
    };
    return res.status(HTTP_STATUS_CODES.HTTP_SUCCESS).send(responseBody);
}