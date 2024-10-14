import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DiscountService } from '../../../../../services/discount/discount.service';
import { AlertService } from '../../../../../services/alert/alert.service';

@Component({
  selector: 'app-discount',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './discount.component.html',
})
export class DiscountComponent implements OnInit {
  discountForm: FormGroup;
  newDiscountForm: FormGroup;
  seasonID: any;
  discounts: any[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private discountService: DiscountService
  ) {
    this.discountForm = this.fb.group({
      discountName: ['', Validators.required],
      percentage: ['', Validators.required]
    });

    this.newDiscountForm = this.fb.group({
      discountName: ['', Validators.required],
      percentage: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadDiscounts();
  }

  async loadDiscounts() {
    try {
      this.seasonID = this.route.snapshot.paramMap.get('id');
      const token: string | null = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found');
      }
      const response = await this.discountService.getDiscountsBySeasonId(this.seasonID, token).toPromise();
      console.log('Discounts API Response:', response);

      if (response) {
        this.discounts = response.map((discount: any) => ({
          ...discount,
          form: this.fb.group({
            discountName: [discount.discountName, Validators.required],
            percentage: [discount.percentage, Validators.required]
          })
        }));
      } else {
        console.log('No Discounts found.');
      }
    } catch (error: any) {
      console.error('Error loading discounts:', error);
    }
  }

  async onSubmitDiscountDetails(discount: any) {
    if (discount.form.invalid) {
      this.alertService.showError('All fields are required');
      return;
    }
    const token: string | null = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found');
      return;
    }
    try {
      console.log('Discount Form Data:', discount.form.value);
      console.log('updated values->',discount.form.value);
      const response = await this.discountService.updateDiscount(discount.id, discount.form.value, token).toPromise();
      this.alertService.showSuccess('Discount Updated Successfully');
      console.log('Discount updated:', response);
      this.loadDiscounts();
    } catch (error: any) {
      this.alertService.showError('Error occurred while updating Discount');
      console.error('Error updating discount:', error);
    }
  }

  async onAddNewDiscount() {
    if (this.newDiscountForm.invalid) {
      this.alertService.showError('All fields are required');
      return;
    }
    const token: string | null = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found');
      return;
    }
    try {
      console.log('New Discount Form Data:', this.newDiscountForm.value);
      const response = await this.discountService.addDiscountToSeason(this.seasonID, this.newDiscountForm.value, token).toPromise();
      console.log('New Discount added:', response);
      this.alertService.showSuccess('Discount Added Successfully');
      this.loadDiscounts();
      this.newDiscountForm.reset();
    } catch (error: any) {
      this.alertService.showError('Error occurred while Adding Discount');
      console.error('Error adding new discount:', error);
    }
  }

  async onDeleteDiscount(discountId: number) {

    const confirmDelete = await this.alertService.showConfirm(
      'Are you sure you want to Delete this Discount?',
      'Do you want to proceed?',
      'Yes, proceed',
      'No, cancel'
    );

    if (!confirmDelete) return;

    const token: string | null = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found');
      return;
    }
    try {
      const response = await this.discountService.deleteDiscount(discountId, token).toPromise();
      console.log('Discount deleted:', response);
      this.alertService.showSuccess('Markup Deleted Successfully');
      this.loadDiscounts();
    } catch (error: any) {
      console.error('Error deleting discount:', error);
      this.alertService.showError('Error occurred while deleting markup');
    }
  }
}