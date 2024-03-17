import { NextImageResponse } from "./dtos/NextImageResponse";

export function createErrorResponse(errorCode: number, message?: string){
    const response = {
        statusCode: errorCode,
        body: message,
        headers: {
            "Access-Control-Allow-Headers" : "*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST,GET"
        },
    };
    return response;
}

export function createSuccessResponse(message?: string){
    const response = {
        statusCode: 200,
        body: message,
        headers: {
            "Access-Control-Allow-Headers" : "*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST,GET"
        },
    };
    return response;
}


export function createDateRespoinse(data: NextImageResponse){
    const response = {
        statusCode: 200,
        headers: {
            'Content-Type': 'image/jpeg',
            "Access-Control-Allow-Headers" : "image/jpeg",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET"
        },
        isBase64Encoded: true,
        body: JSON.stringify(data)
    };

    return response;
}