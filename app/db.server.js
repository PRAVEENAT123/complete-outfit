import { PrismaClient } from "@prisma/client";

if (process.env.NODE_ENV !== "production") {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
}



export async function getAllProducts() {
  try {
    const products = await prisma.product.findMany();
    // console.log(products);
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return { error: "Failed to fetch products", details: error.message };
  }
}
export async function getCompoProduct() {
  try {
    const products = await prisma.comboProduct.findMany({
      include: {
        products: true, // Include related products for each combo product
      },
    });
    return products;
  } catch (error) {
    console.error("Error fetching combo products:", error);
    // Return an error object for better handling in the caller function
    return { error: "Failed to fetch combo products", details: error.message };
  }
}
export async function getDiscountCompoProduct() {
  try {
    const products = await prisma.discountComboProduct.findMany({
      include: {
        discountedProducts: true, // Include related products for each combo product
      },
    });
    return products;
  } catch (error) {
    console.error("Error fetching combo products:", error);
    // Return an error object for better handling in the caller function
    return { error: "Failed to fetch combo products", details: error.message };
  }
}
export async function createComboProduct(combo) {
  try {
    //  Create the ComboProduct entry
    const newComboProduct = await prisma.comboProduct.create({
      data: {
        title: combo.title,
        createdAt: new Date().toISOString(),
      },
    });
    const productData = combo.products.map((product) => ({
      name: product.name, // Product name from the combo object
      productId: product.productId || null, // Optional productId
      comboProductId: newComboProduct.id, // Link to the ComboProduct
    }));

    const newProducts = await prisma.product.createMany({
      data: productData,
    });
    return {
      success: true,
      comboProduct: newComboProduct,
      productsCreated: newProducts.count,
      // Returns the count of products created
    };
  } catch (error) {
    console.error("Error creating combo and products:", error);
    return {
      success: false,
      error: "Failed to create combo and products",
      details: error.message,
    };
  }
}

export async function updateComboProduct(combo) {
  const productData = combo.products.map((product) => ({
    name: product.name, // Product name from the combo object
    productId: product.productId || null, // Optional productId
    comboProductId: combo.id, // Link to the ComboProduct
  }));

  try {
    const updateComboProduct = await prisma.comboProduct.update({
      where: {
        name: combo.name,
        id: combo.id,
      },
      data: {
        name: combo.name,
        product: productData,
      },
    });
    return {
      success: true,
      comboProduct: updateComboProduct,
    };
  } catch (error) {
    console.error("Error creating combo and products:", error);
    return {
      success: false,
      error: "Failed to update combo and products",
      details: error.message,
    };
  }
}
export async function deletedComboProduct(comboProductId) {
  try {
    // Delete related DiscountedProduct entries first
    await prisma.discountedProduct.deleteMany({
      where: { comboProductId: comboProductId },
    });

    // Delete the main DiscountComboProduct entry
    const deletedComboProduct = await prisma.discountComboProduct.delete({
      where: { id: comboProductId },
    });

    return {
      success: true,
      message: "Combo product and related products deleted successfully",
      deletedComboProduct: deletedComboProduct,
    };
  } catch (error) {
    console.error("Error deleting combo and products:", error);
    return {
      success: false,
      error: "Failed to delete combo and products",
      details: error.message,
    };
  }
}
// Create Combo Product
export async function createDicountComboProduct(combo) {
  console.log("Tested the combo value ",combo)
  try {
    // Create the DiscountComboProduct entry
    
    const newComboProduct = await prisma.discountComboProduct.create({
      data: {
        title: combo.title,
        description: combo.description || null,
        discountValue: combo.discountValue,
        totalPrice: combo.totalPrice,
        createdAt: new Date().toISOString(),
        discountType: "discount",
      },
    });

    console.log('Discount Combo In Serivec Function',newComboProduct);
    // Prepare the related DiscountedProduct data
    const productData = combo.products.map((product) => ({
      name: product.name,
      productId: product.productId || null,
      comboProductId: newComboProduct.id,
    }));

    // Insert multiple DiscountedProduct entries
    const newProducts = await prisma.discountedProduct.createMany({
      data: productData,
    });

    return {
      success: true,
      comboProduct: newComboProduct,
      productsCreated: newProducts.count,
    };
  } catch (error) {
    console.error("Error creating combo and products:", error);
    return {
      success: false,
      error: "Failed to create combo and products",
      details: error.message,
    };
  }
}

// Update Combo Product
export async function updateDiscountComboProduct(combo) {
  try {
    // Update the DiscountComboProduct entry
    const updatedComboProduct = await prisma.discountComboProduct.update({
      where: { id: combo.id },
      data: {
        title: combo.title,
        description: combo.description || null,
        discountType: combo.discountType,
        discountValue: combo.discountValue,
        totalPrice: combo.totalPrice,
        updatedAt: new Date().toISOString(),
      },
    });

    // Delete existing related products
    await prisma.discountedProduct.deleteMany({
      where: { comboProductId: combo.id },
    });

    // Add the new related products
    const productData = combo.products.map((product) => ({
      name: product.name,
      productId: product.productId || null,
      comboProductId: updatedComboProduct.id,
    }));

    await prisma.discountedProduct.createMany({
      data: productData,
    });

    return {
      success: true,
      comboProduct: updatedComboProduct,
    };
  } catch (error) {
    console.error("Error updating combo and products:", error);
    return {
      success: false,
      error: "Failed to update combo and products",
      details: error.message,
    };
  }
}

export async function deleteDisdocuntComboProduct(comboProductId) {
  try {
    // Delete related DiscountedProduct entries first
    await prisma.discountedProduct.deleteMany({
      where: { comboProductId: comboProductId },
    });

    // Delete the main DiscountComboProduct entry
    const deletedComboProduct = await prisma.discountComboProduct.delete({
      where: { id: comboProductId },
    });

    return {
      success: true,
      message: "Combo product and related products deleted successfully",
      deletedComboProduct: deletedComboProduct,
    };
  } catch (error) {
    console.error("Error deleting combo and products:", error);
    return {
      success: false,
      error: "Failed to delete combo and products",
      details: error.message,
    };
  }
}

const prisma = global.prisma || new PrismaClient();

export default prisma;
