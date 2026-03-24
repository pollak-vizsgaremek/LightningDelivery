/*
  Warnings:

  - A unique constraint covering the columns `[Felhasznalonev]` on the table `felhasznalok` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `Felhasznalonev` to the `felhasznalok` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `felhasznalok` ADD COLUMN `Felhasznalonev` VARCHAR(100) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Felhasznalonev` ON `felhasznalok`(`Felhasznalonev`);

-- AddForeignKey
ALTER TABLE `rendeles` ADD CONSTRAINT `rendeles_ibfk_1` FOREIGN KEY (`FelhasznalokID`) REFERENCES `felhasznalok`(`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `rendeles` ADD CONSTRAINT `rendeles_ibfk_2` FOREIGN KEY (`ItalokID`) REFERENCES `italok`(`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `rendeles` ADD CONSTRAINT `rendeles_ibfk_3` FOREIGN KEY (`EtelekID`) REFERENCES `etelek`(`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT;
