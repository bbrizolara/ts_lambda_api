import { DynamoDB } from 'aws-sdk';

const ddb = new DynamoDB.DocumentClient();

module.exports.get = (event, _) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
  };

  ddb.get(params, (error, result) => {
    if (error) {
      console.error(error);
      return {
        statusCode: error.statusCode || 500,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Brew not found',
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result.Item),
    };
  });
};
