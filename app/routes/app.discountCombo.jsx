import React, { useState, useEffect } from "react";
import {
  Page,
  LegacyCard,
  Button,
  TextContainer,
  ResourceList,
  TextField,
  Thumbnail,
} from "@shopify/polaris";
import { Form } from "@remix-run/react";


const ResourceAdd = () => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [comboName, setComboName] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [setCompoPrice, setDiscountPercentagePrice] = useState("");

  useEffect(() => {
    const selectedProductField = document.getElementById("selectedProducts");
    if (selectedProductField) {
      selectedProductField.value = JSON.stringify(selectedProducts);
    }
  }, [selectedProducts]);



  const handleProductSelection = async () => {
    const selected = await shopify.resourcePicker({
      type: "product",
      multiple: true,
    });
    setSelectedProducts(selected);
  };

  const handleComboNameChange = (value) => {
    setComboName(value);
  };

  const handleDiscountChange = (value) => {
    setDiscountPercentage(value);
  };

  const calculateDiscountedPrice = (price) => {
    return (price - (price * discountPercentage) / 100).toFixed(2);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;

    const actionField = document.createElement("input");
    actionField.type = "hidden";
    actionField.name = "actionType";
    actionField.id = "actionType";
    actionField.value = "create-discount";
    form.appendChild(actionField);
    form.submit();
  };

  return (
    <Page
      title="Create Discount Combo Product"
      backAction={{ onAction: () => history.back() }}
    >
      <LegacyCard sectioned>
        <Form method="post" id="comboForm" onSubmit={handleSubmit}>
          {/* Combo Name Input */}
          <TextContainer>
            <h2 style={{ marginBottom: "10px" }}>Step 1: Enter Combo Name</h2>
          </TextContainer>
          <TextField
            label="Combo Name"
            name="comboName"
            value={comboName}
            onChange={handleComboNameChange}
            placeholder="Enter Combo Name"
            required
            style={{ marginBottom: "10" }}
          />
          <br />

          {/* Discount Percentage Input */}
          <TextContainer>
            <h2 style={{ marginTop: "10px", marginBottom: "10px" }}>
              Step 2: Set Discount Percentage
            </h2>
          </TextContainer>
          <TextField
            label="Discount Percentage"
            type="number"
            value={discountPercentage}
            onChange={handleDiscountChange}
            suffix="%"
            placeholder="Enter discount (e.g., 10 for 10%)"
          />

          {/* Hidden Field for Selected Products */}
          <input type="hidden" name="selectedProducts" id="selectedProducts" />
          <br />
          <TextContainer>
            <div style={{ display: "flex", justifyContent: "start" }}>
              <div>
                <h2 style={{ marginTop: "10px", marginBottom: "10px" }}>
                  Step 3: Select The Product
                </h2>
              </div>

              <div style={{ marginLeft: "30px", marginTop: "5px" }}>
                <Button onClick={handleProductSelection} primary>
                  Select Products
                </Button>
              </div>
            </div>
          </TextContainer>
          {/* Product Selection */}

          {/* Selected Products Table */}
          {selectedProducts.length > 0 && (
            <div style={{ marginTop: "20px" }}>
              <TextContainer>
                <p>Selected Products with Discounted Prices:</p>
              </TextContainer>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th
                      style={{
                        borderBottom: "1px solid #ccc",
                        padding: "10px",
                      }}
                    >
                      Image
                    </th>
                    <th
                      style={{
                        borderBottom: "1px solid #ccc",
                        padding: "10px",
                      }}
                    >
                      Product Name
                    </th>
                    <th
                      style={{
                        borderBottom: "1px solid #ccc",
                        padding: "10px",
                      }}
                    >
                      Original Price
                    </th>
                    <th
                      style={{
                        borderBottom: "1px solid #ccc",
                        padding: "10px",
                      }}
                    >
                      Discounted Price
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProducts.map((product) => {
                    // Check if the product has variants and if the price exists
                    const originalPrice = product.variants?.[0]?.price || "N/A";
                    const discountedPrice =
                      originalPrice === "N/A"
                        ? "N/A"
                        : calculateDiscountedPrice(originalPrice);

                    return (
                      <tr key={product.id}>
                        <td
                          style={{
                            padding: "1px",
                            textAlign: "center",
                            alignItems: "center",
                          }}
                        >
                          <Thumbnail
                            source={product.image?.src || ""}
                            alt={product.title}
                            size="small"
                          />
                        </td>
                        <td style={{ padding: "10px" }}>{product.title}</td>
                        <td style={{ padding: "10px" }}>{originalPrice}</td>
                        <td style={{ padding: "10px" }}>{discountedPrice}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <input type="hidden" id="price" name="price" value="100" />

          {/* Submit Button */}
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button submit primary>
              Create Discount Combo
            </Button>
          </div>
        </Form>
      </LegacyCard>
    </Page>
  );
};

export default ResourceAdd;
