IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'DeviceManager')
BEGIN
    CREATE DATABASE DeviceManager;
END
GO

USE DeviceManager;
GO

IF OBJECT_ID('Roles') IS NULL
BEGIN
    CREATE TABLE Roles(
        id INT PRIMARY KEY IDENTITY(1,1),
        name VARCHAR(50) NOT NULL UNIQUE CHECK(name IN ('admin', 'user'))
    );
    INSERT INTO Roles(name) VALUES ('admin'), ('user');
END

IF OBJECT_ID('Users') IS NULL
BEGIN
    CREATE TABLE Users(
        id INT PRIMARY KEY IDENTITY(1,1),
        email VARCHAR(250) NOT NULL UNIQUE,
        fullName VARCHAR(250),
        password VARCHAR(250),
        roleId INT FOREIGN KEY REFERENCES Roles(id),
        location VARCHAR(250)
    );
END

IF OBJECT_ID('DeviceTypes') IS NULL
BEGIN
    CREATE TABLE DeviceTypes(
        id INT PRIMARY KEY IDENTITY(1,1),
        name VARCHAR(50) NOT NULL UNIQUE CHECK(name IN ('phone', 'tablet'))
    );
    INSERT INTO DeviceTypes(name) VALUES ('phone'), ('tablet');
END

IF OBJECT_ID('Devices') IS NULL
BEGIN
    CREATE TABLE Devices(
        id INT PRIMARY KEY IDENTITY(1,1),
        name VARCHAR(250) NOT NULL,
        manufacturer VARCHAR(250),
        deviceTypeId INT FOREIGN KEY REFERENCES DeviceTypes(id),
        operatingSystem VARCHAR(250),
        osVersion VARCHAR(50),
        processor VARCHAR(250),
        ramAmount INT,
        description VARCHAR(MAX),
        currentUserId INT NULL FOREIGN KEY REFERENCES Users(id)
    );
END