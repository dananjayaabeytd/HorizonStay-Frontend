import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { ContractService } from '../../../services/contract/contract.service';

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
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadContracts();
  }

  async loadContracts() {
    try {
      this.hotelID = this.route.snapshot.paramMap.get('id');
      const token: any = localStorage.getItem('token');
      const response = await this.contractService.getContractsByHotelId(
        this.hotelID,
        token
      ).toPromise(); // Convert Observable to Promise
      console.log('API Response:', response); // Log the entire response
  
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

  navigateToUpdateContract(contractId: any) {
    this.router.navigate(['/update-contract', contractId]);
  }

  async deleteContract(contractId: any) {
    try {
      const token: any = localStorage.getItem('token');
      const response = await this.contractService.deleteContract(
        contractId,
        token
      );
      if (response) {
        this.loadContracts(); // Reload contracts after deletion
      } else {
        console.log('Failed to delete contract.');
      }
    } catch (error: any) {
      console.log(error.message);
    }
  }
}
