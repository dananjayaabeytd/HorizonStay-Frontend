import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BookingService } from '../../../services/booking/booking.service';
import { UsersService } from '../../../services/user/users.service';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

interface RoomType {
  roomTypeID: number;
  roomTypeName: string;
  price: number;
}

interface Supplement {
  supplementID: number;
  supplementName: string;
  price: number;
}

@Component({
  selector: 'app-makebooking',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './makebooking.component.html',
})
export class MakebookingComponent implements OnInit {
  bookingForm!: FormGroup;
  totalAmount: number = 0;
  discountAmount: number = 0;
  hotel: any;
  hotelID: any;

  dPercentage: number = 0;
  mPercentage: number = 0;

  availableRoomTypes: RoomType[] = [];
  availableSupplements: Supplement[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private bookingService: BookingService,
    private userService: UsersService,
    private userServicetoGetData: UsersService
  ) {}

  ngOnInit() {
    const state = history.state;

    if (state && state.hotel) {
      this.hotel = state.hotel;
      // console.log('Received hotel data:', this.hotel);

      if (this.hotel.roomTypeDTO && this.hotel.roomTypeDTO.length > 0) {
        this.availableRoomTypes = this.hotel.roomTypeDTO.map(
          (roomType: any) => ({
            roomTypeID: roomType.roomTypeID,
            roomTypeName: roomType.roomTypeName,
            price: roomType.price,
          })
        );
      }

      if (this.hotel.supplementDTOS && this.hotel.supplementDTOS.length > 0) {
        this.availableSupplements = this.hotel.supplementDTOS.map(
          (supplement: any) => ({
            supplementID: supplement.supplementID,
            supplementName: supplement.supplementName,
            price: supplement.price,
          })
        );
      }

      // Calculate total discount and markup percentages
      this.dPercentage = this.hotel.discountDTO.reduce(
        (sum: number, discount: any) => sum + discount.percentage,
        0
      );
      this.mPercentage = this.hotel.markupDTO.percentage;
      this.hotelID = this.hotel.hotelID;
    } else {
      console.error('No hotel data passed');
    }

    // Retrieve booking data from BookingService
    const bookingData = this.bookingService.getBookingData();
    // console.log('Booking data:', bookingData);

    // Ensure dates are properly formatted
    const checkInDate = bookingData.checkInDate
      ? this.formatDate(bookingData.checkInDate)
      : '';
    const checkOutDate = bookingData.checkOutDate
      ? this.formatDate(bookingData.checkOutDate)
      : '';

    this.bookingForm = this.fb.group({
      fullName: ['', Validators.required],
      telephone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      checkIn: [checkInDate, Validators.required],
      checkOut: [checkOutDate, Validators.required],
      noOfAdults: [
        bookingData.adultCount || 1,
        [Validators.required, Validators.min(1)],
      ],
      noOfChildren: [bookingData.childCount || 0, Validators.min(0)],
      roomTypes: this.fb.array([]),
      supplements: this.fb.array([]),
    });

    if (this.hotel) {
      this.initializeFormWithHotelData(this.hotel);
    }

    // Initialize with one room type and one supplement
    this.addRoomType();
    this.addSupplement();
  }

  formatDate(date: string): string {
    const d = new Date(date);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  }

  initializeFormWithHotelData(hotel: any) {
    const bookingData = this.bookingService.getBookingData();
    // console.log(bookingData);

    this.bookingForm.patchValue({
      fullName: hotel.fullName || '',
      telephone: hotel.telephone || '',
      email: hotel.email || '',
      address: hotel.address || '',
      city: hotel.city || '',
      country: hotel.country || '',
      checkIn: bookingData.checkInDate
        ? this.formatDate(bookingData.checkInDate)
        : '',
      checkOut: bookingData.checkOutDate
        ? this.formatDate(bookingData.checkOutDate)
        : '',
      noOfAdults: bookingData.adultCount || 1,
      noOfChildren: bookingData.childCount || 0,
    });

    if (hotel.roomTypeDTO) {
      hotel.roomTypeDTO.forEach((roomType: any) => this.addRoomType(roomType));
    }

    if (hotel.supplementDTOS) {
      hotel.supplementDTOS.forEach((supplement: any) =>
        this.addSupplement(supplement)
      );
    }
  }

