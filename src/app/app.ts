import {Component, inject} from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import {UserService} from './user.service';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatBadgeModule} from '@angular/material/badge';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {SessionService} from './injectables/session/session.service';
import {environment} from '../environments/environment';
import {MatMenuModule} from "@angular/material/menu";
import {Notification} from "./models/Notification";
import {NotificationsRestAPI} from "./injectables/rest/notifications.restapi";
import {MatDividerModule} from "@angular/material/divider";

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    MatToolbarModule,
    MatBadgeModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.sass']
})
export class App {
  userService = inject(UserService)
  sessionService = inject(SessionService)
  readonly environment = environment;
  notificationRestAPI = inject(NotificationsRestAPI)

  notifications: Notification[] = [];

  ngOnInit() {
    this.userService.rxOnBackendId$<Notification[]>(id => this.notificationRestAPI.getUserNotifications(id))
        .subscribe(notifications => {
          this.notifications = notifications.reverse();
          this.userService.user.newNotificationsCount = notifications.filter(x => !x.read).length;
        })
  }
}
