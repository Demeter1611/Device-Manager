import { Component, inject, signal } from "@angular/core";
import { DeviceService } from "../services/device-service";
import { DeviceReadDto } from "../interfaces/device";
import { DeviceForm } from "../device-form/device-form";
import { DeviceDeleteComponent } from "../device-delete/device-delete";
import { DeviceDetailsComponent } from "../device-details/device-details";

@Component({
  selector: 'app-device-list',
  template: `
    <div class="container">
      <h2>Device Inventory</h2>
      <button id="add-btn" (click)="onAddNewDevice()">Add new device</button>
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
                <button (click)="onDetails(device)">Details</button>
                <button (click)="onEdit(device)">Edit</button>
                <button id="delete" (click)="onDelete(device)">Delete</button>
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
  imports: [DeviceForm, DeviceDeleteComponent, DeviceDetailsComponent]
})
export class DeviceListComponent {
  deviceService = inject(DeviceService);
  devices = signal<DeviceReadDto[]>([]);
  deviceFormOpen: boolean = false;
  deleteOpen: boolean = false;
  detailsOpen: boolean = false;
  selectedDevice: DeviceReadDto | null = null;

  ngOnInit(){
    this.loadDevices();
  }

  loadDevices() {
    this.deviceService.getDevices().subscribe({
      next: (data) => {
        this.devices.set(data);
      },
      error: (err) => console.error('Error fetching devices', err)
    });
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
}
