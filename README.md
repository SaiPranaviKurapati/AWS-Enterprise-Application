# AWS Enterprise Application

## Overview

This project outlines the frontend process of a system designed to accept user inputs through a web interface, upload files to an AWS S3 bucket, insert data into a DynamoDB table, and trigger further processing including EC2 instance creation and file manipulation.

## System Components

- **Frontend Interface:** Built with React.js
- **Backend Services:** AWS Lambda, DynamoDB, S3 Bucket, EC2 Instance, IAM Roles
- **API Gateway:** fileUploaderGateway, DynamoDBInsertionAPI

## ReactJS Application Setup

This repository contains a ReactJS application.Please follow the instructions below to get the application up and running on your local development environment.

### Prerequisites

- **Node.js**: version v18.18.0 or later
- **npm**: version 10.5.1 or later
- **nanoid**

### Setup Instructions

#### 1. Clone the Repository
```bash
git clone https://github.com/SaiPranaviKurapati/Fovus_Coding_Challenge_Submission.git
```

#### 2. Navigate to the Project Directory ,Change into the project directory using
```bash
cd file-uploader-system
```

#### 3. To launch the application, run the following command
```bash
npm start
```
## Step-by-Step Process used in the Implementation of the project

### 1. User Interface Interaction

The frontend React UI presents the user with:
- An input text field.
- An input file uploader.
- A submit button.

### 2. File and Text Submission

Users attach a file, enter text into the provided field, and click the submit button to initiate the process.

### 3. Pre-signed URL Generation

Upon submission, the frontend calls a Lambda function named `fileuploaderSystem`, which retrieves a pre-signed URL from the `fileUploaderGateway` API Gateway.

### 4. File Upload to S3 Bucket

With the pre-signed URL, the React application uploads the input file directly to the specified AWS S3 bucket.

### 5. Data Insertion into DynamoDB

Next, the React app makes a POST API call to the `DynamoDBInsertionAPI` (via API Gateway) to insert the submission details into a DynamoDB table named `cf_table`.

This insertion includes:
- A unique ID (generated using nano ID).
- The input text.
- The input file path (constructed as `bucketname/filename`).

### 6. DynamoDB Event Trigger

The insertion into `cf_table` triggers an event, which in turn calls the Lambda function `dynamoDBEventtoCreateEC2`.

### 7. EC2 Instance Creation and Processing

The `dynamoDBEventtoCreateEC2` function:
- Creates an EC2 instance.
- Executes a script to:
  - Retrieve the input file path and text using the event's ID.
  - Download the file from the S3 bucket.
  - Merge the input text with the file.
  - Upload the modified file back to the S3 bucket.
- Terminates the instance upon completion of the script.

## Conclusion

The frontend procedure for processing files, submitting user input, and initiating backend activities within the project has been described in depth in this document. This method shows how to combine a React frontend with a variety of AWS services to create a seamless file processing and data management system.


## References Used for Coding

The resources include:

- **YouTube tutorials**: Various tutorials were watched to gain a deeper understanding of AWS services.
- **AWS Documentation**: The official AWS documentation was referred to for detailed steps of implementation. Some of the specific pages consulted include:

  - [AWS CodeCommit User Guide - Setting up for AWS CodeCommit](https://docs.aws.amazon.com/codecommit/latest/userguide/how-to-notify-lambda-cc.html) - This guide helped in setting up notifications for AWS Lambda with AWS CodeCommit.
  
  - [Amazon EC2 User Guide - Instance User Data](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/user-data.html) - Provided information on how to make use of user data to configure instances upon startup.
  
  - [Amazon S3 User Guide - Uploading Objects](https://docs.aws.amazon.com/AmazonS3/latest/userguide/upload-objects.html) - Offered guidance on how to upload files and objects to Amazon S3.


## Contact

For further information, please contact:

- Sai Pranavi Kurapati
- Email: saipranavi.kurapati@sjsu.edu
