/*
  Warnings:

  - You are about to drop the column `facebook` on the `Psychologist` table. All the data in the column will be lost.
  - You are about to drop the column `instagram` on the `Psychologist` table. All the data in the column will be lost.
  - You are about to drop the column `linkedin` on the `Psychologist` table. All the data in the column will be lost.
  - You are about to drop the column `website` on the `Psychologist` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Psychologist" DROP COLUMN "facebook",
DROP COLUMN "instagram",
DROP COLUMN "linkedin",
DROP COLUMN "website";

-- CreateTable
CREATE TABLE "SocialLink" (
    "id" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "psychologistId" TEXT NOT NULL,

    CONSTRAINT "SocialLink_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SocialLink" ADD CONSTRAINT "SocialLink_psychologistId_fkey" FOREIGN KEY ("psychologistId") REFERENCES "Psychologist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
