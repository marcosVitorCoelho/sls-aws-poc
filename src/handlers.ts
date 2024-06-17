import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import AWS from "aws-sdk";
import { String } from "aws-sdk/clients/cloudhsm";
import { v4 } from "uuid";

const docClient = new AWS.DynamoDB.DocumentClient();
const TableName = "ProductsTable";

export async function createProduct(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const reqBody = JSON.parse(event.body as String);

  const product = {
    ...reqBody,
    productID: v4(),
  };

  await docClient
    .put({
      TableName: TableName,
      Item: product,
    })
    .promise();

  return {
    statusCode: 201,
    body: JSON.stringify(product),
  };
}

export async function getProduct(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const id = event.pathParameters?.id;

  const output = await docClient
    .get({
      TableName: TableName,
      Key: {
        productID: id,
      },
    })
    .promise();

  if (!output.Item) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: "Not found" }),
    };
  }
  return {
    statusCode: 200,
    body: JSON.stringify(output.Item),
  };
}

export async function updateProduct(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const id = event.pathParameters?.id;

  const output = await docClient
    .get({
      TableName: TableName,
      Key: {
        productID: id,
      },
    })
    .promise();

  if (!output.Item) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: "Not found" }),
    };
  }

  const reqBody = JSON.parse(event.body as String);

  const product = {
    ...reqBody,
    productID: id,
  };

  await docClient
    .put({
      TableName: TableName,
      Item: product,
    })
    .promise();

  return {
    statusCode: 200,
    body: JSON.stringify(product),
  };
}
