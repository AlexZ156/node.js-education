import { NgModule } from '@angular/core';
import { DashboardPage } from './dashboard.page';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { EllipseGalleryComponent } from './components/ellipse-gallery/ellipse-gallery.component';
import { CommonModule } from '@angular/common';
import { DescriptionGalleryComponent } from './components/description-gallery/description-gallery.component';

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule
  ],
  declarations: [
    DashboardPage,
    EllipseGalleryComponent,
    DescriptionGalleryComponent
  ],
  exports: [
    DashboardPage
  ]
})

export class DashboardModule {}
