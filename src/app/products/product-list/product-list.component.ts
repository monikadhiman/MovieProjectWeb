import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Product } from '../../interfaces/product';
import { Observable, Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { AccountService } from '../../services/account.service';



@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {

  // For the FormControl - Adding products
  insertForm: FormGroup;
  name: FormControl;
  language: FormControl;
  description: FormControl;
  totalTime: FormControl;
  imageUrl: FormControl;
  price: FormControl;



  // Updating the Product
  updateForm: FormGroup;
  _name: FormControl;
  _language: FormControl;
  _description: FormControl;
  _totalTime: FormControl;
  _imageUrl: FormControl;
  _price: FormControl;
  _id: FormControl;


  // Add Modal
  @ViewChild('template') modal: TemplateRef<any>;

  // Update Modal
  @ViewChild('editTemplate') editmodal: TemplateRef<any>;


  // Modal properties
  modalMessage: string;
  modalRef: BsModalRef;
  selectedProduct: Product;
  products$: Observable<Product[]>;
  products: Product[] = [];
  userRoleStatus: string;


  // Datatables Properties
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  @ViewChild(DataTableDirective) dtElement: DataTableDirective;




  constructor(private productservice: ProductService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private chRef: ChangeDetectorRef,
    private router: Router,
    private acct: AccountService) { }

  /// Load Add New product Modal
  onAddProduct() {
    this.modalRef = this.modalService.show(this.modal);
  }

  // Method to Add new Product
  onSubmit() {
    let newProduct = this.insertForm.value;

    this.productservice.insertProduct(newProduct).subscribe(
      result => {
        this.productservice.clearCache();
        this.products$ = this.productservice.getProducts();

        this.products$.subscribe(newlist => {
          this.products = newlist;
          this.modalRef.hide();
          this.insertForm.reset();
          this.rerender();

        });
        console.log("New Movie added");

      },
      error => console.log('Could not add Movie')

    );

  }

  // We will use this method to destroy old table and re-render new table

  rerender() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first in the current context
      dtInstance.destroy();

      // Call the dtTrigger to rerender again
      this.dtTrigger.next();

    });
  }

  // Update an Existing Product
  onUpdate() {
    let editProduct = this.updateForm.value;
    this.productservice.updateProduct(editProduct.id, editProduct).subscribe(
      result => {
        console.log('Movie Updated');
        this.productservice.clearCache();
        this.products$ = this.productservice.getProducts();
        this.products$.subscribe(updatedlist => {
          this.products = updatedlist;

          this.modalRef.hide();
          this.rerender();
        });
      },
      error => console.log('Could Not Update Movie')
    );
  }

  // Load the update Modal

  onUpdateModal(productEdit: Product): void {
    this._id.setValue(productEdit.productId);
    this._name.setValue(productEdit.name);
    this._language.setValue(productEdit.language);
    this._description.setValue(productEdit.description);
    this._totalTime.setValue(productEdit.totalTime);
    this._imageUrl.setValue(productEdit.imageUrl);
    this._price.setValue(productEdit.price);



    this.updateForm.setValue({
      'id': this._id.value,
      'name': this._name.value,
      'language': this._language.value,
      'description': this._description.value,
      'totalTime': this._totalTime.value,
      'imageUrl': this._imageUrl.value,
      'price': this._price.value,
    });

    this.modalRef = this.modalService.show(this.editmodal);

  }

  // Method to Delete the product
  onDelete(product: Product): void {
    this.productservice.deleteProduct(product.productId).subscribe(result => {
      this.productservice.clearCache();
      this.products$ = this.productservice.getProducts();
      this.products$.subscribe(newlist => {
        this.products = newlist;

        this.rerender();
      });
    });
  }

  onSelect(product: Product): void {
    this.selectedProduct = product;

    this.router.navigateByUrl("/products/" + product.productId);
  }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 3,
      autoWidth: true,
      order: [[0, 'desc']]
    };

    this.products$ = this.productservice.getProducts();

    this.products$.subscribe(result => {
      this.products = result;

      this.chRef.detectChanges();

      this.dtTrigger.next();
    });

    this.acct.currentUserRole.subscribe(result => { this.userRoleStatus = result });


    // Modal Message
    this.modalMessage = "All Fields Are Mandatory";

    // Initializing Add product properties

    let validateImageUrl: string = '^(?:png|jpg)$';

    this.name = new FormControl('', [Validators.required, Validators.maxLength(50)]);
    this.price = new FormControl('', [Validators.required, Validators.min(0), Validators.max(10000)]);
    this.description = new FormControl('', [Validators.required, Validators.maxLength(150)]);
    this.imageUrl = new FormControl('', [Validators.pattern(validateImageUrl)]);
    this.totalTime = new FormControl('', [Validators.required]);
    this.language = new FormControl('', [Validators.required, Validators.maxLength(50)]);
    this.insertForm = this.fb.group({

      'name': this.name,
      'language': this.language,
      'description': this.description,
      'totalTime': this.totalTime,
      'imageUrl': this.imageUrl,
      'price': this.price,

    });

    // Initializing Update Product properties
    this._name = new FormControl('', [Validators.required, Validators.maxLength(50)]);
    this._language = new FormControl('', [Validators.required, Validators.maxLength(50)]);
    this._description = new FormControl('', [Validators.required, Validators.maxLength(150)]);
    this._totalTime = new FormControl('', [Validators.required]);
    this._imageUrl = new FormControl('', [Validators.pattern(validateImageUrl)]);
    this._price = new FormControl('', [Validators.required, Validators.min(0), Validators.max(10000)]);
    this._id = new FormControl();

    this.updateForm = this.fb.group(
      {
        'id': this._id,
        'name': this._name,
        'language': this._language,
        'description': this._description,
        'totalTime': this._totalTime,
        'imageUrl': this._imageUrl,
        'price': this._price,

      });


  }

  ngOnDestroy() {
    // Do not forget to unsubscribe
    this.dtTrigger.unsubscribe();
  }

}
