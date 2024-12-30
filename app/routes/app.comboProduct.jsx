import {
  LegacyCard,
  IndexTable,
  Text,
  Badge,
  Page,
  Button,
} from "@shopify/polaris";
import { useNavigate, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { getCompoProduct } from "./ComboServices/ComboServices";

// Loader function to fetch combo products
export async function loader() {
  const products = await getCompoProduct();
  if (products.error) {
    return json({ error: products.error, details: products.details });
  }
  return json(products);
}

// Component to display the combo products in the table
function ComboProductTable() {
  const  products  = useLoaderData(); // Get the combo products from the loader data

  if (!products) {
    return <Text>Error: No products available</Text>;
  }

  const resourceName = {
    singular: "combo product",
    plural: "combo products",
  };

  // Render the rows for each combo product and its associated products
  const rowMarkup = products.map(
    ({ id, title, products: associatedProducts }, index) => (
      <IndexTable.Row id={id} key={id} position={index}>
        <IndexTable.Cell>
          <Text variant="bodyMd" fontWeight="bold" as="span">
            {title}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>{associatedProducts.length}</IndexTable.Cell>{" "}
        {/* Show number of products in combo */}
        <IndexTable.Cell>
          {associatedProducts.map((product) => (
            <Text key={product.id}>{product.name}</Text> // Display each product name
          ))}
        </IndexTable.Cell>
        <IndexTable.Cell>
          {/* Add any additional fields if necessary */}
        </IndexTable.Cell>
      </IndexTable.Row>
    ),
  );
  return (
    <Page
      backAction={{ onAction: () => history.back() }}
      title="Combo Products"
    >
      <LegacyCard>
        <IndexTable
          resourceName={resourceName}
          itemCount={products.length}
          headings={[
            { title: "Combo Product" },
            { title: "Number of Products" },
            { title: "Products" },
          ]}
        >
          {rowMarkup}
        </IndexTable>
      </LegacyCard>
    </Page>
  );
}
export default ComboProductTable;
