-- CreateTable
CREATE TABLE `etelek` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Nev` VARCHAR(100) NOT NULL,
    `Ar` INTEGER NOT NULL,
    `Kaloria` INTEGER NOT NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `italok` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Nev` VARCHAR(100) NOT NULL,
    `Ar` INTEGER NOT NULL,
    `Kaloria` INTEGER NOT NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rendeles` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `EtelekID` INTEGER NOT NULL,
    `ItalokID` INTEGER NOT NULL,
    `FelhasznalokID` INTEGER NOT NULL,

    INDEX `EtelekID`(`EtelekID`),
    INDEX `ItalokID`(`ItalokID`),
    INDEX `FelhasznalokID`(`FelhasznalokID`),
    INDEX `UserID`(`FelhasznalokID`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ettermek` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `EtteremNev` VARCHAR(100) NOT NULL,
    `VarosID` INTEGER NOT NULL,
    `Longitude` FLOAT NOT NULL,
    `Latitude` FLOAT NOT NULL,

    INDEX `VarosID`(`VarosID`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `varosok` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `VarosNev` VARCHAR(100) NOT NULL,
    `Longitude` FLOAT NOT NULL,
    `Latitude` FLOAT NOT NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `felhasznalok` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Email` VARCHAR(100) NOT NULL,
    `Felhasznalonev` VARCHAR(100) NOT NULL,
    `Jelszo` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `rendeles` ADD CONSTRAINT `rendeles_ibfk_2` FOREIGN KEY (`ItalokID`) REFERENCES `italok`(`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `rendeles` ADD CONSTRAINT `rendeles_ibfk_3` FOREIGN KEY (`EtelekID`) REFERENCES `etelek`(`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `rendeles` ADD CONSTRAINT `rendeles_ibfk_4` FOREIGN KEY (`FelhasznalokID`) REFERENCES `felhasznalok`(`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `ettermek` ADD CONSTRAINT `ettermek_ibfk_1` FOREIGN KEY (`VarosID`) REFERENCES `varosok`(`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT;
