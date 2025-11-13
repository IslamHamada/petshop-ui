import {Component, inject} from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import {UserService} from './user.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  userService = inject(UserService)
}
