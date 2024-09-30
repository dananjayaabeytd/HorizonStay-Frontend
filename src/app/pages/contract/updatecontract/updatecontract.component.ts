import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ContractService } from '../../../services/contract/contract.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-updatecontract',
  standalone: true,
  templateUrl: './updatecontract.component.html',
  imports: [ReactiveFormsModule, CommonModule],
})
export class UpdatecontractComponent implements OnInit {
  form: FormGroup;
  roomImages: string[][][] = []; // To store room images
  contractId: any;
  contractData: any;

  constructor(
    private fb: FormBuilder,
    private contractService: ContractService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {
    // Initialize the form
    this.form = this.fb.group({
      validFrom: ['', Validators.required],
      validTo: ['', Validators.required],
      cancellationPolicy: ['', Validators.required],
      paymentPolicy: ['', Validators.required],
      seasons: this.fb.array([]), // Initialize seasons as a form array
    });
  }

  ngOnInit(): void {
    this.getContractById();
  }

  async getContractById() {
    this.contractId = this.route.snapshot.paramMap.get('id');
    const token = localStorage.getItem('token');

    if (!this.contractId || !token) {
      console.log('Contract ID or Token is required');
      return;
    }

    try {
      const contractDataResponse = await this.contractService.getContractById(
        this.contractId,
        token
      );
      this.populateForm(contractDataResponse);
    } catch (error) {
      console.error('Error fetching contract data:', error);
    }
  }

  async onSubmit() {
    this.contractId = this.route.snapshot.paramMap.get('id');
    const token = localStorage.getItem('token');

    if (!this.contractId || !token) {
      console.log('Contract ID or Token is required');
      return;
    }

    console.log('Form data:', this.form.value);

    try {
      const contractDataResponse = await this.contractService.updateContract(
        this.contractId,
        this.form.value,
        token
      );
      this.populateForm(contractDataResponse);
    } catch (error) {
      console.error('Error updating contract data:', error);
    }
  }

  populateForm(contractData: any) {
    this.form.patchValue({
      validFrom: contractData.validFrom,
      validTo: contractData.validTo,
      cancellationPolicy: contractData.cancellationPolicy,
      paymentPolicy: contractData.paymentPolicy,
    });

    for (const season of contractData.seasons) {
      const seasonFormGroup = this.fb.group({
        seasonName: [season.seasonName, Validators.required],
        validFrom: [season.validFrom, Validators.required],
        validTo: [season.validTo, Validators.required],
        roomTypes: this.fb.array([]),
        discounts: this.fb.array([]),
        markups: this.fb.array([]),
        supplements: this.fb.array([]), // Add supplements array
      });

      this.seasons.push(seasonFormGroup);

      // Loop through room types
      for (const room of season.roomTypes) {
        const roomTypeFormGroup = this.fb.group({
          roomTypeName: [room.roomTypeName, Validators.required],
          numberOfRooms: [
            room.numberOfRooms,
            [Validators.required, Validators.min(1)],
          ],
          maxNumberOfPersons: [
            room.maxNumberOfPersons,
            [Validators.required, Validators.min(1)],
          ],
          price: [room.price, [Validators.required, Validators.min(0)]],
          images: [room.roomTypeImages || []], // Ensure images is an array
        });

        this.roomTypes(this.seasons.length - 1).push(roomTypeFormGroup);
        this.roomImages[this.seasons.length - 1] =
          this.roomImages[this.seasons.length - 1] || [];
        this.roomImages[this.seasons.length - 1][
          this.roomTypes(this.seasons.length - 1).length - 1
        ] = (room.roomTypeImages || []).map((imageName: any) => `${imageName}`);
      }

      // Loop through discounts
      for (const discount of season.discounts) {
        const discountFormGroup = this.fb.group({
          discountName: [discount.discountName, Validators.required],
          discountAmount: [
            discount.percentage,
            [Validators.required, Validators.min(0)],
          ],
        });

        this.discounts(this.seasons.length - 1).push(discountFormGroup);
      }

      // Loop through markups
      for (const markup of season.markups) {
        const markupFormGroup = this.fb.group({
          markupName: [markup.markupName, Validators.required],
          markupAmount: [
            markup.percentage,
            [Validators.required, Validators.min(0)],
          ],
        });

        this.markups(this.seasons.length - 1).push(markupFormGroup);
      }

      // Loop through supplements
      for (const supplement of season.supplements) {
        const supplementFormGroup = this.fb.group({
          supplementName: [supplement.supplementName, Validators.required],
          price: [supplement.price, [Validators.required, Validators.min(0)]],
        });

        this.supplements(this.seasons.length - 1).push(supplementFormGroup);
      }
    }
  }

  get seasons(): FormArray {
    return this.form.get('seasons') as FormArray;
  }

  addSeason(): void {
    const seasonFormGroup = this.fb.group({
      seasonName: ['', Validators.required],
      validFrom: ['', Validators.required],
      validTo: ['', Validators.required],
      roomTypes: this.fb.array([]),
      discounts: this.fb.array([]),
      markups: this.fb.array([]),
      supplements: this.fb.array([]), // Add supplements array
    });

    this.seasons.push(seasonFormGroup);
    this.addRoomType(this.seasons.length - 1); // Add a default room type
  }

  removeSeason(index: number): void {
    this.seasons.removeAt(index);
  }

  roomTypes(index: number): FormArray {
    return this.seasons.at(index).get('roomTypes') as FormArray;
  }

  addRoomType(seasonIndex: number): void {
    const roomTypeFormGroup = this.fb.group({
      roomTypeName: ['', Validators.required],
      numberOfRooms: [0, [Validators.required, Validators.min(1)]],
      maxNumberOfPersons: [0, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]],
      images: [null], // Store uploaded images in the control
    });

    this.roomTypes(seasonIndex).push(roomTypeFormGroup);
  }

