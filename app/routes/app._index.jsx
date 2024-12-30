import { useState, useCallback } from "react";
import { useNavigate, redirect } from "react-router-dom";
import NormalComboComponent from "./app.resouresAdd";
import DiscountComboComponent from "./app.discountCombo";
import {
  Page,
  Layout,
  TextContainer,
  Text,
  LegacyCard,
  Grid,
  LegacyStack,
  Button,
  Modal,
  
} from "@shopify/polaris";
import { createComboProduct } from "./ComboServices/ComboServices";


export async function action({ request }) {
  // Parse the form data
  const formData = await request.formData();
  const actionType = formData.get("actionType");

  if (actionType === "create") {
    console.log("Creating Combo Product");
    const comboName = formData.get("comboName");
    const selectedProducts = JSON.parse(formData.get("selectedProducts"));

    // Create the combo object
    const combo1 = {
      title: comboName,
      products: selectedProducts.map((product) => ({
        id: product.id,
        title: product.title,
      })),
    };
    const selectedProducts1 = JSON.parse(formData.get("selectedProducts"));

    // Create the combo object
    const combo = {
      title: comboName,
      products: selectedProducts1.map((product) => ({
        name: product.title,
        productId: product.id,
      })),
    };
    console.log("combe cheack", combo);
    // Call the createComboProduct function
    const createCompo = await createComboProduct(combo);
    console.log(createCompo);
  }
  return new Response(JSON.stringify({ success: true, actionType }), {
    status: 200,
  });
}
function HomePage() {
  const [active, setActive] = useState(false); // State to control modal visibility
  const [selectedCombo, setSelectedCombo] = useState(""); // To track the selected combo

  const handleChange = useCallback(() => {
    setActive((prev) => !prev);
    setSelectedCombo(""); // Reset selection on modal close
  }, []);

  const handleComboSelection = (type) => {
    setSelectedCombo(type); // Set the selected combo type
  };

    const navigate = useNavigate();

    const handleShowComboPage = () => {
      return navigate("/app/resouresAdd");
    };
  return (
    <Page
      title="Dashboard"
      secondaryActions={[
        {
          content: "View Combo Products",
          onAction: () => console.log("View Combo Products"),
        },
        { content: "Add Combo Products", onAction: () => setActive(true) },
      ]}
    >
      {/* Modal with both combo options */}
      <Modal
        open={active}
        onClose={handleChange}
        title={
          selectedCombo ? `Create ${selectedCombo}` : "Choose a Combo Type"
        }
        primaryAction={
          selectedCombo
            ? {
                content: `Save ${selectedCombo}`,
                onAction: () => {
                  console.log(`${selectedCombo} Saved`);
                  handleChange();
                },
              }
            : null
        }
        secondaryActions={[
          {
            content: selectedCombo ? "Back" : "Cancel",
            onAction: selectedCombo ? () => setSelectedCombo("") : handleChange,
          },
        ]}
      >
        <Modal.Section>
          {selectedCombo ? (
            selectedCombo === "Normal Combo" ? (
              <NormalComboComponent />
            ) : (
              <DiscountComboComponent />
            )
          ) : (
            <Grid>
              <Grid.Cell columnSpan={{ xs: 6, sm: 6 }}>
                <LegacyCard title="Normal Combo" sectioned>
                  <LegacyStack vertical>
                    <Text variant="bodyMd" as="p">
                      A thoughtfully curated bundle of related products.
                    </Text>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <Button
                        onClick={() => handleComboSelection("Normal Combo")}
                      >
                        Select Normal Combo
                      </Button>
                    </div>
                  </LegacyStack>
                </LegacyCard>
              </Grid.Cell>
              <Grid.Cell columnSpan={{ xs: 6, sm: 6 }}>
                <LegacyCard title="Discount Combo" sectioned>
                  <LegacyStack vertical>
                    <Text variant="bodyMd" as="p">
                      A bundle of products available at a discounted price.
                    </Text>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <Button
                        onClick={() => handleComboSelection("Discount Combo")}
                      >
                        Select Discount Combo
                      </Button>
                    </div>
                  </LegacyStack>
                </LegacyCard>
              </Grid.Cell>
            </Grid>
          )}
        </Modal.Section>
      </Modal>

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
                No special discounts applied—focuses on quality and convenience.
              </Text>
              <Text vvariant="bodyMd" as="p">
                Ideal for customers who value cohesive product collections
              </Text>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button onClick={() => setActive(true)}>
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
                <Button onClick={() => setActive(true)}>
                  Add Discount Combo
                </Button>
              </div>
            </LegacyStack>
          </LegacyCard>
        </Grid.Cell>
      </Grid>
    </Page>
  );
}

export default HomePage;
