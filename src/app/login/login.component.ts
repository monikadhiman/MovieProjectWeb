import { Component, OnInit } from '@angular/core';
import { AccountService } from '../services/account.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  insertForm: FormGroup;
  Username: FormControl;
  Password: FormControl;
  returnUrl: string;
  ErrorMessage: string;
  invalidLogin: boolean;


  constructor(private acct: AccountService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,

  ) { }

  onSubmit() {
    let userlogin = this.insertForm.value;

    this.acct.login(userlogin.Username, userlogin.Password).subscribe(result => {

      let token = (<any>result).token;
      console.log(token);
      console.log(result.userRole);
      console.log('User Logged In Successfully');
      this.invalidLogin = false;
      console.log(this.returnUrl);
      this.router.navigateByUrl(this.returnUrl);

    },
      error => {
        this.invalidLogin = true;

        this.ErrorMessage = error.error.loginError;

        console.log(this.ErrorMessage);
      });

  }

  ngOnInit() {

    // Initialize Form Controls
    this.Username = new FormControl('', [Validators.required]);
    this.Password = new FormControl('', [Validators.required]);

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    // Initialize FormGroup using FormBuilder
    this.insertForm = this.fb.group({
      'Username': this.Username,
      'Password': this.Password

    });

  }



}
