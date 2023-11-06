import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainActivityComponent } from './component/main-activity/main-activity.component';
import { FormsModule } from '@angular/forms';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialUIModule } from './material-ui.module';
import { SocketService } from './services/SocketService/socket.service';

const config: SocketIoConfig = {
	url: 'https://sumant-dusane-sketch-backend.vercel.app/',
  options: { }
}

@NgModule({
  declarations: [
    AppComponent,
    MainActivityComponent,
  ],
  imports: [
    BrowserModule,
    SocketIoModule.forRoot(config),
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MaterialUIModule,
  ],
  providers: [SocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
