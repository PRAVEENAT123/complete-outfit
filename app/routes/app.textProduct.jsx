import React, { useState, useEffect } from "react";
import {
  Page,
  LegacyCard,
  Button,
  TextContainer,
  ResourceList,
  TextField,
} from "@shopify/polaris";
import { Form } from "@remix-run/react";
import { authenticate } from "../shopify.server";

import { createComboProduct } from "./ComboServices/ComboServices";

export async function action({ request }) {
  // Parse the form data
  const { admin } = await authenticate.admin(request);

  const formData = await request.formData();
  const actionType = formData.get("actionType");

  if (actionType === "create") {
    console.log("Creating Combo Product");
    const comboName = formData.get("comboName");
    // Create the combo object

const selectedProducts1 = JSON.parse(formData.get("selectedProducts"));
const combo = {
  title: comboName,
  products: selectedProducts1.map((product) => ({
    name: product.title,
    productId: product.id,
  })),
};

// Correctly extract product IDs
      const comboProductIds = selectedProducts1.map((product) => product.id);
      const ComboName= selectedProducts1.map((product)=>(product.title))

console.log("Combo check", combo);

// Call the createComboProduct function
const createCompo = await createComboProduct(combo);
console.log(createCompo);

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
        title: JSON.stringify(comboName), // Set combo product title
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
      console.log(response)
      return response;
    // Create the combo object
    
  }
  return new Response(JSON.stringify({ success: true, actionType }), {
    status: 200,
  });
}

const ResourceAdd = () => {
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    // Update the hidden input field with the selected products whenever the state changes
    const selectedProductField = document.getElementById("selectedProducts");
    if (selectedProductField) {
      selectedProductField.value = JSON.stringify(selectedProducts);
    }
  }, [selectedProducts]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.target;
    const actionField = document.createElement("input");
    actionField.type = "hidden";
    actionField.name = "actionType";
    actionField.id = "actionType";
    actionField.value = "create";
    form.appendChild(actionField);

    // Submit the form
    form.submit();
  };

  const handleProductSelection = async () => {
    const selected = await shopify.resourcePicker({
      type: "product",
      multiple: true,
    });
    setSelectedProducts(selected);
  };
  const [comboName, setComboName] = useState("");

  const handleComboNameChange = (value) => {
    setComboName(value);
  };

  return (
    <Page title="Create Combo Product">
      <LegacyCard sectioned>
        <Form method="post" id="comboForm" onSubmit={handleSubmit}>
          {/* Combo Name Input */}
          <TextField
            label="Combo Name"
            name="comboName"
            value={comboName} // Controlled value
            onChange={handleComboNameChange} // Change handler
            placeholder="Enter Combo Name"
            required
          />
          {/* Hidden Field for Selected Products */}
          <input type="hidden" name="selectedProducts" id="selectedProducts" />
          {/* Product Selection */}
          <div style={{ marginTop: "20px" }}>
            <Button onClick={handleProductSelection} primary>
              Select Products
            </Button>
          </div>

          {/* Selected Products List */}
          {selectedProducts.length > 0 && (
            <div style={{ marginTop: "20px" }}>
              <TextContainer>
                <p>Selected Products:</p>
              </TextContainer>
              <ResourceList
                resourceName={{ singular: "product", plural: "products" }}
                items={selectedProducts}
                renderItem={(item) => {
                  const { id, title } = item;
                  return (
                    <ResourceList.Item
                      id={id}
                      accessibilityLabel={`View details for ${title}`}
                    >
                      <div>{title}</div>
                    </ResourceList.Item>
                  );
                }}
              />
            </div>
          )}

          {/* Submit Button */}
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button submit primary>
              Create Combo
            </Button>
          </div>
        </Form>
      </LegacyCard>
    </Page>
  );
};

export default ResourceAdd;
