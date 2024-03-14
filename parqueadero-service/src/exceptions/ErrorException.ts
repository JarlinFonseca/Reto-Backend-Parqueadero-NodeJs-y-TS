
export class ErrorException extends Error{
    mensaje: string;
    status: number;
    isExceptionOwnError: boolean;

    constructor(mensaje: string, status:number){
        super(mensaje);
        this.mensaje = mensaje;
        this.status = status;
        this.isExceptionOwnError= true;
    }
}