import { Location } from '@angular/common';
import { Component,Inject,OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs';
import { DishService } from '../services/dish.service';
import { Dish } from '../shared/dish';
import { Comment } from '../shared/comment';
import { flyInOut, visibility ,expand  } from '../animations/app.animation';



@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    },
    animations: [
      flyInOut(),
      visibility(),
      expand()
    ]
})
export class DishdetailComponent implements OnInit {


  dish!: Dish | any;

  dishCopy !: Dish | any;

  comment !: Comment;

  dishIds !: string[];
  prev !: string;
  next !: string;

  errMess !:string;

  visibility = 'shown';


  formComment !: FormGroup;
  @ViewChild('fform') commentFormDirective: any;

  formErrors: any = {
    'author': '',
    'comment': ''
  };

  validationMessages: any = {
    'author': {
      'required':      'Author is required.',
      'minlength':     'Author must be at least 2 characters long.',
      'maxlength':     'Author cannot be more than 25 characters long.'
    },
    'comment': {
      'required':      'Comment is required.'
    },
  };

  constructor(
    private dishService:DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    @Inject('BaseURL') public baseURL: string
  ) { 
    this.createForm();
  }

  ngOnInit(): void {

    this.dishService.getDishIds().subscribe(dishIds => this.dishIds = dishIds);

    this.route.params.pipe(switchMap((params: Params) =>{this.visibility = 'hidden';  return this.dishService.getDish(params['id']) ;}))
    .subscribe(dish => { this.dish = dish; this.dishCopy = dish; this.setPrevNext(dish.id); this.visibility = 'shown' }, errmess => this.errMess = <any>errmess);


  }

  goBack(){
    this.location.back();
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  createForm(){
    this.formComment = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      rating: [0],
      comment: ['', Validators.required]
    })
    this.formComment.valueChanges
      .subscribe(data => this.onValueChanged(data));
    this.onValueChanged(); // (re)set validation messages now
  }

  onValueChanged(data?: any) {
    if (!this.formComment) { return; }
    const form = this.formComment;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit(){
    this.comment = this.formComment.value
    console.log(this.comment);
    this.formComment.reset({
      author: '',
      rating: 0,
      message: ''
    });
    this.commentFormDirective.resetForm();

    this.comment.date = new Date().toISOString();

    this.dishCopy.comments.push(this.comment)

    this.dishService.putDish(this.dishCopy).subscribe(dish =>{
      this.dish = dish;
      this.dishCopy = dish;
    }, errmess => {
      this.dish = null;
      this.dishCopy = null;
      this.errMess = <any>errmess;
    })


  }

}
