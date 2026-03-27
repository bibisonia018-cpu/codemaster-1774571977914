import CryptoJS from 'crypto-js';

// Encrypt a message using AES
export const encryptMessage = (text, secretKey) => {
  try {
    return CryptoJS.AES.encrypt(text, secretKey).toString();
  } catch (error) {
    console.error("Encryption failed", error);
    return null;
  }
};

// Decrypt an AES message
export const decryptMessage = (ciphertext, secretKey) => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText || "🔒 [رسالة مشفرة بمفتاح خاطئ]";
  } catch (error) {
    return "🔒 [لا يمكن فك التشفير]";
  }
};