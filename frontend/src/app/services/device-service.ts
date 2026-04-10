import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Device, DeviceReadDto } from "../interfaces/device";

@Injectable({ providedIn: 'root' })
export class DeviceService {
  private apiUrl = 'http://localhost:5164/api/device';
  constructor(private http: HttpClient) {}

  getDevices(): Observable<DeviceReadDto[]> {
    return this.http.get<DeviceReadDto[]>(this.apiUrl);
  }

  getDevice(id: number): Observable<DeviceReadDto>{
    return this.http.get<DeviceReadDto>(`${this.apiUrl}/${id}`);
  }

  createDevice(device: Device): Observable<DeviceReadDto> {
    return this.http.post<DeviceReadDto>(this.apiUrl, device);
  }

  updateDevice(id: number, device: Device): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, device);
  }

  deleteDevice(id: number): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  checkNameExists(name: string, excludeId?: number): Observable<boolean> {
    let params = new HttpParams().set('name', name);
    if (excludeId) {
      params = params.set('excludeId', excludeId.toString());
    }
    return this.http.get<boolean>(`${this.apiUrl}/check-exists`, { params });
  }
}