  get roomTypes(): FormArray {
    return this.bookingForm.get('roomTypes') as FormArray;
  }

  get supplements(): FormArray {
    return this.bookingForm.get('supplements') as FormArray;
  }

  addRoomType(roomTypeData?: any) {
    const roomTypeFormGroup = this.fb.group({
      roomTypeID: [roomTypeData?.roomTypeID || null], // Add roomTypeID control
      roomTypeName: [roomTypeData?.roomTypeName || '', Validators.required],
      price: [
        { value: roomTypeData?.price || 0, disabled: true },
        Validators.required,
      ],
      numberOfRooms: [
        roomTypeData?.numberOfRooms || 1,
        [Validators.required, Validators.min(1)],
      ],
    });
    this.roomTypes.push(roomTypeFormGroup);
    roomTypeFormGroup
      .get('numberOfRooms')
      ?.valueChanges.subscribe(() =>
        this.updateRoomTypePrice(roomTypeFormGroup)
      );
  }

  removeRoomType(index: number) {
    this.roomTypes.removeAt(index);
  }

  addSupplement(supplementData?: any) {
    const supplementFormGroup = this.fb.group({
      supplementID: [supplementData?.supplementID || null], // Add supplementID control
      supplementName: [
        supplementData?.supplementName || '',
        Validators.required,
      ],
      price: [
        { value: supplementData?.price || 0, disabled: true },
        Validators.required,
      ],
      quantity: [
        supplementData?.quantity || 1,
        [Validators.required, Validators.min(1)],
      ],
    });
    this.supplements.push(supplementFormGroup);
    supplementFormGroup
      .get('quantity')
      ?.valueChanges.subscribe(() =>
        this.updateSupplementPrice(supplementFormGroup)
      );
  }

  removeSupplement(index: number) {
    this.supplements.removeAt(index);
  }

  onRoomTypeChange(index: number) {
    const selectedRoomTypeName = this.roomTypes
      .at(index)
      .get('roomTypeName')?.value;
    const selectedRoomType = this.availableRoomTypes.find(
      (room) => room.roomTypeName === selectedRoomTypeName
    );

    if (selectedRoomType) {
      this.roomTypes.at(index).get('price')?.setValue(selectedRoomType.price);
      this.roomTypes
        .at(index)
        .get('roomTypeID')
        ?.setValue(selectedRoomType.roomTypeID); // Set roomTypeID
      this.updateRoomTypePrice(this.roomTypes.at(index) as FormGroup);
    }
  }

  onSupplementChange(index: number) {
    const selectedSupplementName = this.supplements
      .at(index)
      .get('supplementName')?.value;
    const selectedSupplement = this.availableSupplements.find(
      (supplement) => supplement.supplementName === selectedSupplementName
    );

    if (selectedSupplement) {
      this.supplements
        .at(index)
        .get('price')
        ?.setValue(selectedSupplement.price);
      this.supplements
        .at(index)
        .get('supplementID')
        ?.setValue(selectedSupplement.supplementID); // Set supplementID
      this.updateSupplementPrice(this.supplements.at(index) as FormGroup);
    }
  }

  updateRoomTypePrice(roomTypeFormGroup: FormGroup) {
    const roomTypeName = roomTypeFormGroup.get('roomTypeName')?.value;
    const numberOfRooms = roomTypeFormGroup.get('numberOfRooms')?.value;
    const selectedRoomType = this.availableRoomTypes.find(
      (room) => room.roomTypeName === roomTypeName
    );

    if (selectedRoomType) {
      const totalPrice = selectedRoomType.price * numberOfRooms;
      roomTypeFormGroup.get('price')?.setValue(totalPrice);
      roomTypeFormGroup
        .get('roomTypeID')
        ?.setValue(selectedRoomType.roomTypeID); // Set roomTypeID
    }
  }

