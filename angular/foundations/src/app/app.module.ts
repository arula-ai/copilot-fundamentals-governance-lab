import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { CustomerDetailComponent } from './components/customer-detail/customer-detail.component';
import { FormatPipe } from './utils/format.pipe';

// Outdated imports and poor organization
import { DateHelperService } from './utils/date-helper.service';
import { ValidationService } from './utils/validation.service';
import { CustomerService } from './data/customer.service';
import { OrderRepositoryService } from './data/order-repository.service';
import { ApiClientService } from './data/api-client.service';

@NgModule({
  declarations: [
    AppComponent,
    OrderListComponent,
    CustomerDetailComponent,
    FormatPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    DateHelperService,
    ValidationService,
    CustomerService,
    OrderRepositoryService,
    ApiClientService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }