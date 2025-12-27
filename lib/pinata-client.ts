import { PinataSDK } from 'pinata-web3';

// Upload file to Pinata via API route
export const uploadFileToPinata = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload-to-pinata', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload file');
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('Error uploading file to Pinata:', error);
    throw error;
  }
};

// Upload multiple files to Pinata
export const uploadFilesToPinata = async (files: File[]): Promise<string[]> => {
  try {
    const uploadPromises = files.map((file) => uploadFileToPinata(file));
    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error('Error uploading files to Pinata:', error);
    throw error;
  }
};

// Upload JSON metadata to Pinata via API
export const uploadMetadataToPinata = async (metadata: Record<string, any>): Promise<string> => {
  try {
    const blob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
    const file = new File([blob], 'metadata.json', { type: 'application/json' });

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload-to-pinata', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload metadata');
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('Error uploading metadata to Pinata:', error);
    throw error;
  }
};

// Get file from Pinata IPFS
export const getFileFromPinata = async (ipfsHash: string): Promise<string> => {
  const gateway = process.env.NEXT_PUBLIC_PINATA_GATEWAY || 'https://gateway.pinata.cloud';
  return `${gateway}/ipfs/${ipfsHash}`;
};
