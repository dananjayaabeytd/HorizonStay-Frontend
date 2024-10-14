import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ContractService } from '../../../services/contract/contract.service';
import { CommonModule } from '@angular/common';
import { SeasonService } from '../../../services/season/season.service';
import { AlertService } from '../../../services/alert/alert.service';

@Component({
  selector: 'app-update-contract',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-contract.component.html',
})
export class UpdateContractComponent implements OnInit {
  form: FormGroup;
  newSeasonForm: FormGroup;
  contractID: any;
  hotelID: any;
  seasons: any[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private contractService: ContractService,
    private alertService: AlertService,
    private seasonService: SeasonService
  ) {
    this.form = this.fb.group({
      validFrom: ['', Validators.required],
      validTo: ['', Validators.required],
      cancellationPolicy: ['', Validators.required],
      paymentPolicy: ['', Validators.required],
    });

    this.newSeasonForm = this.fb.group({
      seasonName: ['', Validators.required],
      validFrom: ['', Validators.required],
      validTo: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadContract();
    this.loadSeasons();
  }

  async loadContract() {
    try {
      this.contractID = this.route.snapshot.paramMap.get('contractId');
      this.hotelID = this.route.snapshot.paramMap.get('hotelID');
      const token: string | null = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found');
      }
      const response = await this.contractService
        .getContractById(this.contractID, token)
        .toPromise();
      console.log('API Response:', response);

      if (response) {
        this.form.patchValue({
          validFrom: response.validFrom,
          validTo: response.validTo,
          cancellationPolicy: response.cancellationPolicy,
          paymentPolicy: response.paymentPolicy,
        });
      } else {
        console.log('No Contract found.');
      }
    } catch (error: any) {
      console.error('Error loading contract:', error);
    }
  }

  async loadSeasons() {
    try {
      const token: string | null = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found');
      }
      const response = await this.seasonService
        .getSeasonsByContractId(this.contractID, token)
        .toPromise();
      console.log('Seasons API Response:', response);

      if (response) {
        this.seasons = response.map((season: any) => ({
          ...season,
          form: this.fb.group({
            seasonName: [season.seasonName, Validators.required],
            validFrom: [season.validFrom, Validators.required],
            validTo: [season.validTo, Validators.required],
          }),
        }));
      } else {
        console.log('No Seasons found.');
      }
    } catch (error: any) {
      console.error('Error loading seasons:', error);
    }
  }

  async onSubmitContractDetails() {
    if (this.form.invalid) {
      this.alertService.showError(
        'All fields are required to update the contract details.'
      );
      return;
    }

    const validFrom = new Date(this.form.value.validFrom);
    const validTo = new Date(this.form.value.validTo);

    if (validFrom >= validTo) {
      this.alertService.showError(
        'The "Valid From" date must be before the "Valid To" date.'
      );
      return;
    }

    const confirmUpdate = await this.alertService.showConfirm(
      'Are you sure you want to Update Contract Details ?',
      'Do you want to proceed?',
      'Yes, proceed',
      'No, cancel'
    );

    const token: string | null = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found');
      return;
    }

    if (confirmUpdate) {
      try {
        console.log('Form Data:', this.form.value); // Log the form data

        const response = await this.contractService
          .updateContract(this.contractID, this.form.value, token)
          .toPromise();
        this.alertService.showSuccess('Details updated successfully.');
        console.log('Contract updated:', response);
      } catch (error: any) {
        this.alertService.showError(
          'Error occured while updating contract details.'
        );
        console.error('Error updating contract:', error);
      }
    }
  }

  async onSubmitSeason(season: any) {
    if (season.form.invalid) {
      this.alertService.showError(
        'All fields are required to update the Season details.'
      );
      return;
    }

    const seasonValidFrom = new Date(season.form.value.validFrom);
    const seasonValidTo = new Date(season.form.value.validTo);
    const contractValidFrom = new Date(this.form.value.validFrom);
    const contractValidTo = new Date(this.form.value.validTo);

    if (seasonValidFrom >= seasonValidTo) {
      this.alertService.showError(
        'The "Valid From" date must be before the "Valid To" date for the season.'
      );
      return;
    }

    if (
      seasonValidFrom < contractValidFrom ||
      seasonValidTo > contractValidTo
    ) {
      this.alertService.showError(
        'Season dates must lie between the contract valid dates.'
      );
      return;
    }

    const token: string | null = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found');
      return;
    }
    try {
      console.log('Season Form Data:', season.form.value); // Log the season form data
      const response = await this.seasonService
        .updateSeason(season.id, season.form.value, token)
        .toPromise();
      this.alertService.showSuccess('Season Details updated successfully.');
      console.log('Season updated:', response);
      this.loadSeasons(); // Reload seasons after update
    } catch (error: any) {
      this.alertService.showError(
        'Error occured while updating Season details.'
      );
      console.error('Error updating season:', error);
    }
  }

  async onAddNewSeason() {
    if (this.newSeasonForm.invalid) {
      this.alertService.showError(
        'All fields are required to Add a new Season.'
      );
      return;
    }

    const seasonValidFrom = new Date(this.newSeasonForm.value.validFrom);
    const seasonValidTo = new Date(this.newSeasonForm.value.validTo);
    const contractValidFrom = new Date(this.form.value.validFrom);
    const contractValidTo = new Date(this.form.value.validTo);

    if (seasonValidFrom >= seasonValidTo) {
      this.alertService.showError(
        'The "Valid From" date must be before the "Valid To" date for the new season.'
      );
      return;
    }

    if (
      seasonValidFrom < contractValidFrom ||
      seasonValidTo > contractValidTo
    ) {
      this.alertService.showError(
        'Season dates must lie between the contract valid dates.'
      );
      return;
    }

    const token: string | null = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found');
      return;
    }
    try {
      console.log('New Season Form Data:', this.newSeasonForm.value); // Log the new season form data
      const response = await this.seasonService
        .addSeasonToContract(this.contractID, this.newSeasonForm.value, token)
        .toPromise();
      this.alertService.showSuccess('New Season successfully.');
      console.log('New Season added:', response);
      this.loadSeasons(); // Reload seasons after adding new season
      this.newSeasonForm.reset(); // Reset the form after submission
    } catch (error: any) {
      this.alertService.showError('Error occured while Adding new Season.');
      console.error('Error adding new season:', error);
    }
  }

  async onDeleteSeason(seasonId: number) {
    const confirmDelete = await this.alertService.showConfirm(
      'Are you sure you want to delete this Season?',
      'Do you want to proceed?',
      'Yes, proceed',
      'No, cancel'
    );

    const token: string | null = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found');
      return;
    }

    if (confirmDelete) {
      try {
        const response = await this.seasonService
          .deleteSeason(seasonId, token)
          .toPromise();
        console.log('Season deleted:', response);
        this.loadSeasons(); // Reload seasons after deletion
      } catch (error: any) {
        console.error('Error deleting season:', error);
      }
    }
  }

  navigateToSeasonDetails(seasonId: number) {
    this.router.navigate([`/season-details/${seasonId}`], {
      queryParams: { hotelID: this.hotelID, contractID: this.contractID },
    });
  }
}
