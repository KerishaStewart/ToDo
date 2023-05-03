const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const stream = require('stream');
const config = require('config');
const { BlobServiceClient } = require('@azure/storage-blob');

const app = express();
app.use(cors());
app.use(bodyParser.json());

//console.log(process.env.NODE_ENV);

const sasToken = config.get('sasToken');
const containerName = config.get('containerName');
const accountName = config.get('accountName');
let blobServiceClient = null;
try {
     blobServiceClient = new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net?${sasToken}`
  );
}
catch (error) {
  console.log('Error occurred while trying to connect to the Blob client: ', error);
}

app.get('/tasks', async (req, res) => {
  try {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const tasks = [];

    for await (const blob of containerClient.listBlobsFlat()) {
      const blobClient = containerClient.getBlobClient(blob.name);
      const response = await blobClient.download();
      const task = JSON.parse(await blobToString(response.readableStreamBody));
      tasks.push(task);
    }

    res.json(tasks);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/tasks', async (req, res) => {
  try {
    const task = req.body;
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlockBlobClient(`${task.id}.json`);
    await blobClient.upload(JSON.stringify(task), Buffer.byteLength(JSON.stringify(task)));

    res.status(201).json(task);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// Update
app.put('/tasks/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = req.body;
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlockBlobClient(`${taskId}.json`);
    await blobClient.upload(JSON.stringify(task), Buffer.byteLength(JSON.stringify(task)));

    res.status(200).json(task);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/tasks/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlockBlobClient(`${taskId}.json`);
    await blobClient.delete();

    res.status(204).end();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

const blobToString = async (readableStream) => {
    return new Promise((resolve, reject) => {
        const chunks = [];
        readableStream.on('data', (chunk) => {
        chunks.push(chunk);
        });
        readableStream.on('end', () => {
        resolve(Buffer.concat(chunks).toString('utf8'));
        });
        readableStream.on('error', reject);
    });
};  

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});