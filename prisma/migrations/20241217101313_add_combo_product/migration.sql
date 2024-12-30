-- CreateTable
CREATE TABLE "ComboProduct" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "comboProductId" INTEGER,
    CONSTRAINT "Product_comboProductId_fkey" FOREIGN KEY ("comboProductId") REFERENCES "ComboProduct" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ComboProduct_title_key" ON "ComboProduct"("title");
