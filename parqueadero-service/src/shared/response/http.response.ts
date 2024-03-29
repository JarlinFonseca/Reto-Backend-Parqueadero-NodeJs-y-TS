﻿import { Response } from "express";

enum HttpStatus{
    OK = 200,
    CREATED = 201,
    NO_CONTENT =204,
    NOT_FOUND = 404,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    INTERNAL_SERVER_ERROR = 500
}

export class HttpResponse{
    Ok(res: Response, data?: any): Response{
        return res.status(HttpStatus.OK).json(data);
    }

    Created(res: Response, data?: any): Response{
        return res.status(HttpStatus.CREATED).json(data);
    }

    NoContent(res: Response): Response{
        return res.status(HttpStatus.NO_CONTENT).send();
    }

    NotFound(res: Response, data?: any): Response{
        return res.status(HttpStatus.NOT_FOUND).json({
            status: HttpStatus.NOT_FOUND,
            statusMsg: "Not Found",
            error: data,
        });
    }

    Unauthorized(res: Response, data?: any): Response{
        return res.status(HttpStatus.UNAUTHORIZED).json({
            status: HttpStatus.UNAUTHORIZED,
            statusMsg: "Unauthorized",
            error: data,
        });
    }

    Forbidden(res: Response, data?: any): Response{
        return res.status(HttpStatus.FORBIDDEN).json({
            status: HttpStatus.FORBIDDEN,
            statusMsg: "Forbidden",
            error: data,
        });
    }

    Error(res: Response, data?: any): Response{
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            statusMsg: "Internal Server Error",
            error: data,
        });
    }


}