import { DeviceReadDto } from './../interfaces/device';
import { Component, inject, input, output, signal } from "@angular/core";
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { DeviceService } from "../services/device-service";
import { catchError, map, of } from 'rxjs';

@Component({
  selector: 'app-device-form',
  imports: [ReactiveFormsModule],
  template: `
    <div class="modal" (click)="this.close.emit()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <h3>{{mode === "add" ? "Add new device" : "Edit existing device"}}</h3>
        <form [formGroup]="deviceForm">
          <div class="form-field">
            <label for="name">Name</label>
            <input class="text-input" id="name" type="text" formControlName="name"/>
            @if(deviceForm.get('name')?.errors?.['nameTaken'] && deviceForm.get('name')?.touched){
              <span class="error-text">Name already exists</span>
            }
            @else if(isInvalid("name")){
              <span class="error-text">Field required</span>
            }
          </div>

          <div class="form-field">
            <label for="manufacturer">Manufacturer</label>
            <input class="text-input" id="manufacturer" type="text" formControlName="manufacturer"/>
            @if(isInvalid("manufacturer")){
              <span class="error-text">Field required</span>
            }
          </div>

          <div class="form-field">
            <label>Type</label>
            <select class="text-input" formControlName="deviceTypeId">
              <option [ngValue]="1">Phone</option>
              <option [ngValue]="2">Tablet</option>
            </select>
          </div>

          <div class="form-field">
            <label for="operating-system">Operating system</label>
            <input class="text-input" id="operating-system" type="text" formControlName="operatingSystem">
            @if(isInvalid("operatingSystem")){
              <span class="error-text">Field required</span>
            }
          </div>

          <div class="form-field">
            <label for="os-version">OS version</label>
            <input class="text-input" id="os-version" type="text" formControlName="osVersion">
            @if(isInvalid("osVersion")){
              <span class="error-text">Field required</span>
            }
          </div>

          <div class="form-field">
            <label for="processor">Processor</label>
            <input class="text-input" id="processor" type="text" formControlName="processor">
            @if(isInvalid("processor")){
              <span class="error-text">Field required</span>
            }
          </div>

          <div class="form-field">
            <label for="ram-amount">RAM amount (GB)</label>
            <input class="text-input" id="ram-amount" type="number" formControlName="ramAmount">
            @if (deviceForm.get('ramAmount')?.errors?.['min'] && deviceForm.get('ramAmount')?.touched) {
              <span class="error-text">RAM must be at least 1 GB.</span>
            }
            @else if(isInvalid("ramAmount")){
              <span class="error-text">Field required</span>
            }
          </div>

          <div class="form-field description-field">
            <label for="description">Description</label>
            <button (click)="generateDescription()" [disabled]="isGenerating()">{{ isGenerating() ? 'Generating...' : 'Generate with AI'}}</button>
            <textarea class="text-input" id="description" formControlName="description" rows="4" placeholder="A short description of the device"></textarea>
            @if(isInvalid("description")){
              <span class="error-text">Field required</span>
            }
          </div>
        </form>
        <div class="form-buttons">
          <button (click)="onSubmit()">Submit</button>
          <button (click)="onCancel()">Cancel</button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['device-form.css']
})
export class DeviceForm{
  private DEVICE_TYPE_PHONE = 1;
  private DEVICE_TYPE_TABLET = 2;

  deviceForm!: FormGroup;
  deviceService = inject(DeviceService);
  mode: string = "add";
  isGenerating = signal<boolean>(false);


  selectedDevice = input<DeviceReadDto | null>();
  close = output<void>();
  saved = output<void>();

  ngOnInit(){
    this.deviceForm = new FormGroup(
      {
        name: new FormControl('',
          [Validators.required], [this.uniqueNameValidator()]),
        manufacturer: new FormControl('', [
          Validators.required
        ]),
        deviceTypeId: new FormControl(1, [
          Validators.required
        ]),
        operatingSystem: new FormControl('', [
          Validators.required
        ]),
        osVersion: new FormControl('', [
          Validators.required
        ]),
        processor: new FormControl('', [
          Validators.required
        ]),
        ramAmount: new FormControl(0, [
          Validators.required, Validators.min(1)
        ]),
        description: new FormControl('', [
          Validators.required
        ])
      }
    )

    const device = this.selectedDevice();
    if(device){
      this.deviceForm.patchValue(device);
      this.deviceForm.get('deviceTypeId')?.setValue(
        device.deviceTypeName.toLowerCase() === "phone" ? this.DEVICE_TYPE_PHONE : this.DEVICE_TYPE_TABLET
      )
      this.mode = "edit";
    }
  }

  isInvalid(field: string){
    const control = this.deviceForm.get(field);
    return !!(control && control.invalid && control.touched);
  }

  onCancel() {
    this.close.emit();
  }

  onSubmit() {
    if (this.deviceForm.invalid) {
      this.deviceForm.markAllAsTouched();
      return;
    }

    const newDevice = this.deviceForm.value;
    const oldDevice = this.selectedDevice();
    if(this.mode === "edit" && oldDevice){
      this.deviceService.updateDevice(oldDevice.id, {...newDevice, id: oldDevice.id}).subscribe({
        next: () => {
          this.saved.emit();
          this.close.emit();
        },
        error: (err) => alert(`Error with editing device: ${err.message}`)
      });
    } else {
      this.deviceService.createDevice(newDevice).subscribe({
          next: () => {
            this.saved.emit();
            this.close.emit();
          },
          error: (err) => alert(`Error with saving device: ${err.message}`)
      });
    }
  }

  private uniqueNameValidator() {
    return (control: AbstractControl) => {
      const name = control.value;
      const device = this.selectedDevice();
      if (!name) {
        return of(null);
      }
      return this.deviceService
        .checkNameExists(name, device?.id)
        .pipe(
          map(exists => (exists ? { nameTaken: true } : null)),
          catchError(() => of(null as any))
        );
    };
  }

  generateDescription() {
    const requiredFields = [
      'name', 'manufacturer', 'operatingSystem', 'osVersion', 'processor', 'ramAmount'
    ];

    const isFormReady = requiredFields.every(field => this.deviceForm.get(field)?.valid);
    if(!isFormReady) {
      requiredFields.forEach(field => {
        this.deviceForm.get(field)?.markAsTouched();
      });

      alert("Please fill in all technical specifications before generating a description");
      return;
    }

    this.isGenerating.set(true);
    const device = this.deviceForm.value;

    this.deviceService.generateDescription(device).subscribe({
      next: (val) => {
        this.deviceForm.patchValue({ description: val.description });
        this.isGenerating.set(false);
      },
      error: (err) => {
        alert(`Error: ${err.message}`);
        this.isGenerating.set(false);
      }
    })
  }
}
