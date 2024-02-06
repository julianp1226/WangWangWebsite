import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { formatCurrency } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class FlaskapiService {

  constructor(private httpClient: HttpClient) {}

  public postUser(firstName: any, lastName: any, email: any, countryCode: any, accessToken: any, mobile: any, interests: any) {
    const formdata = new FormData();
    formdata.append("firstName", firstName);
    formdata.append("lastName", lastName);
    formdata.append("accessToken", accessToken);
    formdata.append("email", email);
    formdata.append("countryCode", countryCode);
    formdata.append("mobile", mobile);
    formdata.append("interests", interests);
    
    /*if (interests && interests.length > 0) {
        interests.forEach((interest, index) => {
            formdata.append(`interests[${index}]`, interest);
        });
    }  */

    return this.httpClient.post('http://127.0.0.1:8887/newuser', formdata);
  }

  public login(email: any, accessToken: any) {
    const formdata = new FormData();
    formdata.append("email", email);
    formdata.append("accessToken", accessToken);

    return this.httpClient.post('http://127.0.0.1:8887/login', formdata);
  }

  public profile() {
    return this.httpClient.get('http://127.0.0.1:8887/user')
  }
    
}