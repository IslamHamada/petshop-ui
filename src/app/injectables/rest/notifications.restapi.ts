import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Notification} from "../../models/Notification";

@Injectable({
    providedIn: 'root'
})
export class NotificationsRestAPI {
    http: HttpClient = inject(HttpClient);

    getUserNotifications(userId : number){
        return this.http.get<Notification[]>(`${environment.gateway_url}/notifications/protected/${userId}`)
    }

    readNotifications(userId: number) {
        return this.http.put(`${environment.gateway_url}/notifications/protected/${userId}`, {});
    }
}