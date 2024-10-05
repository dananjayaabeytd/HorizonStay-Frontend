import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SupplementService } from '../../../../../services/supplement/supplement.service';

@Component({
  selector: 'app-supplement',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './supplement.component.html',
})
export class SupplementComponent implements OnInit {
  supplementForm: FormGroup;
  newSupplementForm: FormGroup;
  seasonID: any;
  supplements: any[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private supplementService: SupplementService
  ) {
    this.supplementForm = this.fb.group({
      supplementName: ['', Validators.required],
      price: ['', Validators.required]
    });

    this.newSupplementForm = this.fb.group({
      supplementName: ['', Validators.required],
      price: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadSupplements();
  }

  async loadSupplements() {
    try {
      this.seasonID = this.route.snapshot.paramMap.get('id');
      const token: string | null = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found');
      }
      const response = await this.supplementService.getSupplementsBySeasonId(this.seasonID, token).toPromise();
      console.log('Supplements API Response:', response);

      if (response) {
        this.supplements = response.map((supplement: any) => ({
          ...supplement,
          form: this.fb.group({
            supplementName: [supplement.supplementName, Validators.required],
            price: [supplement.price, Validators.required]
          })
        }));
      } else {
        console.log('No Supplements found.');
      }
    } catch (error: any) {
      console.error('Error loading supplements:', error);
    }
  }

  async onSubmitSupplementDetails(supplement: any) {
    if (supplement.form.invalid) {
      return;
    }
    const token: string | null = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found');
      return;
    }
    try {
      console.log('Supplement Form Data:', supplement.form.value);
      const response = await this.supplementService.updateSupplement(supplement.id, supplement.form.value, token).toPromise();
      console.log('Supplement updated:', response);
      this.loadSupplements();
    } catch (error: any) {
      console.error('Error updating supplement:', error);
    }
  }

  async onAddNewSupplement() {
    if (this.newSupplementForm.invalid) {
      return;
    }
    const token: string | null = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found');
      return;
    }
    try {
      console.log('New Supplement Form Data:', this.newSupplementForm.value);
      const response = await this.supplementService.addSupplementToSeason(this.seasonID, this.newSupplementForm.value, token).toPromise();
      console.log('New Supplement added:', response);
      this.loadSupplements();
      this.newSupplementForm.reset();
    } catch (error: any) {
      console.error('Error adding new supplement:', error);
    }
  }

  async onDeleteSupplement(supplementId: number) {
    const token: string | null = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found');
      return;
    }
    try {
      const response = await this.supplementService.deleteSupplement(supplementId, token).toPromise();
      console.log('Supplement deleted:', response);
      this.loadSupplements();
    } catch (error: any) {
      console.error('Error deleting supplement:', error);
    }
  }
}