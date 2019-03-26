import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

@Component({
  selector: 'kt-description-gallery',
  templateUrl: './description-gallery.component.html',
  styleUrls: ['./description-gallery.component.scss']
})

export class DescriptionGalleryComponent implements OnChanges {
  @Input() data: any[] = [];

  @Input() currentIndex = 0;

  @Output() switchSlide: EventEmitter<number> = new EventEmitter();

  public readMoreData: any = [];

  private _maxAllowedCharacters = 300;

  ngOnChanges() {
    this.defineReadMoreData();
  }

  defineReadMoreData(): void {
    this.readMoreData = [];

    for (let i = 0; i < this.data.length; i++) {
      let characterCount = this._maxAllowedCharacters;
      this.readMoreData.push({
        content: []
      });

      for (const text of this.data[i].content) {
        const count = Math.min(characterCount, text.length);
        const cutText = text.substring(0, count);

        characterCount -= count;
        if (characterCount === 0) {
          if (
            cutText.length < text.length ||
            this.readMoreData[i].content.length < this.readMoreData[i].content.length
          ) {
            this.readMoreData[i].readMoreActive = true;
          }
          this.readMoreData[i].content.push(cutText + '...');
          break;
        } else {
          this.readMoreData[i].content.push(cutText);
        }
      }
    }
  }

  toggleSize(e: MouseEvent, item): void {
    e.preventDefault();
    item.showAll = !item.showAll;
  }

  nextSlide(e: MouseEvent): void {
    if (e) {
      e.preventDefault();
    }

    this.switchSlide.emit(this.currentIndex < this.data.length - 1 ? this.currentIndex + 1 : 0);
  }

  prevSlide(e): void {
    if (e) {
      e.preventDefault();
    }
    this.switchSlide.emit(this.currentIndex > 0 ? this.currentIndex - 1 : this.data.length - 1);
  }

  goToSlide(num): void {
    if (num !== null && num !== this.currentIndex) {
      num = Math.max(Math.min(num, this.data.length - 1), 0);
      this.switchSlide.emit(num);
    }
  }
}
