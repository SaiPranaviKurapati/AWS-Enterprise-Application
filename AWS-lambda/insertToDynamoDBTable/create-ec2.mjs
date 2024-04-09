import { EC2Client, RunInstancesCommand } from "@aws-sdk/client-ec2";

const ec2Client = new EC2Client({ region: "us-east-1" });

export const handler = async (event) => {
    for (const record of event.Records) 
    {   

        if (record.eventName === 'INSERT') {
            
            const bucketName = "cfprojectbucket";
            let parts = record.dynamodb.NewImage.inputFilePath.S.split('/');
            let inputFile = parts[parts.length - 1];
        
            const outputFile = "OutputFile.txt";
            const dynamoDBTable = "cf_table";
            const id = "11J";
            const outputFilePath = `${bucketName}/${outputFile}`;
            const inputText =  record.dynamodb.NewImage.inputText.S; 
            
            const userData = `#!/bin/bash
            aws s3 cp s3://${bucketName}/${inputFile} /tmp/${inputFile}

            echo "${inputText}" >> /tmp/${inputFile}
            mv /tmp/${inputFile} /tmp/${outputFile}
            
            aws s3 cp /tmp/${outputFile} s3://${outputFilePath}
            
            aws dynamodb put-item --table-name ${dynamoDBTable} --item '{ "id": {"S": "${id}"}, "output_file_path": {"S": "s3://${outputFilePath}"} }' --region us-east-1
            shutdown -h now

            instance_id=$(curl http://169.254.169.254/latest/meta-data/instance-id)
            aws ec2 terminate-instances --instance-ids $instance_id --region us-east-1
        `;        
        
            const userDataEncoded = Buffer.from(userData).toString('base64');
            console.info("Event: ", JSON.stringify(event, null, 2));
            
            const params = {
                ImageId: 'ami-051f8a213df8bc089',
                InstanceType: 't2.micro',
                MinCount: 1,
                MaxCount: 1,
                UserData: userDataEncoded,
                IamInstanceProfile: {'Arn': 'arn:aws:iam::719898703762:role/service-role/cf_roles'}
            };

            try 
            {
                const command = new RunInstancesCommand(params);
                const data = await ec2Client.send(command);
                console.info("Successfully launched EC2 instance", data.Instances[0].InstanceId);
            } 
            catch (error) 
            {
                console.error("Error creating EC2 instance: ", error);
                throw error;
            }
        }
    }
};
