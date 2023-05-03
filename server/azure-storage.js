import {
    BlobServiceClient
  } from '@azure/storage-blob';

const config = require('config');


const accountName = config.get('accountName');
const sasToken = config.get('sasToken');

const blobServiceClient = new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net?${sasToken}`
);

const containerName = config.get('containerName');

export const uploadTodos = async (todos) => {
  try {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient('todos.json');
    const jsonTodos = JSON.stringify(todos);
    await blockBlobClient.upload(jsonTodos, jsonTodos.length);
    console.log('Todos uploaded to Azure Blob Storage');
  } catch (error) {
    console.error('Error uploading todos:', error);
  }
};

export const fetchTodos = async () => {
  try {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient('todos.json');
    const response = await blockBlobClient.download(0);
    const jsonResponse = await fetchBlobToString(response._response.url);
    return JSON.parse(jsonResponse);
  } catch (error) {
    console.error('Error fetching todos:', error);
  }
};

const fetchBlobToString = async (url) => {
    const response = await RNFetchBlob.fetch('GET', url);
    return response.text();
};  

