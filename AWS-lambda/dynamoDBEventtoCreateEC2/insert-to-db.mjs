import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

const tableName = process.env.tableName;


export const handler = async (event) => {
    if (event.httpMethod !== 'POST') 
    {
        throw new Error(`handler only accepts POST method`);
    }

    console.info('received:', event);

    const body = JSON.parse(event.body);
    const { id, inputText, inputFilePath } = body;

    if (!id || !inputText || !inputFilePath) 
    {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Missing required fields: id, inputText, or filePath" }),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        };
    }

    const params = {
        TableName: tableName,
        Item: { id, inputText, inputFilePath }
    };

    try {
        await ddbDocClient.send(new PutCommand(params));
        console.log("Success - Item added", params.Item);
    } catch (err) {
        console.log("Error", err.stack);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal Server Error" }),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        };
    }

    const response = {
        statusCode: 200,
        body: JSON.stringify({ message: "Item added successfully", item: params.Item }),
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Methods': '*'
        }
    };

    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
};
