import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MarkupService } from '../../../../../services/markup/markup.service';
import { AlertService } from '../../../../../services/alert/alert.service';

@Component({
  selector: 'app-markup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './markup.component.html',
})
export class MarkupComponent implements OnInit {
  markupForm: FormGroup;
  newMarkupForm: FormGroup;
  seasonID: any;
  markups: any[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private markupService: MarkupService
  ) {
    this.markupForm = this.fb.group({
      markupName: ['', Validators.required],
      percentage: ['', Validators.required],
    });

    this.newMarkupForm = this.fb.group({
      markupName: ['', Validators.required],
      percentage: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadMarkups();
  }

  async loadMarkups() {
    try {
      this.seasonID = this.route.snapshot.paramMap.get('id');
      const token: string | null = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found');
      }
      const response = await this.markupService
        .getMarkupsBySeasonId(this.seasonID, token)
        .toPromise();
      console.log('Markups API Response:', response);

      if (response) {
        this.markups = response.map((markup: any) => ({
          ...markup,
          form: this.fb.group({
            markupName: [markup.markupName, Validators.required],
            percentage: [markup.percentage, Validators.required],
          }),
        }));
      } else {
        console.log('No Markups found.');
      }
    } catch (error: any) {
      console.error('Error loading markups:', error);
    }
  }

  async onSubmitMarkupDetails(markup: any) {
    if (markup.form.invalid) {
      this.alertService.showError('All fields are required');
      return;
    }
    const token: string | null = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found');
      return;
    }
    try {
      console.log('Markup Form Data:', markup.form.value);
      const response = await this.markupService
        .updateMarkup(markup.id, markup.form.value, token)
        .toPromise();
      this.alertService.showSuccess('Markup Updated Successfully');
      console.log('Markup updated:', response);
      this.loadMarkups();
    } catch (error: any) {
      this.alertService.showError('Error occurred while updating markup');
      console.error('Error updating markup:', error);
    }
  }

  async onAddNewMarkup() {
    if (this.newMarkupForm.invalid) {
      this.alertService.showError('All fields are required');
      return;
    }
    const token: string | null = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found');
      return;
    }
    try {
      console.log('New Markup Form Data:', this.newMarkupForm.value);
      const response = await this.markupService
        .addMarkupToSeason(this.seasonID, this.newMarkupForm.value, token)
        .toPromise();
      console.log('New Markup added:', response);
      this.alertService.showSuccess('Markup Added Successfully');
      this.loadMarkups();
      this.newMarkupForm.reset();
    } catch (error: any) {
      this.alertService.showError('Error occurred while Adding markup');
      console.error('Error adding new markup:', error);
    }
  }

  async onDeleteMarkup(markupId: number) {
    const confirmDelete = await this.alertService.showConfirm(
      'Are you sure you want to Delete this Markup?',
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

    if (confirmDelete) {
      try {
        const response = await this.markupService
          .deleteMarkup(markupId, token)
          .toPromise();
        console.log('Markup deleted:', response);
        this.alertService.showSuccess('Markup Deleted Successfully');
        this.loadMarkups();
      } catch (error: any) {
        console.error('Error deleting markup:', error);
        this.alertService.showError('Error occurred while deleting markup');
      }
    }
  }
}
