import { Component, Input, OnInit } from '@angular/core';
import { Product } from 'src/app/classes/shop/product';
import { ProductService } from 'src/app/services/shop/product.service';
import { ActivatedRoute } from '@angular/router';
import {CartService} from '../../../services/shop/cart.service';
import {CartItem} from '../../../classes/shop/cart-item';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  @Input()
  customId: number;
  product: Product = new Product();

  constructor(private productService: ProductService,
              private cartService: CartService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
    });
  }

  handleProductDetails(): void {

    // get the "id" param string. convert string to a number using the "+" symbol
    let theProductId: number = +this.route.snapshot.paramMap.get('id');
    if (this.customId !== undefined){
      theProductId = this.customId;
    }

    this.productService.getProduct(theProductId).subscribe(
      data => {
        this.product = data;
      }
    );
  }


  addToCart(product: Product): void {
    this.cartService.addToCart(new CartItem(product));
  }
}
