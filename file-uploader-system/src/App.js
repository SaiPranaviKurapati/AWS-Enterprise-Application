import React, { useState } from 'react';
import { nanoid } from 'nanoid';
import './App.css';

function FileUpload() 
{
  const [file, setFile] = useState(null);
  const [inputText, setInputText] = useState("");

  const InputChange = (e) => {
    setInputText(e.target.value); 
  };

  const FileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const Upload = async () => {
    if (!file) {
      alert('Please upload a file to submit');
      return;
    }

    try 
    {
        const id = nanoid();
        const response = await fetch('https://15l5kba990.execute-api.us-east-1.amazonaws.com/Prod');
        const data = await response.json();
          
        const body = JSON.parse(data.body); 

        const uploadurl = body.uploadUrl;
        const fileName = body.fileName;
        const url = new URL(uploadurl);
        const hostname = url.hostname;
        const bucketName = hostname.split('.')[0];
        const inputFilePath = `${bucketName}.s3.amazonaws.com/${fileName}`;

        console.log("bucketName", bucketName);        
        console.log("Upload URL:", uploadurl);
        console.log("File Name:", fileName);
        console.log("Input Text", inputText);        
        
        const uploadResponse = await fetch(uploadurl, {
            method: 'PUT',
            headers: {
              'Content-Type': file.type,
            },
            body: file, 
        });

        if (uploadResponse.ok) 
        {
          const inputFilePath = `${bucketName}.s3.amazonaws.com/${fileName}`;
          console.log("File uploaded successfully to:", inputFilePath);
          alert(`File uploaded successfully! File path: ${inputFilePath}`);
        } 
        else 
        {
          alert('File upload failed!');
          console.error('Upload failed:', uploadResponse.statusText);
        }      
        
        const lambdaResponse = await fetch('https://2walw5ce6k.execute-api.us-east-1.amazonaws.com/Prod', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              id,
              inputText,
              inputFilePath,
          }),
        });
  
        if (lambdaResponse.ok) 
        {
          console.log('Data sent to Lambda successfully:', id, inputText, inputFilePath);
        } 
        else 
        {
          console.error('Failed to send data to Lambda:', lambdaResponse.statusText);
        }
      }     
      catch (error) 
      {
          console.error('Error uploading file:', error);
          alert('Error uploading file. Check the console for more information.');
      }
  };

  return (
    <div>
      <div>
        <h3>Enter text here:</h3>
        <input type="text" value={inputText} onChange={InputChange} />
      </div>
      <div>
        <h3>Select a file to upload</h3>
        <input type="file" onChange={FileChange} />
        <button onClick={Upload}>Submit</button>
      </div>      
    </div>
  );
}

export default FileUpload;
