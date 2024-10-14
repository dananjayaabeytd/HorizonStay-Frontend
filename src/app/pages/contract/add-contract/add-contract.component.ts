import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContractService } from '../../../services/contract/contract.service';
import { SeasonService } from '../../../services/season/season.service';
import { RoomTypeService } from '../../../services/roomType/room-type.service';
import { DiscountService } from '../../../services/discount/discount.service';
import { MarkupService } from '../../../services/markup/markup.service';
import { SupplementService } from '../../../services/supplement/supplement.service';
import { AlertService } from '../../../services/alert/alert.service';

import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

interface ImageDetails {
  name: string;
  src: string;
  size: number;
  type: string;
}

@Component({
  selector: 'app-addcontract',
  standalone: true,
  templateUrl: './add-contract.component.html',
  imports: [ReactiveFormsModule, CommonModule],
})
export class AddContractComponent implements OnInit {
  form: FormGroup;
  roomImages: ImageDetails[][][] = [];
  hotelID: any;
  contractID: any;
  seasonID: any;
  isContractSubmitted = false; // New property to track submission state
  isSeasonSubmitted: boolean[] = []; // New property to track season submission state

  constructor(
    private fb: FormBuilder,
    private contractService: ContractService,
    private seasonService: SeasonService,
    private roomTypeService: RoomTypeService,
    private discountService: DiscountService,
    private markupService: MarkupService,
    private supplementService: SupplementService,
    private alertService: AlertService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      contractvalidFrom: ['', Validators.required],
      contractvalidTo: ['', Validators.required],
      cancellationPolicy: ['', Validators.required],
      paymentPolicy: ['', Validators.required],
      seasons: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.hotelID = this.route.snapshot.paramMap.get('id');
  }

  get seasons() {
    return this.form.get('seasons') as FormArray;
  }

  addSeason() {
    const seasonGroup = this.fb.group({
      seasonName: ['', Validators.required],
      validFrom: ['', Validators.required],
      validTo: ['', Validators.required],
      roomTypes: this.fb.array([]),
      discounts: this.fb.array([]),
      markups: this.fb.array([]),
      supplements: this.fb.array([]),
    });

    this.seasons.push(seasonGroup);
    this.roomImages.push([]);
    this.isSeasonSubmitted.push(false); // Initialize the submission state for the new season
  }

  removeSeason(index: number) {
    this.seasons.removeAt(index);
    this.roomImages.splice(index, 1);
    this.isSeasonSubmitted.splice(index, 1); // Remove the submission state for the removed season
  }

  roomTypes(seasonIndex: number) {
    return this.seasons.at(seasonIndex).get('roomTypes') as FormArray;
  }

  addRoomType(seasonIndex: number) {
    const roomTypeGroup = this.fb.group({
      roomTypeName: ['', Validators.required],
      numberOfRooms: ['', Validators.required],
      maxNumberOfPersons: ['', Validators.required],
      price: ['', Validators.required],
      images: [''],
    });

    this.roomTypes(seasonIndex).push(roomTypeGroup);
    this.roomImages[seasonIndex].push([]);
  }

  removeRoom(seasonIndex: number, roomIndex: number) {
    this.roomTypes(seasonIndex).removeAt(roomIndex);
    this.roomImages[seasonIndex].splice(roomIndex, 1);
  }

