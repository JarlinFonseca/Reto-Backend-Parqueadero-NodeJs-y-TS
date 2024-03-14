import * as jwt from 'jsonwebtoken';
import { PayloadToken } from '../auth/interfaces/auth.interface';
import { ErrorException } from '../exceptions/ErrorException';
export class TokenService {


    async obtenerIdDesdeToken(token: string): Promise<number> {
        // Verificar y decodificar el token
        const decodedToken: any = jwt.decode(token) as PayloadToken;
        if (!decodedToken) throw new ErrorException("Error al decodificar el token", 400);
        // Extraer el ID del payload
        const userId: number = decodedToken.id;
        return userId;
    }

    async getRolFromToken(token:string):Promise<string>{
        const decodedToken: any = jwt.decode(token) as PayloadToken;
        if (!decodedToken) throw new ErrorException("Error al decodificar el token", 400);
        // Extraer el ID del payload
        const rol:string = decodedToken.rol;
        return rol;
    }
}