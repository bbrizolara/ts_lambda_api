import { DynamoDB } from 'aws-sdk';

const ddb = new DynamoDB.DocumentClient();

type requestParams = {
  brewName: string;
  breweryName: string;
  brewStyle: string;
};

const sendErrorResponse = (statusCode: number, errorMessage: string) => {
  return {
    statusCode: statusCode,
    body: JSON.stringify({
      message: errorMessage,
    }),
  };
};

module.exports.update = (event, _) => {
  const timestamp = new Date().getTime();
  const data: requestParams = JSON.parse(event.body);
  const { breweryName, brewName, brewStyle } = data;

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
    ExpressionAttributeNames: {
      '#brewName': ':brewName',
      '#breweryName': ':breweryName',
      '#brewStyle': ':brewStyle',
      '#updatedAt': ':updatedAt',
    },
    ExpressionAttributeValues: {
      ':brewName': brewName,
      ':breweryName': breweryName,
      ':brewStyle': brewStyle,
      ':updatedAt': timestamp,
    },
    UpdateExpression:
      'SET #brewName = :brewName, #breweryName = :breweryName, #brewStyle = :brewStyle, #updatedAt = :updatedAt',
    ReturnValues: 'ALL_NEW',
  };

  ddb.update(params, (error, result) => {
    if (error) {
      console.error(error);
      return sendErrorResponse(error.statusCode || 500, error.message);
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
    };
  });
};
