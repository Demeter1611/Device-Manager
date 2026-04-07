import { Component, inject } from "@angular/core";
import { DeviceService } from "../services/device-service";
import { DeviceReadDto } from "../interfaces/device";

@Component({
  selector: 'app-device-list',
  template: `
    <div class="container">
      <h2>Device Inventory</h2>
      <button id="add-btn">Add new device</button>
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
          @for(device of devices; track $index){
            <tr>
              <td>{{ device.name }}</td>
              <td>{{ device.deviceTypeName }}</td>
              <td>{{ device.manufacturer}}</td>
              <td>{{ device.currentUserFullName }}</td>
              <td class="action-buttons">
                <button>Details</button>
                <button id="delete">Delete</button>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styleUrl: './device-list.css'
})
export class DeviceListComponent {
  deviceService = inject(DeviceService);
  devices: DeviceReadDto[] = [];

  ngOnInit(){
    this.loadDevices();
  }

  loadDevices() {
    this.deviceService.getDevices().subscribe({
      next: (data) => {
        this.devices = data;
      },
      error: (err) => console.error('Error fetching devices', err)
    });
  }
}
