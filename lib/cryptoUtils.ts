// lib/cryptoUtils.ts

import crypto from 'crypto';

// According to the docs, AES-256-CBC is used for encryption
export function decryptImageUrl(encryptedData: string, key: string): string {
  try {
    // The encrypted data is Base64 encoded
    const encryptedBuffer = Buffer.from(encryptedData, 'base64');
    
    // Extract IV (first 16 bytes) and actual encrypted data
    const iv = encryptedBuffer.slice(0, 16);
    const encryptedText = encryptedBuffer.slice(16);
    
    // Create key buffer from the string key (use proper key derivation in production)
    const keyBuffer = crypto.createHash('sha256').update(String(key)).digest();
    
    // Create decipher
    const decipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, iv);
    
    // Decrypt
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    
    return decrypted.toString();
  } catch (error) {
    console.error('Error decrypting image URL:', error);
    return ''; // Return empty string or handle the error as needed
  }
}