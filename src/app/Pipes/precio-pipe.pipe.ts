import { Pipe, PipeTransform } from '@angular/core';

const SEPARADOR = "0";
@Pipe({
  name: 'precioPipe'
})
export class PrecioPipe implements PipeTransform {

  private SEPARADORDECIMAL: string;
  private SEPARADORMILES: string;

  constructor() {
    // TODO comes from configuration settings
    this.SEPARADORDECIMAL = ",";
    this.SEPARADORMILES = ".";
  }

  transform(value: number | string, fractionSize: number = 2): string {
    let [ integer, fraccion = "" ] = (value || "").toString()
      .split(this.SEPARADORDECIMAL);

    fraccion = fractionSize > 0
      ? this.SEPARADORDECIMAL + (fraccion + SEPARADOR).substring(0, fractionSize)
      : "";

    integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, this.SEPARADORMILES);

    return integer + fraccion;
  }

  parse(value: string, fractionSize: number = 2): string {
    let [ integer, fraction = "" ] = (value || "").split(this.SEPARADORDECIMAL);

    integer = integer.replace(new RegExp(this.SEPARADORMILES, "g"), "");

    fraction = parseInt(fraction, 10) > 0 && fractionSize > 0
      ? this.SEPARADORDECIMAL + (fraction + SEPARADOR).substring(0, fractionSize)
      : "";

    return integer + fraction;
  }

}
