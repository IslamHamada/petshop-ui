import {Component, inject} from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import {UserService} from './user.service';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatBadgeModule} from '@angular/material/badge';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {SessionService} from './injectables/session/session.service';
import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, MatToolbarModule, MatBadgeModule, MatButtonModule,
  MatIconModule],
  templateUrl: './app.html',
  styleUrls: ['./app.sass']
})
export class App {
  userService = inject(UserService)
  sessionService = inject(SessionService)
  readonly environment = environment;
}
