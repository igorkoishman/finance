# Quickstart & Validation: File Import Dashboard

## Prerequisites
- The backend application is running (`./mvnw spring-boot:run`).
- The frontend application is running (`npm run dev`) or built into the backend.
- A sample "אשראי יהב" PDF file is available locally.

## Validation Scenario 1: Upload and Preview
1. Navigate to `http://localhost:8081/finance/dashboard/v1/import`.
2. Select "אשראי יהב" from the Source Type dropdown.
3. Upload the sample PDF file.
4. **Expected Outcome**: The API should return `200 OK` with a JSON list of parsed transactions. The `ag-grid-react` table should instantly populate with the rows. Check that installments and amounts are parsed correctly.

## Validation Scenario 2: Edit and Commit
1. With the preview table populated, select a Global Actor from the top dropdown (e.g., "מושלמת").
2. **Expected Outcome**: The `actor` column in all rows updates to "מושלמת".
3. Select a specific topic from the dropdown on the first row.
4. Click the "Save to Database" button.
5. **Expected Outcome**: The API `POST /finance/api/v1/import/save` is called successfully (`200 OK`). You can verify in the database (`SELECT * FROM transaction_auto ORDER BY id DESC LIMIT 5`) that the rows were saved correctly with the updated topics and actors.
