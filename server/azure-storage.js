import {
    BlobServiceClient
  } from '@azure/storage-blob';

const accountName = 'testad7a';
const sasToken = 'sp=racwdl&st=2023-04-26T00:37:23Z&se=2023-04-26T08:37:23Z&spr=https&sv=2021-12-02&sr=c&sig=1eeLK7Q%2FyeRjAQwKSj8WsomgbFiQvGqV3FTcgNYl2pg%3D';

const blobServiceClient = new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net?${sasToken}`
);

const containerName = 'todos';

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

