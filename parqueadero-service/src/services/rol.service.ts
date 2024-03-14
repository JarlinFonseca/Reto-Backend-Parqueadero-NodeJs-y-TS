
import { RolEntity } from "../entities/rol.entity";
import { ErrorException } from "../exceptions/ErrorException";
import { RolRepository } from "../repositories/rol.repository";
import { HttpResponse } from "../shared/response/http.response";

export class RolService  {

    private rolRepositoy = new RolRepository();

    constructor(private readonly httpResponse: HttpResponse = new HttpResponse()) {
       
      }

      async findRolById(id: number): Promise<RolEntity | null > {
        const rolEntity = await (await this.rolRepositoy.execRepository).findOneBy({ id });
        if(!rolEntity){
            throw new ErrorException(`El rol con ID: ${id} no existe`, 404);
        }

        return rolEntity;
      }


}