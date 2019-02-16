import { APIGatewayProxyHandler } from 'aws-lambda';
import * as AWS from 'aws-sdk';
const dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10', region: process.env.REGION});

const category_id = '9E66EBBF-A3AE-4490-8AC6-CB9AEC15C1F7';

export const hello: APIGatewayProxyHandler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless Webpack (Typescript) v1.0! Your function executed successfully!',
      input: event,
    }),
  };
}

export const init: APIGatewayProxyHandler = async (event, context) => {
  let statusCode = 200;
  let message = 'ok';
  try {
    const items = await scanItems();
    items.forEach(async item => {
      await deleteItem(item.id.S);
    });
    await putCategory(1);
  } catch (err) {
    statusCode = 500;
    message = `error: ${err}`;
  }
  return {
    statusCode: statusCode,
    body: JSON.stringify({
      message: message,
      input: event,
    }),
  };
}

function putCategory(limit: number): Promise<void> {
  const params = {
    TableName: `${process.env.DYNAMO_PREFIX}-transaction-categories`,
    Item: {
      id: {
        S: category_id
      },
      limit: {
        N: `${limit}`
      }
    }
  };
  return new Promise((resolve, reject) => {
    dynamodb.putItem(params, function(err, data) {
      if (err) {
        console.log(err, err.stack);
        return reject(err);
      } else {
        return resolve()
      }
    });
  });
}

function scanItems(): Promise<any> {
  const params = {
    TableName: `${process.env.DYNAMO_PREFIX}-transaction-items`,
  };
  return new Promise((resolve, reject) => {
    dynamodb.scan(params, function(err, data) {
      if (err) {
        console.log(err, err.stack);
        return reject(err);
      } else {
        return resolve(data.Items)
      }
    });
  });
}

function deleteItem(id: string): Promise<void> {
  const params = {
    TableName: `${process.env.DYNAMO_PREFIX}-transaction-items`,
    Key: {
      id: {
        S: id
      }
    }
  };
  return new Promise((resolve, reject) => {
    dynamodb.deleteItem(params, function(err, data) {
      if (err) {
        console.log(err, err.stack);
        return reject(err);
      } else {
        return resolve()
      }
    });
  });
}
