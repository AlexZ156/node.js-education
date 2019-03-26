import { AfterViewInit, Component, ElementRef, HostListener, OnInit } from '@angular/core';

interface EyeParams {
  elem: HTMLElement;
  width: number;
  height: number;
  x: number;
  y: number;
  child: {
    elem: HTMLElement;
    width: number;
    height: number;
  };
}

@Component({
  selector: 'kt-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss']
})

export class LogoComponent implements AfterViewInit {
  public eyes: EyeParams[] = [];

  constructor(
    private _hostElem: ElementRef
  ) {}

  ngAfterViewInit() {
    const eyes = this._hostElem.nativeElement.querySelectorAll('.eye');
    for (let i = 0; i < eyes.length; i++) {
      const elem = eyes[i];
      const child = elem.firstChild;
      const params = {
        elem,
        child: {
          elem: child
        }
      };
      (<any>this.eyes).push(params);
    }
    this.updateParams();
  }

  @HostListener('window:resize') updateParams(): void {
    for (const obj of this.eyes) {
      const clientRect: any = obj.elem.getBoundingClientRect();
      const childClientRect = obj.child.elem.getBoundingClientRect();

      obj.width = clientRect.width;
      obj.height = clientRect.height;
      obj.x = clientRect.x;
      obj.y = clientRect.y;
      obj.child.width = childClientRect.width;
      obj.child.height = childClientRect.height;
    }
  }

  @HostListener('document:mousemove', ['$event']) oonMouseMove(e: MouseEvent): void {
    this.eyes.forEach((eye, i) => {
      const x0 = eye.x + eye.width / 2;
      const y0 = eye.y + eye.height / 2;
      const x1 = e.pageX;
      const y1 = e.pageY;
      const x = x1 - x0;
      const y = y1 - y0;
      const r = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
      let angle = 180 - Math.acos(x / r) * 180 / Math.PI;

      if (x >= 0 && y >= 0 || x <= 0 && y >= 0) {
        angle = 360 - angle;
      }
      const value = Math.PI + angle * Math.PI / 180;
      const left = (eye.width - eye.child.width) / 2 * Math.cos(value);
      const top = (eye.height - eye.child.height) / 2 * Math.sin(value);
      eye.child.elem.style.left = left + (eye.width - eye.child.width) / 2 + 'px';
      eye.child.elem.style.top = top + (eye.width - eye.child.width) / 2 + 'px';
    });
  }
}
