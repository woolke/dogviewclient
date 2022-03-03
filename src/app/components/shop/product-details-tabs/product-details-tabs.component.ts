import {Component, OnInit} from '@angular/core';
import {Product} from 'src/app/classes/shop/product';
import {ProductService} from 'src/app/services/shop/product.service';
import {ActivatedRoute} from '@angular/router';
import {CartService} from '../../../services/shop/cart.service';

@Component({
  selector: 'app-product-details-tabs',
  templateUrl: './product-details-tabs.component.html',
  styleUrls: ['./product-details-tabs.component.css']
})
export class ProductDetailsTabsComponent implements OnInit {

  product: Product = new Product();
  tabIndex: number = 0;

  constructor(private productService: ProductService,
              public cartService: CartService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
    });
  }

  handleProductDetails(): void {
    // get the "id" param string. convert string to a number using the "+" symbol
    const theProductId: number = +this.route.snapshot.paramMap.get('id');
    this.productService.getProduct(theProductId).subscribe(
      data => {
        this.product = data;
        if (!this.cartService.getOpenProductTabsMap().has(theProductId)) {
          this.cartService.getOpenProductTabsMap().set(theProductId, data);
        }
        const tabsIds = Array.from(this.cartService.getOpenProductTabsMap().keys()).sort((a, b) => a - b);
        this.tabIndex = tabsIds.indexOf(theProductId);
      });
  }

  removeFromList(index: number, $event) {
    const keyList = Array.from(this.cartService.getOpenProductTabsMap().keys()).sort((a, b) => a - b);
    if (keyList.indexOf(index) >= this.tabIndex) {
      this.tabIndex--;
    }
    this.cartService.getOpenProductTabsMap().delete(index);
    $event.preventDefault();

  }
}
