import {Component, inject} from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import {UserService} from './user.service';
import {MatToolbar} from '@angular/material/toolbar';
import {MatBadge, MatBadgeModule} from '@angular/material/badge';
import {MatButton} from '@angular/material/button';
import {MatDivider} from '@angular/material/divider';
import {SessionService} from './session/session.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, MatToolbar, MatBadge, MatButton, MatDivider],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  userService = inject(UserService)
  sessionService = inject(SessionService)
}
