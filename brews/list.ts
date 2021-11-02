import { DynamoDB } from 'aws-sdk';

const ddb = new DynamoDB.DocumentClient();

module.exports.list = (_event, _) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
  };

  ddb.scan(params, (error, result) => {
    if (error) {
      console.error(error);
      return {
        statusCode: error.statusCode || 500,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Brews not found',
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
  });
};
