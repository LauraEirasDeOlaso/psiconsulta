-- CreateTable
CREATE TABLE "Plan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION,
    "description" TEXT,
    "features" TEXT[],
    "highlighted" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "psychologistId" TEXT NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_psychologistId_fkey" FOREIGN KEY ("psychologistId") REFERENCES "Psychologist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
