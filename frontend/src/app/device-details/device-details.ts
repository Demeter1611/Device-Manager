import { Component, input, output } from "@angular/core";
import { DeviceReadDto } from "../interfaces/device";

@Component({
  selector: 'app-device-details',
  template:`
    <div class="modal" (click)="this.close.emit()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <h3>Device details</h3>
        <div class="details-grid">
          <div class="details-field">
            <span class="field-label">Name</span>
            <p class="field-info">{{selectedDevice().name}}</p>
          </div>
          <div class="details-field">
            <span class="field-label">Manufacturer</span>
            <p class="field-info">{{selectedDevice().manufacturer}}</p>
          </div>
          <div class="details-field">
            <span class="field-label">Device type</span>
            <p class="field-info">{{selectedDevice().deviceTypeName}}</p>
          </div>
          <div class="details-field">
            <span class="field-label">Operating system</span>
            <p class="field-info">{{selectedDevice().operatingSystem}}</p>
          </div>
          <div class="details-field">
            <span class="field-label">OS version</span>
            <p class="field-info">{{selectedDevice().osVersion}}</p>
          </div>
          <div class="details-field">
            <span class="field-label">Processor</span>
            <p class="field-info">{{selectedDevice().processor}}</p>
          </div>
          <div class="details-field">
            <span class="field-label">RAM amount</span>
            <p class="field-info">{{selectedDevice().ramAmount}} MB</p>
          </div>
          <div class="details-field description-field">
            <span class="field-label">Description</span>
            <p class="field-info">{{selectedDevice().description}}</p>
          </div>
          <button id="close-btn" (click)="close.emit()">Close</button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['device-details.css']
})
export class DeviceDetailsComponent{
  selectedDevice = input.required<DeviceReadDto>();
  close = output<void>();
}
