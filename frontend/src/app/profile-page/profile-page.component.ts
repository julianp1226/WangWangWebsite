import { Component } from '@angular/core';
import { FlaskapiService } from '../flaskapi.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css'
})
export class ProfilePageComponent {

  constructor(private router: Router, private flaskapiservice: FlaskapiService) { }
  ngOnInit() {
    this.flaskapiservice.profile()
      .subscribe((response) => { 
        console.log(response)
      })
  }

  firstName = "Trial"
  lastName = "Run"
}