  removeRoom(seasonIndex: number, roomIndex: number): void {
    this.roomTypes(seasonIndex).removeAt(roomIndex);
  }

  discounts(seasonIndex: number): FormArray {
    return this.seasons.at(seasonIndex).get('discounts') as FormArray;
  }

  addDiscount(seasonIndex: number): void {
    const discountFormGroup = this.fb.group({
      discountName: ['', Validators.required],
      discountAmount: [0, [Validators.required, Validators.min(0)]],
    });

    this.discounts(seasonIndex).push(discountFormGroup);
  }

  removeDiscount(seasonIndex: number, discountIndex: number): void {
    this.discounts(seasonIndex).removeAt(discountIndex);
  }

  markups(seasonIndex: number): FormArray {
    return this.seasons.at(seasonIndex).get('markups') as FormArray;
  }

  addMarkup(seasonIndex: number): void {
    const markupFormGroup = this.fb.group({
      markupName: ['', Validators.required],
      markupAmount: [0, [Validators.required, Validators.min(0)]],
    });

    this.markups(seasonIndex).push(markupFormGroup);
  }

  removeMarkup(seasonIndex: number, markupIndex: number): void {
    this.markups(seasonIndex).removeAt(markupIndex);
  }

  // Getter for supplements array within a season
  supplements(seasonIndex: number): FormArray {
    return this.seasons.at(seasonIndex).get('supplements') as FormArray;
  }

  // Removing a supplement
  removeSupplement(seasonIndex: number, supplementIndex: number): void {
    this.supplements(seasonIndex).removeAt(supplementIndex);
  }

  // Adding a new supplement to a specific season
  addSupplement(seasonIndex: number): void {
    const supplementGroup = this.fb.group({
      supplementName: ['', Validators.required],
      price: [0, Validators.required],
    });

    this.supplements(seasonIndex).push(supplementGroup);
  }

  onImageUpload(event: Event, seasonIndex: number, roomIndex: number): void {
    const input = event.target as HTMLInputElement;
    const images = this.roomImages[seasonIndex] || [];

    if (input.files) {
      const fileList = Array.from(input.files);
      const imageUrls = fileList.map((file) => URL.createObjectURL(file));
      images[roomIndex] = imageUrls;
      this.roomImages[seasonIndex] = images;
      this.roomTypes(seasonIndex)
        .at(roomIndex)
        .get('images')
        ?.setValue(fileList.map((file) => file.name));
    }
  }
}
