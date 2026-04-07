export interface DeviceReadDto {
  id: number;
  name: string;
  manufacturer?: string;
  deviceTypeName: string;
  operatingSystem?: string;
  osVersion?: string;
  processor?: string;
  ramAmount?: number;
  description?: string;
  currentUserFullName?: string;
}

export interface Device {
  id?: number;
  name: string;
  manufacturer?: string;
  deviceTypeId: number;
  operatingSystem?: string;
  osVersion?: string;
  processor?: string;
  ramAmount?: number;
  description?: string;
  currentUserId?: number | null;
}
