import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlaskapiService } from '../flaskapi.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css'
})
export class CreateUserComponent implements OnInit {
 userForm: FormGroup; 
 constructor(private router: Router,private fb: FormBuilder,private flaskapiservice:FlaskapiService){}

 ngOnInit() {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      number: ['', [Validators.required, Validators.minLength(10)]]
    });
 }

 onSubmit() {
   console.log(this.userForm.value);
   this.flaskapiservice.postUser(this.userForm.value.firstName, this.userForm.value.lastName, this.userForm.value.number)
    .subscribe((response) => {
       if (response == "User has been inserted") {
         console.log("user inserted")
         this.userForm.reset();
       } else {
         console.log("user not inserted")
     }
   })
 }
}
