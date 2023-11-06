import { NgModule } from "@angular/core";
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSliderModule } from '@angular/material/slider';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ColorPickerModule } from 'ngx-color-picker';

@NgModule({
  declarations: [],
  exports: [
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatSliderModule,
    MatInputModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatTooltipModule,
    ColorPickerModule
  ]
})
export class MaterialUIModule { }
