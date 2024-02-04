import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { formatCurrency } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class FlaskapiService {

  constructor(private httpClient: HttpClient) {}

  public postUser(firstName:any,lastName:any,number:any)
  {
    const formdata = new FormData();
    formdata.append("firstName",firstName);
    formdata.append("lastName",lastName);
    formdata.append("number", number);
    //console.log(formdata.get('firstName'));

    return this.httpClient.post('http://127.0.0.1:8887/newuser',formdata);
  }
}