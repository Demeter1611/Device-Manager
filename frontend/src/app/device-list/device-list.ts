import { Component, inject, signal } from "@angular/core";
import { DeviceService } from "../services/device-service";
import { DeviceReadDto } from "../interfaces/device";
import { DeviceForm } from "../device-form/device-form";
import { DeviceDeleteComponent } from "../device-delete/device-delete";
import { DeviceDetailsComponent } from "../device-details/device-details";
import { AuthService } from "../services/auth-service";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { debounceTime, distinctUntilChanged, switchMap } from "rxjs";

@Component({
  selector: 'app-device-list',
  template: `
    <div class="container">
      <h2>Device Inventory</h2>
      <input type="text" [formControl]="searchControl" class="search-input" placeholder="Search by name, manufacturer, processor or RAM(e.g. 8GB)"/>
      @if(authService.user.roleName === "admin"){
        <button id="add-btn" (click)="onAddNewDevice()">Add new device</button>
      }
      <table class="device-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Manufacturer</th>
            <th>Current User</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          @for(device of devices(); track $index){
            <tr>
              <td>{{ device.name }}</td>
              <td>{{ device.deviceTypeName }}</td>
              <td>{{ device.manufacturer}}</td>
              <td>{{ device.currentUserFullName }}</td>
              <td class="action-buttons">
                @if(authService.user.roleName === "admin"){
                  <button (click)="onDetails(device)">Details</button>
                  <button (click)="onEdit(device)">Edit</button>
                  <button id="delete" (click)="onDelete(device)">Delete</button>
                }
                @else {
                  @if(device.currentUserFullName === "Unassigned") {
                    <button (click)="onAssign(device)">Assign</button>
                  }
                  @else if(device.currentUserFullName === authService.user.fullName){
                    <button (click)="onUnassign(device)">Unassign</button>
                  }
                  @else {
                    <span id="no-action-text">No actions</span>
                  }
                }
              </td>
            </tr>
          }
        </tbody>
      </table>
      @if(deviceFormOpen){
        <app-device-form
        (saved)="onSaved()"
        (close)="onModalClosed()"
        [selectedDevice]="selectedDevice"/>
      }
      @if(deleteOpen && selectedDevice){
        <app-device-delete
        (close)="onModalClosed()"
        (saved)="onSaved()"
        [selectedDevice]="selectedDevice"/>
      }
      @if(detailsOpen && selectedDevice){
        <app-device-details
        (close)="onModalClosed()"
        [selectedDevice]="selectedDevice"/>
      }
    </div>
  `,
  styleUrl: './device-list.css',
  imports: [DeviceForm, DeviceDeleteComponent, DeviceDetailsComponent, ReactiveFormsModule]
})
export class DeviceListComponent {
  deviceService = inject(DeviceService);
  authService = inject(AuthService);

  devices = signal<DeviceReadDto[]>([]);
  searchControl = new FormControl('');

  deviceFormOpen: boolean = false;
  deleteOpen: boolean = false;
  detailsOpen: boolean = false;
  selectedDevice: DeviceReadDto | null = null;


  ngOnInit(){
    this.loadDevices();
    this.setupSearch();
  }

  loadDevices() {
    this.deviceService.getDevices().subscribe({
      next: (data) => {
        this.devices.set(data);
      },
      error: (err) => console.error('Error fetching devices', err)
    });
  }

  setupSearch() {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        if(!query || query.trim().length === 0){
          return this.deviceService.getDevices();
        }
        return this.deviceService.searchDevices(query);
      })
    ).subscribe({
      next: (data) => this.devices.set(data),
      error: (err) => console.error('Search error', err)
    })
  }

  onSaved(){
    this.loadDevices();
    this.selectedDevice = null;
  }

  onModalClosed(){
    this.deviceFormOpen = false;
    this.deleteOpen = false;
    this.detailsOpen = false;
    this.selectedDevice = null;
  }

  onAddNewDevice(){
    this.deviceFormOpen = true;
  }

  onEdit(device: DeviceReadDto){
    this.selectedDevice = device;
    this.deviceFormOpen = true;
  }

  onDelete(device: DeviceReadDto){
    this.selectedDevice = device;
    this.deleteOpen = true;
  }

  onDetails(device: DeviceReadDto){
    this.selectedDevice = device;
    this.detailsOpen = true;
  }

  onAssign(device: DeviceReadDto){
    this.deviceService.assignDevice(device.id).subscribe({
      next: () => {
        this.loadDevices();
      },
      error: (err) => alert(`Error with assigning device: ${err.message}`)
    });
  }

  onUnassign(device: DeviceReadDto){
    this.deviceService.unassignDevice(device.id).subscribe({
      next: () => {
        this.loadDevices();
      },
      error: (err) => alert(`Error with unassigning device: ${err.message}`)
    })
  }
}
