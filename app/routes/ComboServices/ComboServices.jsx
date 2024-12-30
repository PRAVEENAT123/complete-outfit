import prisma from "../../db.server";

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

export async function deleteCombo(combo) {
  try {
    const deleteCombo = await prisma.user.delete({
      where: {
        id: combo.id,
        name: combo.name,
      },
    });
    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting combo and products:", error);
    return {
      success: false,
      error: "Failed to deleting combo and products",
      details: error.message,
    };
  }
}
