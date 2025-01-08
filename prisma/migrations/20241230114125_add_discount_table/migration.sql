-- CreateTable
CREATE TABLE "DiscountComboProduct" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "discountType" TEXT NOT NULL,
    "discountValue" REAL NOT NULL,
    "totalPrice" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "DiscountedProduct" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "productId" TEXT,
    "comboProductId" INTEGER,
    CONSTRAINT "DiscountedProduct_comboProductId_fkey" FOREIGN KEY ("comboProductId") REFERENCES "DiscountComboProduct" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
