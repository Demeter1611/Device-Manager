USE DeviceManager;
GO

DELETE FROM Devices;
DELETE FROM Users;

DBCC CHECKIDENT ('Users', RESEED, 0);
DBCC CHECKIDENT ('Devices', RESEED, 0);
GO

IF NOT EXISTS (SELECT * FROM Users)
BEGIN
    INSERT INTO Users (Email, FullName, Password, RoleId)
    VALUES
    -- Password is "parola123"
    ('admin@test.com', 'Admin Istrate', '$2a$11$ZKyr4rwMSOi/lIZP6KdBsOPfsiUymrLLr2oZMzXhI9TYmfcPWHxS2', 1),
    ('user1@test.com', 'Ion Frasinaru', '$2a$11$ZKyr4rwMSOi/lIZP6KdBsOPfsiUymrLLr2oZMzXhI9TYmfcPWHxS2', 2), 
    ('user2@test.com', 'Elena Radu', '$2a$11$ZKyr4rwMSOi/lIZP6KdBsOPfsiUymrLLr2oZMzXhI9TYmfcPWHxS2', 2);
END
GO

IF NOT EXISTS (SELECT * FROM Devices)
BEGIN
    INSERT INTO Devices (Name, Manufacturer, DeviceTypeId, OperatingSystem, OsVersion, Processor, RamAmount, Description, CurrentUserId)
    VALUES 
    ('iPhone 15 Pro', 'Apple', 1, 'iOS', '17.0', 'A17 Pro', 8, 'Sealed company phone, brand new unit.', 1), 
    
    ('Galaxy Tab S9', 'Samsung', 2, 'Android', '13.0', 'Snapdragon 8 Gen 2', 12, 'High-end tablet for graphic design tasks.', 2),
    
    ('Pixel 8', 'Google', 1, 'Android', '14.0', 'Tensor G3', 8, 'Testing unit kept in inventory for QA.', NULL),
    
    ('iPad Air', 'Apple', 2, 'iPadOS', '16.5', 'M1', 8, 'Tablet reserved for meeting room presentations.', NULL);
END
GO