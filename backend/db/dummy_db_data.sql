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
    ('iPhone 15 Pro', 'Apple', 1, 'iOS', '17.0', 'A17 Pro', 8, 'Sealed company phone, brand new unit.', 3), 
    ('iPhone 13 mini', 'Apple', 1, 'iOS', '15.0', 'A15 Bionic', 4, 'Legacy testing device, small form factor.', NULL),
    ('Galaxy S23 Ultra', 'Samsung', 1, 'Android', '13.0', 'Snapdragon 8 Gen 2', 12, 'Flagship device for mobile development.', 2),
    ('Pixel 8 Pro', 'Google', 1, 'Android', '14.0', 'Tensor G3', 12, 'Pure Android experience for UI/UX testing.', NULL),
    ('Pixel 7a', 'Google', 1, 'Android', '13.0', 'Tensor G2', 8, 'Mid-range test unit.', 3),
    ('iPhone 11', 'Apple', 1, 'iOS', '13.0', 'A13 Bionic', 4, 'Standard office phone for internal calls.', NULL),
    ('Xperia 5 IV', 'Sony', 1, 'Android', '12.0', 'Snapdragon 8 Gen 1', 8, 'Compact professional phone.', NULL),
    
    ('Galaxy Tab S9', 'Samsung', 2, 'Android', '13.0', 'Snapdragon 8 Gen 2', 12, 'High-end tablet for graphic design tasks.', 2),
    ('iPad Air', 'Apple', 2, 'iPadOS', '16.5', 'M1', 8, 'Tablet reserved for meeting room presentations.', NULL),
    ('iPad Pro 12.9', 'Apple', 2, 'iPadOS', '17.0', 'M2', 16, 'Top-tier performance for video editing.', 3),
    ('Galaxy Tab A8', 'Samsung', 2, 'Android', '11.0', 'Unisoc Tiger T618', 4, 'Budget tablet for warehouse inventory.', NULL),
    ('Xiaomi Pad 6', 'Xiaomi', 2, 'Android', '13.0', 'Snapdragon 870', 6, 'Efficient multitasking tablet.', 3),
    ('iPad mini', 'Apple', 2, 'iPadOS', '15.0', 'A15 Bionic', 4, 'Portable tablet for field engineers.', NULL),
    ('Surface Pro 9', 'Microsoft', 2, 'Windows', '11', 'Intel Core i7', 16, 'Hybrid device for management team.', 3);
END
GO