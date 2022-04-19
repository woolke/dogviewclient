import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AvatarModule} from 'ngx-avatar';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {HttpClientModule} from '@angular/common/http';
import {JwtModule} from '@auth0/angular-jwt';
import {ReactiveFormsModule} from '@angular/forms';
import {ProductListComponent} from './components/shop/product-list/product-list.component';
import {AppComponent} from './app.component';
import {ProductService} from './services/shop/product.service';
import {MaterialModule} from "./app-material-module";
import {ProductCategoryMenuComponent} from './components/shop/product-category-menu/product-category-menu.component';
import {SearchComponent} from './components/shop/search/search.component';
import {ProductDetailsComponent} from './components/shop/product-details/product-details.component';
import {CartStatusComponent} from './components/shop/cart-status/cart-status.component';
import {CartDetailsComponent} from './components/shop/cart-details/cart-details.component';
import {CheckoutComponent} from './components/shop/checkout/checkout.component';
import {LoginComponent} from './components/auth/login/login.component';
import {SERVER_HOST, TOKEN_KEY} from "./services/auth/token-storage.service";
import {FullcalendarComponent} from './components/calendar/fullcalendar/fullcalendar.component';
import {FullCalendarModule} from '@fullcalendar/angular'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid'; // a plugin!
import listPlugin from '@fullcalendar/list'; // a plugin!
import {ColorPickerModule} from 'ngx-color-picker';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import interactionPlugin from '@fullcalendar/interaction';
import {ProductDetailsTabsComponent} from './components/shop/product-details-tabs/product-details-tabs.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {EventEditComponent} from './components/calendar/event-edit/event-edit.component';
import {DialogComponent} from './components/calendar/dialog/dialog.component';
import {MapComponent} from './components/map/map/map.component';
import {PreviewComponent} from './components/map/preview/preview.component';
import { OclistComponent } from './components/oc/oclist/oclist.component';
import { PdfcanvaComponent } from './components/oc/pdfcanva/pdfcanva.component'; // a plugin!
import { NgxFileDropModule } from 'ngx-file-drop';
import { NotifierModule } from 'angular-notifier';

const routes: Routes = [
  {path: 'map', component: MapComponent},
  {path: 'map', component: MapComponent},
  {path: 'policypdfreader', component: PdfcanvaComponent},
  {path: 'edit-calendar-event', component: EventEditComponent},
  {path: 'calendar', component: FullcalendarComponent},
  {path: 'login', component: LoginComponent},
  {path: 'checkout', component: CheckoutComponent},
  {path: 'cart-details', component: CartDetailsComponent},
  {path: 'products/:id', component: ProductDetailsTabsComponent},
  {path: 'search/:keyword', component: ProductListComponent},
  {path: 'category/:id', component: ProductListComponent},
  {path: 'category', component: ProductListComponent},
  {path: 'products', component: ProductListComponent},
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: '**', redirectTo: '/login', pathMatch: 'full'}
];

export function tokenGetter() {
  return window.sessionStorage.getItem(TOKEN_KEY);
}

FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin,
  listPlugin,
  timeGridPlugin
]);


@NgModule({
  entryComponents: [
    PreviewComponent
  ],
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductCategoryMenuComponent,
    SearchComponent,
    ProductDetailsComponent,
    CartStatusComponent,
    CartDetailsComponent,
    CheckoutComponent,
    LoginComponent,
    FullcalendarComponent,
    ProductDetailsTabsComponent,
    EventEditComponent,
    DialogComponent,
    MapComponent,
    PreviewComponent,
    OclistComponent,
    PdfcanvaComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    FullCalendarModule,
    AvatarModule,
    MaterialModule,
    ColorPickerModule,
    LeafletModule,
    JwtModule.forRoot({
      config: {
        tokenGetter,
        allowedDomains: ['localhost:4200', SERVER_HOST],
        authScheme: "Bearer "
      }
    }),
    BrowserAnimationsModule,
    NgxFileDropModule,
    NotifierModule
  ],
  providers: [ProductService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
