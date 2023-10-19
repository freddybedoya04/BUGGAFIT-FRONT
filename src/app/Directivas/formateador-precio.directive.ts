import { Directive, ElementRef, HostListener } from '@angular/core';
import { PrecioPipe } from '../Pipes/precio-pipe.pipe';

@Directive({
  selector: '[FormateadorPrecio]'
})
export class FormateadorPrecioDirective {

  private el: HTMLInputElement;
  constructor(
    private elementRef: ElementRef,
    private precioPipe: PrecioPipe
  ) {
    this.el = this.elementRef.nativeElement;
  }
  ngOnInit() {
    this.el.value = this.precioPipe.transform(this.el.value);
  }

  @HostListener("focus", ["$event.target.value"])
  onFocus(value: any) {
    this.el.value = this.precioPipe.parse(value); // opossite of transform
  }

  @HostListener("blur", ["$event.target.value"])
  onBlur(value: any) {
    this.el.value = this.precioPipe.transform(value);
  }

}
