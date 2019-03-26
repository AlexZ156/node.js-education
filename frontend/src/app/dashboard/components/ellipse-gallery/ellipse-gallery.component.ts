import { Component, ElementRef, EventEmitter, HostBinding, HostListener, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'kt-ellipse-gallery',
  templateUrl: 'ellipse-gallery.component.html',
  styleUrls: ['./ellipse-gallery.component.scss']
})

export class EllipseGalleryComponent implements OnInit {
  @Input() data: any[] = [];
  @Input() slidesToShow = 5;
  @Input() slidesData = [];
  @Input() ellipseRatio = 0.5; // height / width
  @Input() lastSlideScale = 0.3; // from 0 to 1
  @Input() animDuration = 800; // ms
  @Input() shearFactor = 0.8; // from 0 to 1
  @Input() slideSize = 100;
  @Input() currentIndex = 0; // active slide index
  @Output() currentIndexChange: EventEmitter<number> = new EventEmitter();
  public slides: any[] = [];
  private ellipse = 2 * Math.PI;
  private ellipseLength = 0;
  private ellipseLengthKoef = 0;
  private direction = 1; // slide direction
  private isAnimationActive = false;
  private prevIndex = 0;
  private galleryHeight = 0;
  private galleryWidth = 0;

  constructor(private hostElem: ElementRef) {}

  ngOnInit() {
    for (let i = 0; i < this.data.length; i++) {
      this.slides.push({ index: i });
    }
    this.onWindowResize();
  }

  public nextSlide(e?: MouseEvent): void {
    if (e) {
      e.preventDefault();
    }
    if (!this.isAnimationActive) {
      this.prevIndex = this.currentIndex;
      if (this.currentIndex < this.slides.length - 1) {
        this.currentIndex++;
      } else {
        this.currentIndex = 0;
      }

      this.direction = 1;
      this.currentIndexChange.emit(this.currentIndex);
      this.setSlidesPosition(true);
    }
  }

  public prevSlide(e?: MouseEvent): void {
    if (e) {
      e.preventDefault();
    }
    if (!this.isAnimationActive) {
      this.prevIndex = this.currentIndex;
      if (this.currentIndex > 0) {
        this.currentIndex--;
      } else {
        this.currentIndex = this.slides.length - 1;
      }

      this.direction = -1;
      this.currentIndexChange.emit(this.currentIndex);
      this.setSlidesPosition(true);
    }
  }

  public goToSlide(num): void {
    if (num !== null && num !== this.currentIndex && !this.isAnimationActive) {
      this.prevIndex = this.currentIndex;
      num = Math.max(Math.min(num, this.slides.length - 1), 0);
      this.direction = this.getDirectionByIndex(num);
      this.currentIndex = num;
      this.currentIndexChange.emit(this.currentIndex);
      this.setSlidesPosition(true);
    }
  }

  private getDirectionByIndex(i: number): number {
    let arr = this.data.map((item, index) => index);
    const leftArr = arr.slice();
    const rightArr = arr.slice().reverse();
    arr = leftArr.concat(arr).concat(rightArr);
    const leftIndex = arr.indexOf(i);
    const middleIndex = arr.indexOf(this.currentIndex, leftIndex);
    const rightIndex = arr.indexOf(i, middleIndex);

    return middleIndex - leftIndex > rightIndex - middleIndex ? 1 : -1;
  }

  private defineSlideVisibility(): void {
    const slidesIndexArr = this.getSlidesIndexByNum(this.currentIndex);
    const step = this.ellipse / this.slidesToShow;
    const diff = this.ellipse - step * (this.slidesToShow - 1) * this.shearFactor;
    const hiddenPosition = (this.slidesToShow * step) - diff / 2;

    for (let i = 0; i < this.slides.length; i++) {
      const slide = this.slides[i];
      const arrayIndex = slidesIndexArr.indexOf(i);
      let currPosition = step * arrayIndex * this.shearFactor;

      if (arrayIndex !== -1 && arrayIndex !== 0 && arrayIndex !== slidesIndexArr.length - 1) {
        currPosition += this.ellipseLengthKoef * (slidesIndexArr.length - 1 - arrayIndex) * this.slideSize * (1 - this.lastSlideScale) / 5;
      }

      slide.prevPosition = slide.currentPosition;
      slide.currentPosition = arrayIndex !== -1 ? currPosition : hiddenPosition;
      slide.active = arrayIndex !== -1;

      if (typeof slide.prevPosition === 'undefined') {
        slide.prevPosition = slide.currentPosition;
      }
    }
  }

