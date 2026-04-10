USE DeviceManager;
GO

DELETE FROM Devices;
DELETE FROM Users;

DBCC CHECKIDENT ('Users', RESEED, 0);
DBCC CHECKIDENT ('Devices', RESEED, 0);
GO

INSERT INTO Users (Email, FullName, Password, RoleId)
VALUES  
('admin@test.com', 'Admin User', 'password123', 1),
('mihai.frasinaru@test.com', 'Mihai Frasinaru', 'userpass1', 2), 
('anda.popescu@test.com', 'Anda Popescu', 'userpass2', 2);
GO

INSERT INTO Devices (Name, Manufacturer, DeviceTypeId, OperatingSystem, OsVersion, Processor, RamAmount, Description, CurrentUserId)
VALUES  
('iPhone 15 Pro', 'Apple', 1, 'iOS', '17.0', 'A17 Pro', 8, 'Sealed company phone, brand new unit.', 1),  
('Galaxy Tab S9', 'Samsung', 2, 'Android', '13.0', 'Snapdragon 8 Gen 2', 12, 'High-end tablet for graphic design tasks.', 2),
('Pixel 8', 'Google', 1, 'Android', '14.0', 'Tensor G3', 8, 'Testing unit kept in inventory for QA.', NULL),
('iPad Air', 'Apple', 2, 'iPadOS', '16.5', 'M1', 8, 'Tablet reserved for meeting room presentations.', NULL);
GO