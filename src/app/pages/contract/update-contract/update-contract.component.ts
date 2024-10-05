import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ContractService } from '../../../services/contract/contract.service';
import { CommonModule } from '@angular/common';
import { SeasonService } from '../../../services/season/season.service';

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
  seasons: any[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private contractService: ContractService,
    private seasonService: SeasonService
  ) {
    this.form = this.fb.group({
      validFrom: ['', Validators.required],
      validTo: ['', Validators.required],
      cancellationPolicy: ['', Validators.required],
      paymentPolicy: ['', Validators.required]
    });

    this.newSeasonForm = this.fb.group({
      seasonName: ['', Validators.required],
      validFrom: ['', Validators.required],
      validTo: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadContract();
    this.loadSeasons();
  }

  async loadContract() {
    try {
      this.contractID = this.route.snapshot.paramMap.get('id');
      const token: string | null = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found');
      }
      const response = await this.contractService.getContractById(
        this.contractID,
        token
      ).toPromise();
      console.log('API Response:', response);

      if (response) {
        this.form.patchValue({
          validFrom: response.validFrom,
          validTo: response.validTo,
          cancellationPolicy: response.cancellationPolicy,
          paymentPolicy: response.paymentPolicy
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
      const response = await this.seasonService.getSeasonsByContractId(
        this.contractID,
        token
      ).toPromise();
      console.log('Seasons API Response:', response);

      if (response) {
        this.seasons = response.map((season: any) => ({
          ...season,
          form: this.fb.group({
            seasonName: [season.seasonName, Validators.required],
            validFrom: [season.validFrom, Validators.required],
            validTo: [season.validTo, Validators.required]
          })
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
      return;
    }
    const token: string | null = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found');
      return;
    }
    try {
      console.log('Form Data:', this.form.value); // Log the form data
      const response = await this.contractService.updateContract(this.contractID, this.form.value, token).toPromise();
      console.log('Contract updated:', response);
      // this.router.navigate(['/contracts']);
    } catch (error: any) {
      console.error('Error updating contract:', error);
    }
  }

  async onSubmitSeason(season: any) {
    if (season.form.invalid) {
      return;
    }
    const token: string | null = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found');
      return;
    }
    try {
      console.log('Season Form Data:', season.form.value); // Log the season form data
      const response = await this.seasonService.updateSeason(season.id, season.form.value, token).toPromise();
      console.log('Season updated:', response);
      this.loadSeasons(); // Reload seasons after update
    } catch (error: any) {
      console.error('Error updating season:', error);
    }
  }

  async onAddNewSeason() {
    if (this.newSeasonForm.invalid) {
      return;
    }
    const token: string | null = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found');
      return;
    }
    try {
      console.log('New Season Form Data:', this.newSeasonForm.value); // Log the new season form data
      const response = await this.seasonService.addSeasonToContract(this.contractID, this.newSeasonForm.value, token).toPromise();
      console.log('New Season added:', response);
      this.loadSeasons(); // Reload seasons after adding new season
      this.newSeasonForm.reset(); // Reset the form after submission
    } catch (error: any) {
      console.error('Error adding new season:', error);
    }
  }

  async onDeleteSeason(seasonId: number) {
    const token: string | null = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found');
      return;
    }
    try {
      const response = await this.seasonService.deleteSeason(seasonId, token).toPromise();
      console.log('Season deleted:', response);
      this.loadSeasons(); // Reload seasons after deletion
    } catch (error: any) {
      console.error('Error deleting season:', error);
    }
  }

  navigateToSeasonDetails(seasonId: number) {
    this.router.navigate([`/season-details/${seasonId}`]);
  }
}