  private getSlidesIndexByNum(num): number[] {
    const diff = this.slides.length - (num + this.slidesToShow);
    let indexArr = this.slides.slice(num, num + this.slidesToShow);

    if (diff < 0) {
      indexArr = indexArr.concat(this.slides.slice(0, Math.abs(diff)));
    }

    return indexArr.map(({index}) => index);
  }

  private getSlideParams(slideItem, progress = 1): any {
    const scaleStep = (1 - this.lastSlideScale) / this.slidesToShow;
    let diff = slideItem.currentPosition - slideItem.prevPosition;

    if (diff * this.direction > 0) {
      diff = (-this.ellipse + Math.abs(diff)) * this.direction;
    }

    const value = Math.PI - slideItem.prevPosition - diff * progress;
    const left = this.galleryWidth / 2 * Math.cos(value) + this.galleryWidth / 2 - this.slideSize / 2;
    const top = this.galleryHeight / 2 * Math.sin(value) + this.galleryHeight / 2 - this.slideSize / 2;
    const scale = slideItem.active ? 1 - scaleStep * slideItem.currentPosition : 0;
    const scaleToAnimate = slideItem.params ? slideItem.params.scale : scale;

    return { left, top, scale, scaleToAnimate };
  }

  private setSlidesPosition(shouldAnimate = false): void {
    if (this.isAnimationActive) {
      return;
    }
    const waitArray = [];
    this.defineSlideVisibility();

    for (let i = 0; i < this.slides.length; i++) {
      const item = this.slides[i];

      if (shouldAnimate) {
        if (item.currentPosition !== item.prevPosition) {
          waitArray.push(this.animate(item));
        }
      } else {
        item.params = this.getSlideParams(item);
      }
    }

    if (shouldAnimate) {
      this.isAnimationActive = true;
      Promise.all(waitArray).then(() => {
        this.isAnimationActive = false;
      });
    }
  }

  private updateParams(): void {
    this.galleryWidth = this.hostElem.nativeElement.clientWidth;
    this.galleryHeight = this.galleryWidth * this.ellipseRatio;
    this.ellipseLength = Math.PI * (this.galleryWidth + this.galleryHeight) / 2;
    this.ellipseLengthKoef = this.ellipse / this.ellipseLength;
  }

  private animate(item): Promise<any> {
    item.params = this.getSlideParams(item);
    const prevScale = item.params.scaleToAnimate;
    const scaleDiff = prevScale - item.params.scale;

    return this.animation({
      duration: this.animDuration,
      draw: (progress) => {
        item.params = this.getSlideParams(item, progress);
        const { left, top } = item.params;
        const scale = prevScale - scaleDiff * progress;
        item.params.scaleToAnimate = scale;
      }
    });
  }

  private animation(options): Promise<any> {
    return new Promise(resolve => {
      const start = performance.now();
      const animate = (time) => {
        let timeFraction = (time - start) / options.duration;
        if (timeFraction > 1 || !this.isAnimationActive) {
          timeFraction = 1;
          resolve();
        }

        const progress = Math.max(Math.pow(timeFraction, 2), 0);

        options.draw(progress);

        if (timeFraction < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    });
  }

  @HostListener('window:resize') onWindowResize(): void {
    this.updateParams();
    this.setSlidesPosition();
  }

  @HostBinding('style.height') get height(): string {
    return `${this.galleryHeight}px`;
  }
}
