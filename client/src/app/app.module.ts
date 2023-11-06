import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainActivityComponent } from './component/main-activity/main-activity.component';
import { FormsModule } from '@angular/forms';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { MaterialUIModule } from './material-ui.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSliderModule } from '@angular/material/slider';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ColorPickerModule } from 'ngx-color-picker';
import { SocketService } from './services/SocketService/socket.service';
import { appReducer } from './app-state/app.reducer';

const config: SocketIoConfig = {
	url: 'http://localhost:8080',
  options: { }
}

@NgModule({
  declarations: [
    AppComponent,
    MainActivityComponent,
  ],
  imports: [
    BrowserModule,
    StoreModule.forRoot({}, {}),
    StoreModule.forFeature('app-state', appReducer),
    EffectsModule.forRoot([]),
    SocketIoModule.forRoot(config),
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    StoreDevtoolsModule.instrument({maxAge: 25, logOnly: !isDevMode()}),

    // MaterialUIModule
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatSliderModule,
    MatInputModule,
    MatRadioModule,
    MatSlideToggleModule,
    ColorPickerModule
  ],
  providers: [SocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
