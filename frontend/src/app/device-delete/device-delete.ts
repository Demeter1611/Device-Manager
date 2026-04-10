import { Component, inject, input, output } from "@angular/core";
import { DeviceReadDto } from "../interfaces/device";
import { DeviceService } from "../services/device-service";

@Component({
  selector:'app-device-delete',
  template:`
    <div class="modal" (click)="this.close.emit()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <h3>Are you sure you want to delete device "{{selectedDevice().name}}"?</h3>
        <div class="action-buttons">
          <button id="confirm-btn" (click)="onConfirm()">Yes</button>
          <button (click)="this.close.emit()">No</button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['device-delete.css']
})
export class DeviceDeleteComponent {
  deviceService = inject(DeviceService);
  selectedDevice = input.required<DeviceReadDto>();
  close = output<void>();
  saved = output<void>();

  onConfirm(){
    this.deviceService.deleteDevice(this.selectedDevice().id).subscribe({
      next: () => {
        this.saved.emit();
        this.close.emit();
      },
      error: (err) => alert(`Error with deleting device: ${err.message}`)
    });
  }
}