  onImageUpload(event: any, seasonIndex: number, roomIndex: number) {
    const files = Array.from(event.target.files) as File[];
    const imagePreviews: ImageDetails[] = [];

    files.forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        imagePreviews.push({
          name: file.name,
          src: e.target.result,
          size: file.size,
          type: file.type,
        });
        this.roomImages[seasonIndex][roomIndex] = imagePreviews;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    });
  }

  discounts(seasonIndex: number) {
    return this.seasons.at(seasonIndex).get('discounts') as FormArray;
  }

  addDiscount(seasonIndex: number) {
    const discountGroup = this.fb.group({
      discountName: ['', Validators.required],
      percentage: [0, Validators.required],
    });

    this.discounts(seasonIndex).push(discountGroup);
  }

  removeDiscount(seasonIndex: number, discountIndex: number) {
    this.discounts(seasonIndex).removeAt(discountIndex);
  }

  markups(seasonIndex: number) {
    return this.seasons.at(seasonIndex).get('markups') as FormArray;
  }

  addMarkup(seasonIndex: number) {
    const markupGroup = this.fb.group({
      markupName: ['', Validators.required],
      percentage: [0, Validators.required],
    });

    this.markups(seasonIndex).push(markupGroup);
  }

  removeMarkup(seasonIndex: number, markupIndex: number) {
    this.markups(seasonIndex).removeAt(markupIndex);
  }

  supplements(seasonIndex: number) {
    return this.seasons.at(seasonIndex).get('supplements') as FormArray;
  }

  addSupplement(seasonIndex: number) {
    const supplementGroup = this.fb.group({
      supplementName: ['', Validators.required],
      price: [0, Validators.required],
    });

    this.supplements(seasonIndex).push(supplementGroup);
  }

  removeSupplement(seasonIndex: number, supplementIndex: number) {
    this.supplements(seasonIndex).removeAt(supplementIndex);
  }

  navigateToContractList(hotelId: string) {
    this.router.navigate(['hotel/contracts', hotelId]);
  }

  async onSubmitContractDetails() {
    this.hotelID = this.route.snapshot.paramMap.get('id');

    if (this.form.valid) {
      const contractData = {
        validFrom: this.form.value.contractvalidFrom,
        validTo: this.form.value.contractvalidTo,
        cancellationPolicy: this.form.value.cancellationPolicy,
        paymentPolicy: this.form.value.paymentPolicy,
        seasons: [],
      };

      if (contractData.validFrom > contractData.validTo) {
        this.alertService.showError(
          'Contract valid from date cannot be greater than valid to date'
        );
        return;
      }

      // if (this.seasons.length === 0) {
      //   this.alertService.showError('At least one season is required');
      //   return;
      // }

      const token = localStorage.getItem('token');

      if (token) {
        try {
          const response = await this.contractService
            .addContract(this.hotelID, contractData, token)
            .toPromise();
          this.contractID = response.id;
          console.log('Main Details added successfully:', response);
          this.alertService.showSuccess('Main Details added successfully');
          this.isContractSubmitted = true; // Set to true upon successful submission
        } catch (error) {
          console.error('Error adding contract:', error);
        }
      }
    } else {
      this.alertService.showError('Please fill all the main details');
      console.log('Form is not valid');
    }
  }

  async onSubmitSeasonDetails(seasonIndex: number) {
    const season = this.seasons.at(seasonIndex).value;

    if (!season.seasonName || !season.validFrom || !season.validTo) {
      this.alertService.showError('Please fill all the season details');
      return;
    }

    if (season.validFrom > season.validTo) {
      this.alertService.showError(
        'Season valid from date cannot be greater than valid to date'
      );
      return;
    }

    if (
      season.validFrom < this.form.value.contractvalidFrom ||
      season.validTo > this.form.value.contractvalidTo
    ) {
      this.alertService.showError(
        'Season dates must be within the contract dates'
      );
      return;
    }

    const token = localStorage.getItem('token');

    if (token) {
      try {
        const response = await this.seasonService
          .addSeasonToContract(this.contractID, season, token)
          .toPromise();
        this.seasonID = response.id;
        this.alertService.showSuccess(season.seasonName + ' added successfully');
        console.log('Season added successfully:', response);
        this.isSeasonSubmitted[seasonIndex] = true; // Set to true upon successful submission
      } catch (error) {
        console.error('Error adding season:', error);
        this.alertService.showError('Error occured when adding '+ season.seasonName);
      }
    }
  }

  // async onSubmitSeasonDetails(seasonIndex: number) {
  //   const season = this.seasons.at(seasonIndex).value;
  //   const token = localStorage.getItem('token');

  //   if (token) {
  //     try {
  //       const response = await this.seasonService.addSeasonToContract(
  //         this.contractID,
  //         season,
  //         token
  //       ).toPromise();
  //       this.seasonID = response.id;
  //       console.log('Season added successfully:', response);
  //       this.isSeasonSubmitted[seasonIndex] = true; // Set to true upon successful submission
  //     } catch (error) {
  //       console.error('Error adding season:', error);
  //     }
  //   }
  // }

  async onSubmitRoomTypeDetails(seasonIndex: number, roomIndex: number) {
    const roomType = this.roomTypes(seasonIndex).at(roomIndex).value;

    if (!roomType.roomTypeName || !roomType.numberOfRooms || !roomType.maxNumberOfPersons || !roomType.price) {
      this.alertService.showError('Please fill all the room type details');
      return;
    }

    const token = localStorage.getItem('token');

    if (token) {
      try {
        const response = await this.roomTypeService
          .addRoomTypeToSeason(
            this.seasonID,
            roomType,
            this.roomImages[seasonIndex][roomIndex].map((imageDetail) => {
              const byteString = atob(imageDetail.src.split(',')[1]);
              const arrayBuffer = new ArrayBuffer(byteString.length);
              const intArray = new Uint8Array(arrayBuffer);
              for (let i = 0; i < byteString.length; i++) {
                intArray[i] = byteString.charCodeAt(i);
              }
              return new File([arrayBuffer], imageDetail.name, {
                type: imageDetail.type,
              });
            }),
            token
          )
          .toPromise();
        this.alertService.showSuccess(roomType.roomTypeName + ' added successfully');
        console.log('Room type added successfully:', response);
      } catch (error) {
        this.alertService.showError('Error occured when adding '+ roomType.roomTypeName);
        console.error('Error adding room type:', error);
      }
    }
  }

  async onSubmitDiscountDetails(seasonIndex: number, discountIndex: number) {
    const discount = this.discounts(seasonIndex).at(discountIndex).value;

    if (!discount.discountName || discount.percentage === null) {
      this.alertService.showError('Please fill all the discount details');
      return;
    }

    const token = localStorage.getItem('token');

    if (token) {
      try {
        const response = await this.discountService
          .addDiscountToSeason(this.seasonID, discount, token)
          .toPromise();
        this.alertService.showSuccess(discount.discountNamee + ' added successfully');
        console.log('Discount added successfully:', response);
      } catch (error) {
        this.alertService.showError('Error occured when adding '+ discount.discountNamee);
        console.error('Error adding discount:', error);
      }
    }
  }

  async onSubmitMarkupDetails(seasonIndex: number, markupIndex: number) {
    const markup = this.markups(seasonIndex).at(markupIndex).value;

    if (!markup.markupName || markup.percentage === null) {
      this.alertService.showError('Please fill all the markup details');
      return;
    }

    const token = localStorage.getItem('token');

    if (token) {
      try {
        const response = await this.markupService
          .addMarkupToSeason(this.seasonID, markup, token)
          .toPromise();
        this.alertService.showSuccess(markup.markupName + ' added successfully');
        console.log('Markup added successfully:', response);
      } catch (error) {
        this.alertService.showError('Error occured when adding '+ markup.markupName);
        console.error('Error adding markup:', error);
      }
    }
  }

  async onSubmitSupplementDetails(
    seasonIndex: number,
    supplementIndex: number
  ) {
    const supplement = this.supplements(seasonIndex).at(supplementIndex).value;

    if (!supplement.supplementName || supplement.price === null) {
      this.alertService.showError('Please fill all the supplement details');
      return;
    }

    const token = localStorage.getItem('token');

    if (token) {
      try {
        const response = await this.supplementService
          .addSupplementToSeason(this.seasonID, supplement, token)
          .toPromise();
        this.alertService.showSuccess(supplement.supplementName + ' added successfully');
        console.log('Supplement added successfully:', response);
      } catch (error) {
        this.alertService.showError('Error occured when adding '+ supplement.supplementName);
        console.error('Error adding supplement:', error);
      }
    }
  }

  complete() {
    this.router.navigate(['hotel/contracts/', this.hotelID]);
  }
}
