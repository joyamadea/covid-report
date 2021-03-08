import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-add-victim',
  templateUrl: './add-victim.page.html',
  styleUrls: ['./add-victim.page.scss'],
})
export class AddVictimPage implements OnInit {
  items = [
    {
      id: '1',
      title: 'm',
      name: 'Male',
    },
    {
      id: '2',
      title: 'f',
      name: 'Female',
    },
  ];
  public formAdd: FormGroup;
  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  ngOnInit() {}

  ionViewWillEnter() {
    // this.push.hasPermission().then((res: any) => {
    //   if (res.isEnabled) {
    //     console.log('permission enabled');
    //   } else {
    //     console.log('permission disabled');
    //   }
    // });
  }

  async initForm() {
    this.formAdd = this.fb.group({
      name: new FormControl(null, Validators.compose([Validators.required])),
      age: new FormControl(null, Validators.compose([Validators.required])),
      address: new FormControl(null, Validators.compose([Validators.required])),
      gender: new FormControl(null, Validators.compose([Validators.required])),
      location: new FormControl(
        null,
        Validators.compose([Validators.required])
      ),
    });
  }

  get f() {
    return this.formAdd.controls;
  }
  addNew() {
    console.log(this.formAdd.value);
  }
}
