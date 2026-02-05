export class User {
  auth0_id: string = "";
  backend_id: number = -1;
  username: string = "";
  email: string = "";
  token: string = "";
  cartItemCount: number = 0;
  loggedIn: boolean = false;
  newNotificationsCount: number = 0;
}
