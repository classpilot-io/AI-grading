import { NextResponse } from "next/server";
import { HTTP_STATUS_CODES } from "./constants";

interface TypedResponse<T = any> {
  statusCode: number;
  hasError: boolean;
  errors?: string[];
  result?: T;
}

export function generateErrorResponse(
  errorMessage: string,
  errorCode = HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR,
  error?: Error
) {
  const responseBody: TypedResponse = {
    hasError: true,
    statusCode: errorCode,
    errors: [errorMessage],
  };

  return NextResponse.json(responseBody, { status: errorCode });
}

export function generateResultResponse<T = any>(result: T) {
  const responseBody: TypedResponse<T> = {
    statusCode: HTTP_STATUS_CODES.HTTP_SUCCESS,
    hasError: false,
    result,
    errors: [],
  };

  return NextResponse.json(responseBody, {
    status: HTTP_STATUS_CODES.HTTP_SUCCESS,
  });
}
