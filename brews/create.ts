import { DynamoDB } from 'aws-sdk';
import * as uuid from 'uuid';
import 'source-map-support/register';

type requestParams = {
  id: string;
  brewName: string;
  breweryName: string;
  brewStyle: string;
};

const ddb = new DynamoDB.DocumentClient();

const sendErrorResponse = (errorMessage: string) => {
  return {
    statusCode: 500,
    body: JSON.stringify({
      message: errorMessage,
    }),
  };
};

module.exports.create = (event, _context) => {
  const requestBody: requestParams = JSON.parse(event.body);
  const { brewName, breweryName, brewStyle } = requestBody;
  const timestamp = new Date().getTime();

  try {
    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      Item: {
        id: uuid.v1(),
        brewName,
        breweryName,
        brewStyle,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    };

    ddb.put(params, (error, _) => {
      // handle errors
      if (error) {
        console.error(error);
        return sendErrorResponse(error.message);
      }

      return {
        statusCode: 201,
        body: JSON.stringify(params.Item),
      };
    });
  } catch (err) {
    console.error(err);
    return sendErrorResponse(err);
  }
};
