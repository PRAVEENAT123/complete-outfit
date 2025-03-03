import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import NormalComboComponent from "./app.resouresAdd";
import DiscountComboComponent from "./app.discountCombo";
import {
  Page,
  Layout,
  TextContainer,
  Text,
  LegacyCard,
  Grid,
  Modal,
  LegacyStack,
  Button,
} from "@shopify/polaris";
// import { createComboProduct } from "./ComboServices/ComboServices";

import { authenticate } from "../shopify.server";

import { createComboProduct, createDicountComboProduct } from "../db.server";

export async function action({ request }) {
  const { admin } = await authenticate.admin(request);

  // Parse the form data
  const formData = await request.formData();
  const actionType = formData.get("actionType");

  if (actionType === "create") {
    const comboName = formData.get("comboName");
    // Parse the selected products from form data
    const selectedProducts1 = JSON.parse(formData.get("selectedProducts"));
    // Create the combo object
    const combo = {
      title: comboName,
      products: selectedProducts1.map((product) => ({
        name: product.title,
        productId: product.id,
      })),
    };

    // Extract product IDs
    const comboProductIds = selectedProducts1.map((product) => product.id);

    console.log("Combo Check:", combo);
    const totalPrice = 100; // Adjust based on actual calculation

    // Call the createComboProduct function
    const createCompo = await createComboProduct(combo);
    console.log("Created Combo Product:", createCompo);

    // Mutation to create the combo product
    const response = await admin.graphql(
      `#graphql
        mutation populateProduct($product: ProductCreateInput!) {
          productCreate(product: $product) {
            product {
              id
              title
              handle
              status
              metafields(namespace: "combo_products", first: 10) {
                edges {
                  node {
                    key
                    value
                    type
                  }
                }
              }
              variants(first: 10) {
                edges {
                  node {
                    id
                    price
                    barcode
                    createdAt
                  }
                }
              }
            }
          }
        }`,
      {
        variables: {
          product: {
            title: comboName, // Set combo product title directly
            productType: "Combo",
            metafields: [
              {
                namespace: "combo_products",
                key: "included_products",
                value: JSON.stringify(comboProductIds),
                type: "json",
              },
            ],
          },
        },
      },
    );

    return response;
  }

  if (actionType === "create-discount") {
    console.log("Creating Discount for Combo");
    const comboName = formData.get("comboName");

    // Parse the selected products from form data
    const selectedProducts1 = JSON.parse(formData.get("selectedProducts"));

    const totalPrice = 100; // Adjust based on actual calculation

    // Create the combo object
    const combo = {
      title: comboName,
      products: selectedProducts1.map((product) => ({
        name: product.title,
        productId: product.id,
      })),
      totalPrice: 10,
      discountValue: 100,
      discountType: "percantage",
    };
    // Extract product IDs
    const comboProductIds = selectedProducts1.map((product) => product.id);

    console.log("Combo Check:", combo);

    // Call the createComboProduct function
    const createCompo = await createDicountComboProduct(combo);
    console.log("Created Combo Product:", createCompo);

    // Mutation to create the combo product with discount
    const response = await admin.graphql(
      `#graphql
        mutation populateProduct($product: ProductCreateInput!) {
          productCreate(product: $product) {
            product {
              id
              title
              handle
              status
              metafields(namespace: "combo_products", first: 10) {
                edges {
                  node {
                    key
                    value
                    type  
                  }
                }
              }
              variants(first: 10) {
                edges {
                  node {
                    id
                    price
                    barcode
                    createdAt
                  }
                }
              }
            }
          }
        }`,
      {
        variables: {
          product: {
            title: comboName, // Set combo product title directly
            productType: "Combo",
            metafields: [
              {
                namespace: "combo_products",
                key: "included_products",
                value: JSON.stringify(comboProductIds),
                type: "json",
              },
            ],
          },
        },
      },
    );

    console.log("GraphQL Response:", response);
    return response;
  }

  return new Response(JSON.stringify({ success: true, actionType }), {
    status: 200,
  });
}

function HomePage() {
  const [pageRender, setPageRender] = useState(null); // State to track the selected combo type
  const navigate = useNavigate();

  // Handle combo page render based on selection
  const handleChangeRender = (type) => {
    setPageRender(type); // Set the selected combo type
  };

  return (
    <div>
      {/* Conditionally render Normal or Discount Combo based on state */}
      {pageRender === "Normal" && <NormalComboComponent />}
      {pageRender === "Discount" && <DiscountComboComponent />}

      {/* Display combo options if no combo is selected */}
      {pageRender === null && (
        <Page
          title="Dashboard"
          secondaryActions={[
            {
              content: "View Combo Products",
              onAction: () => navigate("/app/comboProduct"),
            },
          ]}
        >
          <Grid>
            <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
              <LegacyCard title="Normal Combo" sectioned>
                <LegacyStack vertical>
                  <Text variant="bodyMd" as="p">
                    A thoughtfully curated bundle of related products.
                  </Text>
                  <Text variant="bodyMd" as="p">
                    Offers convenience by grouping complementary items together.
                  </Text>
                  <Text vvariant="bodyMd" as="p">
                    No special discounts applied—focuses on quality and
                    convenience.
                  </Text>
                  <Text vvariant="bodyMd" as="p">
                    Ideal for customers who value cohesive product collections
                  </Text>

                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <Button onClick={() => handleChangeRender("Normal")}>
                      Add Normal Combo
                    </Button>
                  </div>
                </LegacyStack>
              </LegacyCard>
            </Grid.Cell>
            <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
              <LegacyCard title="Discount Combo" sectioned>
                <LegacyStack vertical>
                  <Text variant="bodyMd" as="p">
                    A bundle of products available at a discounted price.
                  </Text>
                  <Text variant="bodyMd" as="p">
                    Provides great value for money while ensuring quality.{" "}
                  </Text>
                  <Text vvariant="bodyMd" as="p">
                    Promotes savings by offering a bundle of items at a reduced
                    price.
                  </Text>
                  <Text vvariant="bodyMd" as="p">
                    Perfect for budget-conscious shoppers looking for deals.{" "}
                  </Text>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <Button onClick={() => handleChangeRender("Discount")}>
                      Add Discount Combo
                    </Button>
                  </div>
                </LegacyStack>
              </LegacyCard>
            </Grid.Cell>
          </Grid>
        </Page>
      )}
    </div>
  );
}

export default HomePage;
