import {Component, inject} from '@angular/core';
import {UserService} from '../../user.service';
import {OrderRestAPI} from '../../injectables/rest/order.restapi';
import {Order} from '../../models/Order';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {UserProfile} from '../../models/UserProfile';
import {UserRestAPI} from '../../injectables/rest/user.restapi';
import {FormsModule} from '@angular/forms';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {SubmittingDirective} from '../../directives/submitting';
import {MatDividerModule} from '@angular/material/divider';
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {ReviewDialogComponent} from "../review_dialog/review_dialog.component";

@Component({
  selector: 'profile',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterLink,
    FormsModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    SubmittingDirective,
    MatDividerModule,
  ],
  templateUrl: 'profile.html',
  styleUrl: 'profile.sass',
})
export class ProfileComponent {
  userService = inject(UserService)
  userRestAPI = inject(UserRestAPI)
  orderRestAPI = inject(OrderRestAPI)
  fb = inject(FormBuilder);
  form = this.fb.nonNullable.group({
    firstName: [''],
    lastName: [''],
    phoneNumber: [''],
    country: [''],
    city: [''],
    postalCode: [''],
    street: [''],
    houseNumber: ['']
  })
  userProfile: UserProfile = new UserProfile();
  updated = false
  orderHistory : Order[] = [];

  init_loading = 2;
  update_profile_loading = false;

  ngOnInit() {
    this.userService.rxOnBackendId$<UserProfile>(id => this.userRestAPI.getUserProfile(id)).subscribe(
      userProfile => {
        this.userProfile = userProfile;
        this.form.patchValue({
          ...this.userProfile,
        })
        this.init_loading--;
      }
    );
    this.userService.rxOnBackendId$<Order[]>(id => this.orderRestAPI.getOrderHistory(id)).subscribe(
      orderHistory => {
        this.orderHistory = orderHistory;
        this.init_loading--;
      }
    );
  }

  saveProfileClick(){
    this.update_profile_loading = true;
    let profile = this.form.value;
    this.userProfile = {
      ...this.userProfile,
      ...profile
    }
    this.userService.rxOnBackendId$(id => this.userRestAPI.saveUserProfile(id, this.userProfile))
      .subscribe(()=> this.update_profile_loading = false);
  }

  dialog = inject(MatDialog);
  protected openReviewDialog(product_id : number, product_name : string, user_id : number) {
    this.dialog.open(ReviewDialogComponent, {
      height: '360px',
      width: '1280px',
      data: {
        product_id: product_id,
        product_name: product_name,
        user_id : user_id,
      }
    })
  }
}
