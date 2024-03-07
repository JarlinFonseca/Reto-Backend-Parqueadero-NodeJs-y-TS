import { BaseService } from "../config/base.service";
import { RolEntity } from "../entities/rol.entity";
import { ErrorException } from "../exceptions/ErrorException";
import { HttpResponse } from "../shared/response/http.response";

export class RolService extends BaseService<RolEntity> {

    private rolRepositoy = this.execRepository;

    constructor(private readonly httpResponse: HttpResponse = new HttpResponse()) {
        super(RolEntity);
      }

      async findRolById(id: number): Promise<RolEntity | null > {
        const rolEntity = await (await this.rolRepositoy).findOneBy({ id });
        if(!rolEntity){
            throw new ErrorException(`El rol con ID: ${id} no existe`, 404);
        }

        return rolEntity;
      }


}