import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlaskapiService } from '../flaskapi.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
 userForm: FormGroup; 
 constructor(private router: Router,private fb: FormBuilder,private flaskapiservice:FlaskapiService){}

 ngOnInit() {
    this.userForm = this.fb.group({
      email: ['', Validators.required],
      accessToken: ['', Validators.required],
    });
 }

 onSubmit() {
   console.log(this.userForm.value);
   this.flaskapiservice.login(this.userForm.value.email, this.userForm.value.accessToken)
    .subscribe((response) => {
       if (response == "Login Successful") {
         console.log("login successful")
         this.router.navigate(['/']);
       } else {
         console.log("Invalid Credentials")
     }
   })
 }
}