  updateSupplementPrice(supplementFormGroup: FormGroup) {
    const supplementName = supplementFormGroup.get('supplementName')?.value;
    const quantity = supplementFormGroup.get('quantity')?.value;
    const selectedSupplement = this.availableSupplements.find(
      (supplement) => supplement.supplementName === supplementName
    );

    if (selectedSupplement) {
      const totalPrice = selectedSupplement.price * quantity;
      supplementFormGroup.get('price')?.setValue(totalPrice);
      supplementFormGroup
        .get('supplementID')
        ?.setValue(selectedSupplement.supplementID); // Set supplementID
    }
  }

  onSubmit() {
    if (this.bookingForm.valid) {
      const formValue = this.bookingForm.getRawValue();
      console.log('Form Submitted', formValue);
    }
  }

  calculatePayableAmount() {
    const formValue = this.bookingForm.getRawValue();
    console.log('form values ->', formValue);

    const payload = {
      supplements: formValue.supplements.map((supplement: any) => ({
        supplementID: supplement.supplementID,
        name: supplement.supplementName,
        price: supplement.price,
        quantity: supplement.quantity,
      })),
      checkIn: formValue.checkIn,
      checkOut: formValue.checkOut,
      roomTypes: formValue.roomTypes.map((roomType: any) => ({
        roomTypeID: roomType.roomTypeID,
        name: roomType.roomTypeName,
        price: roomType.price,
        numberOfRooms: roomType.numberOfRooms,
      })),
      noOfAdults: formValue.noOfAdults,
      noOfChildren: formValue.noOfChildren,
      discountPercentage: this.dPercentage,
      markupPercentage: this.mPercentage,
    };

    console.log('payload -> ', payload);

    this.bookingService
      .calculateAmount(payload)
      .then((response: any) => {
        console.log(response);

        this.totalAmount = response.payableAmount;
        this.discountAmount = response.discountAmount;
      })
      .catch((error: any) => {
        console.error('Error calculating total amount:', error);
      });
  }

  makeBooking() {
    if (this.bookingForm.valid) {
      const formValue = this.bookingForm.getRawValue();

      // Combine room types and supplements into a single items array
      const items = [
        ...formValue.roomTypes.map((roomType: any) => ({
          name: roomType.roomTypeName,
          price: roomType.price,
          quantity: roomType.numberOfRooms,
          totalAmount: roomType.price * roomType.numberOfRooms,
        })),
        ...formValue.supplements.map((supplement: any) => ({
          name: supplement.supplementName,
          price: supplement.price,
          quantity: supplement.quantity,
          totalAmount: supplement.price * supplement.quantity,
        })),
      ];

      const payload = {
        systemUserId: '',
        fullName: formValue.fullName,
        telephone: formValue.telephone,
        email: formValue.email,
        hotelID: this.hotelID,
        address: formValue.address,
        city: formValue.city,
        country: formValue.country,
        checkIn: formValue.checkIn,
        checkOut: formValue.checkOut,
        noOfAdults: formValue.noOfAdults,
        noOfChildren: formValue.noOfChildren,
        discount: this.totalAmount,
        payableAmount: this.discountAmount,
        items: items,
        bookingRooms: formValue.roomTypes.map((roomType: any) => ({
          roomTypeID: roomType.roomTypeID,
          numberOfRooms: roomType.numberOfRooms,
        })),
      };

      const availability_payload = {
        checkIn: formValue.checkIn,
        checkOut: formValue.checkOut,
        roomTypes: formValue.roomTypes.map((roomType: any) => ({
          roomTypeID: roomType.roomTypeID,
          numberOfRooms: roomType.numberOfRooms,
        })),
      };

      this.bookingService.makeBooking(payload).then((response: any) => {
        console.log('Booking successful:', response);

        if (response.statusCode === 200) {
          this.bookingService.updateAvailability(availability_payload).then((response: any) => {
            console.log('Availability updated successfully:', response);
          })
          .catch((error: any) => {
            console.error('Error updating availability:', error);
          });
        }
      })
      .catch((error: any) => {
        console.error('Error making booking:', error);
      });
    } else {
      console.error('Form is invalid');
    }
  }
}
