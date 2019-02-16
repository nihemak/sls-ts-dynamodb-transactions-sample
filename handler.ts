import { APIGatewayProxyHandler } from 'aws-lambda';
import * as AWS from 'aws-sdk';
const dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10', region: process.env.REGION});

export const hello: APIGatewayProxyHandler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless Webpack (Typescript) v1.0! Your function executed successfully!',
      input: event,
    }),
  };
}

export const init: APIGatewayProxyHandler = (event, context, callback) => {
  const params = {
    TableName: `${process.env.DYNAMO_PREFIX}-transaction-categories`,
    Item: {
      id: {
        S: '9E66EBBF-A3AE-4490-8AC6-CB9AEC15C1F7'
      },
      limit: {
        N: '1'
      }
    }
  };
  dynamodb.putItem(params, function(err, data) {
    if (err) {
      console.log(err, err.stack);
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({
          message: `error: ${err}`,
          input: event,
        }),
      });
    } else {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: 'ok',
          input: event,
        }),
      });
    }
  });
}
