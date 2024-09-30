import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ContractService } from '../../../services/contract/contract.service'; // Import the contract service
import { Router } from '@angular/router';

import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms'; // Import ReactiveFormsModule
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-addcontract',
  standalone: true,
  templateUrl: './addcontract.component.html',
  imports: [ReactiveFormsModule, CommonModule],
})
export class AddcontractComponent {
  form: FormGroup;
  roomImages: string[][][] = []; // Store only image names
  hotelID: any;

  constructor(
    private fb: FormBuilder,
    private contractService: ContractService,
    private readonly route:ActivatedRoute,
    private readonly router: Router
    
  ) {
    this.form = this.fb.group({
      contractvalidFrom: ['', Validators.required],
      contractvalidTo: ['', Validators.required],
      cancellationPolicy: ['', Validators.required],
      paymentPolicy: ['', Validators.required],
      seasons: this.fb.array([]),
    });
  }

  // Getter for accessing the seasons form array
  get seasons() {
    return this.form.get('seasons') as FormArray;
  }

  // Adding a new season
  addSeason() {
    const seasonGroup = this.fb.group({
      seasonName: ['', Validators.required],
      validFrom: ['', Validators.required],
      validTo: ['', Validators.required],
      roomTypes: this.fb.array([]),
      discounts: this.fb.array([]),
      markups: this.fb.array([]),
      supplements: this.fb.array([]), // Add supplements array
    });

    this.seasons.push(seasonGroup);
    this.roomImages.push([]); // Initialize an empty array for roomImages of this season
  }

  // Removing a season
  removeSeason(index: number) {
    this.seasons.removeAt(index);
    this.roomImages.splice(index, 1); // Remove corresponding roomImages for that season
  }

  // Getter for accessing room types of a specific season
  roomTypes(seasonIndex: number) {
    return this.seasons.at(seasonIndex).get('roomTypes') as FormArray;
  }

  // Adding a new room type to a specific season
  addRoomType(seasonIndex: number) {
    const roomTypeGroup = this.fb.group({
      roomTypeName: ['', Validators.required],
      numberOfRooms: ['', Validators.required],
      maxNumberOfPersons: ['', Validators.required],
      price: ['', Validators.required],
      images: [''], // Field for room type images
    });

    this.roomTypes(seasonIndex).push(roomTypeGroup);
    this.roomImages[seasonIndex].push([]); // Initialize empty array for roomImages of this room type
  }

  // Removing a room type from a specific season
  removeRoom(seasonIndex: number, roomIndex: number) {
    this.roomTypes(seasonIndex).removeAt(roomIndex);
    this.roomImages[seasonIndex].splice(roomIndex, 1); // Remove corresponding roomImages for that room type
  }

  // Handling image upload and preview
  onImageUpload(event: any, seasonIndex: number, roomIndex: number) {
    const files = event.target.files;
    const fileNames: string[] = [];

    for (let file of files) {
      fileNames.push(file.name); // Store only the image name
    }

    this.roomImages[seasonIndex][roomIndex] = fileNames;
  }

  // Getter for discounts array within a season
  discounts(seasonIndex: number) {
    return this.seasons.at(seasonIndex).get('discounts') as FormArray;
  }

  // Adding a new discount to a specific season
  addDiscount(seasonIndex: number) {
    const discountGroup = this.fb.group({
      discountName: ['', Validators.required],
      percentage: [0, Validators.required],
    });

    this.discounts(seasonIndex).push(discountGroup);
  }

  // Removing a discount
  removeDiscount(seasonIndex: number, discountIndex: number) {
    this.discounts(seasonIndex).removeAt(discountIndex);
  }

  // Getter for markups array within a season
  markups(seasonIndex: number) {
    return this.seasons.at(seasonIndex).get('markups') as FormArray;
  }

  // Adding a new markup to a specific season
  addMarkup(seasonIndex: number) {
    const markupGroup = this.fb.group({
      markupName: ['', Validators.required],
      percentage: [0, Validators.required],
    });

    this.markups(seasonIndex).push(markupGroup);
  }

  // Removing a markup
  removeMarkup(seasonIndex: number, markupIndex: number) {
    this.markups(seasonIndex).removeAt(markupIndex);
  }

  // Getter for supplements array within a season
  supplements(seasonIndex: number) {
    return this.seasons.at(seasonIndex).get('supplements') as FormArray;
  }

  // Adding a new supplement to a specific season
  addSupplement(seasonIndex: number) {
    const supplementGroup = this.fb.group({
      supplementName: ['', Validators.required],
      price: [0, Validators.required],
    });

    this.supplements(seasonIndex).push(supplementGroup);
  }

  // Removing a supplement
  removeSupplement(seasonIndex: number, supplementIndex: number) {
    this.supplements(seasonIndex).removeAt(supplementIndex);
  }

  navigateToContractList(hotelId: string) {
    this.router.navigate(['hotel/contracts', hotelId]);
  }

  // Form submission
  async onSubmit() {

    this.hotelID = this.route.snapshot.paramMap.get('id')

    if (this.form.valid) {
      // Map the form data to the desired format
      const contractData = {
        validFrom: this.form.value.contractvalidFrom,
        validTo: this.form.value.contractvalidTo,
        cancellationPolicy: this.form.value.cancellationPolicy,
        paymentPolicy: this.form.value.paymentPolicy,
        seasons: this.form.value.seasons.map(
          (season: any, seasonIndex: number) => ({
            seasonName: season.seasonName,
            validFrom: season.validFrom,
            validTo: season.validTo,
            roomTypes: season.roomTypes.map((room: any, roomIndex: number) => ({
              roomTypeName: room.roomTypeName,
              numberOfRooms: room.numberOfRooms,
              maxNumberOfPersons: room.maxNumberOfPersons,
              price: room.price,
              roomTypeImages: this.roomImages[seasonIndex][roomIndex], // Attach image names
            })),
            discounts: season.discounts,
            markups: season.markups,
            supplements: season.supplements, // Include supplements
          })
        ),
      };

      const token = localStorage.getItem('token');

      if (token) {
        try {
          // Send data to the backend
          const response = await this.contractService.addContract(
            this.hotelID,
            contractData,
            token
          );
          console.log('Contract added successfully:', response);
          this.navigateToContractList(this.hotelID)
        } catch (error) {
          console.error('Error adding contract:', error);
        }
      }
    } else {
      console.log('Form is not valid');
    }
  }
}