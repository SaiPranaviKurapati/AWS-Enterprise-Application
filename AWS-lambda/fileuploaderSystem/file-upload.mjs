import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const handler = async (event) => {
    const bucketName = 'cfprojectbucket'; 
    const objectName = `uploads/${new Date().toISOString()}.txt`; 
    const expirySeconds = 60 * 5; 

    const s3Client = new S3Client({ region: "us-east-1" }); 

    const putCommand = new PutObjectCommand({
        Bucket: bucketName,
        Key: objectName,
    });

    try 
    {
        
        const url = await getSignedUrl(s3Client, putCommand, { expiresIn: expirySeconds });

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*", 
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ uploadUrl: url, fileName: objectName }),
        };
    } 
    catch (error) 
    {
        console.error("Error generating pre-signed URL", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error generating pre-signed URL" }),
        };
    }
};
