CREATE DATABASE games;
USE games;

-- Table Editors
CREATE TABLE Editors (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL
);

-- Table Studios
CREATE TABLE Studios (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL
);

-- Table Games
CREATE TABLE Games (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    EditorsId INT,
    Genres VARCHAR(255),
    Platforms VARCHAR(255),
    PublicationDate INT,
    StudiosId INT,
    FOREIGN KEY (EditorsId) REFERENCES Editors(Id),
    FOREIGN KEY (StudiosId) REFERENCES Studios(Id)
);
