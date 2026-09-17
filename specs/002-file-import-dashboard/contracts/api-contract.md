# API Contracts: File Import Dashboard

## 1. Upload & Parse Statement

**Endpoint**: `POST /finance/api/v1/import/upload`
**Content-Type**: `multipart/form-data`

**Request Parameters**:
- `file` (File): The PDF statement file.
- `sourceType` (String): The source identifier (e.g., "YAHAV_CREDIT").

**Response**: `200 OK`
**Content-Type**: `application/json`

```json
[
  {
    "id": "uuid-1234",
    "txnMonth": "2026-08-01",
    "txnType": "Expense",
    "amount": 38.00,
    "category": "ברימאג שירות בע\"מ- ג",
    "topic": null,
    "actor": null,
    "paymentMethod": "אשראי",
    "sourceName": "אשראי יהב",
    "installments": 36,
    "installmentNo": 27,
    "remainingAmount": 342.00,
    "sheetName": "אוגוסט"
  }
]
```

## 2. Commit Transactions

**Endpoint**: `POST /finance/api/v1/import/save`
**Content-Type**: `application/json`

**Request Body**:
An array of `PendingTransactionDTO` objects representing the user-verified data from the grid.

```json
[
  {
    "txnMonth": "2026-08-01",
    "txnType": "Expense",
    "amount": 38.00,
    "category": "ברימאג שירות בע\"מ- ג",
    "topic": "Home Appliances",
    "actor": "מושלמת",
    "paymentMethod": "אשראי",
    "sourceName": "אשראי יהב",
    "installments": 36,
    "installmentNo": 27,
    "remainingAmount": 342.00,
    "sheetName": "אוגוסט"
  }
]
```

**Response**: `200 OK`
**Content-Type**: `application/json`
```json
{
  "message": "Successfully saved 1 transactions."
}
```

## 3. Get Existing Topics

**Endpoint**: `GET /finance/api/v1/transactions/topics`
**Content-Type**: `application/json`

**Response**: `200 OK`
```json
[
  "Groceries",
  "Home Appliances",
  "Utilities",
  "Clothing"
]
```
