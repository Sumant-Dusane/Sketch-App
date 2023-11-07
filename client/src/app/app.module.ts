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
import { SidebarComponent } from './component/sidebar/sidebar.component';
import { HeaderComponent } from './component/header/header.component';

const config: SocketIoConfig = {
	url: 'https://sketch-backend-nsbl.onrender.com/',
  options: { }
}

// const config: SocketIoConfig = {
// 	url: 'http://localhost:8080',
//   options: { }
// }

@NgModule({
  declarations: [
    AppComponent,
    MainActivityComponent,
    SidebarComponent,
    HeaderComponent
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
