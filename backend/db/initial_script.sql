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
        Id INT PRIMARY KEY IDENTITY(1,1),
        Name VARCHAR(50) NOT NULL UNIQUE CHECK(name IN ('admin', 'user'))
    );
    INSERT INTO Roles(Name) VALUES ('admin'), ('user');
END

IF OBJECT_ID('Users') IS NULL
BEGIN
    CREATE TABLE Users(
        Id INT PRIMARY KEY IDENTITY(1,1),
        Email VARCHAR(250) NOT NULL UNIQUE,
        FullName VARCHAR(250),
        Password VARCHAR(250) NOT NULL,
        RoleId INT FOREIGN KEY REFERENCES Roles(Id),
    );
END

IF OBJECT_ID('DeviceTypes') IS NULL
BEGIN
    CREATE TABLE DeviceTypes(
        Id INT PRIMARY KEY IDENTITY(1,1),
        Name VARCHAR(50) NOT NULL UNIQUE CHECK(name IN ('phone', 'tablet'))
    );
    INSERT INTO DeviceTypes(Name) VALUES ('phone'), ('tablet');
END

IF OBJECT_ID('Devices') IS NULL
BEGIN
    CREATE TABLE Devices(
        Id INT PRIMARY KEY IDENTITY(1,1),
        Name VARCHAR(250) NOT NULL UNIQUE,
        Manufacturer VARCHAR(250),
        DeviceTypeId INT FOREIGN KEY REFERENCES DeviceTypes(Id),
        OperatingSystem VARCHAR(250),
        OsVersion VARCHAR(50),
        Processor VARCHAR(250),
        RamAmount INT,
        Description VARCHAR(MAX),
        CurrentUserId INT NULL FOREIGN KEY REFERENCES Users(Id)
    );
END