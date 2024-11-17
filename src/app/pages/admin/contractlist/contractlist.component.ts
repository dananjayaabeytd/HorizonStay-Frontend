import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { ContractService } from '../../../services/contract/contract.service';
import { AlertService } from '../../../services/alert/alert.service';

@Component({
  selector: 'app-contractlist',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './contractlist.component.html',
})
export class ContractlistComponent implements OnInit {
  contracts: any[] = [];
  errorMessage: string = '';
  hotelID: any;

  constructor(
    private readonly contractService: ContractService,
    private readonly route: ActivatedRoute,
    private alertService: AlertService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadContracts();
  }

  async loadContracts() {
    try {
      this.hotelID = this.route.snapshot.paramMap.get('id');
      const token: any = localStorage.getItem('token');
      const response = await this.contractService
        .getContractsByHotelId(this.hotelID, token)
        .toPromise(); // Convert Observable to Promise
      // console.log('API Response:', response); // Log the entire response

      if (response && Array.isArray(response)) {
        console.log('Contracts found:', response);
        this.contracts = response;
      } else {
        console.log('No Contracts found.');
      }
    } catch (error: any) {
      console.log('Error:', error.message);
    }
  }

  navigateToUpdateContract(hotelID: any, contractId: any) {
    this.router.navigate([`/hotel/${hotelID}/update-contract/${contractId}`]);
  }

  async deleteContract(contractId: any) {
    const confirmDelete = await this.alertService.showConfirm(
      'Are you sure you want to delete this contract ?',
      'Do you want to proceed?',
      'Yes, proceed',
      'No, cancel'
    );
    if (!confirmDelete) {
      return;
    }

    if (confirmDelete) {
      try {
        const token: any = localStorage.getItem('token');
        const response = this.contractService
          .deleteContract(contractId, token)
          .toPromise(); // Convert Observable to Promise

        // console.log('response ->',response)
        if (await response) {
          this.loadContracts(); // Reload contracts after deletion
        } else {
          console.log('Failed to delete contract.');
        }
      } catch (error: any) {
        console.log(error.message);
      }
    }
  }

  async toggleContractStatus(contractId: number): Promise<void> {
    const contract = this.contracts.find(c => c.id === contractId);
    if (contract) {

      const updateStatus = await this.alertService.showConfirm(
        'Are you sure you want to Update Status ?',
        'Do you want to proceed?',
        'Yes, proceed',
        'No, cancel'
      );
      if (!updateStatus) {
        return;
      }
  
      if (updateStatus) {
        try {
          const token: any = localStorage.getItem('token');
          const response = this.contractService
            .updateContractStatus(contractId, token)
            .toPromise(); // Convert Observable to Promise
  
          // console.log('response ->',response)
          if (await response) {
            this.loadContracts(); // Reload contracts after deletion
          } else {
            console.log('Failed to delete contract.');
          }
        } catch (error: any) {
          console.log(error.message);
        }
      }


      contract.isActive = !contract.isActive;
    }
  }
}
