import moment from "moment-timezone";

export class FechaUtils{

     convertirFechaUtcAColombia(fechaUtc: Date): string {
        const fechaColombia = moment.utc(fechaUtc).tz('America/Bogota').format('YYYY-MM-DD HH:mm:ss');
        return fechaColombia;
      }

      fechaActualColombia(): Date{
        return moment().tz('America/Bogota').toDate();

      }

}