import { Component, Inject, OnInit } from '@angular/core';
import { expand, flyInOut } from '../animations/app.animation';
import { DishService } from '../services/dish.service';
import { LeaderService } from '../services/leader.service';
import { PromotionService } from '../services/promotion.service';
import { Dish } from '../shared/dish';
import { Leader } from '../shared/leader';
import { Promotion } from '../shared/promotion';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    },
    animations: [
      flyInOut(),
      expand()
    ]
})
export class HomeComponent implements OnInit {

  dish !: Dish;
  promotion !: Promotion;
  leader !: Leader;

  disheErrMess !: string;
  promotionErrMess !: string;
  leaderErrMess !: string;

  constructor(
    private dishService: DishService,
    private promotionService: PromotionService,
    private leaderService: LeaderService,
    @Inject('BaseURL') public baseURL: string) {
     }

  ngOnInit(): void {
     this.dishService.getFeaturedDish().subscribe(dish => this.dish = dish, errmess => this.disheErrMess = <any>errmess);
     this.promotionService.getFeaturedPromotion().subscribe(promotion => this.promotion = promotion, errmess => this.promotionErrMess = <any>errmess);
     this.leaderService.getFeaturedLeader().subscribe(leader => this.leader = leader, errmess => this.leaderErrMess = <any>errmess);
  }

}
