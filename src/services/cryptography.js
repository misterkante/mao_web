import CryptoJS from 'crypto-js';

const SECRET_KEY = 'your-super-secret-key-from-env-file';

/**
 * Chiffre un texte (ou un ID converti en chaîne).
 */
export const encryptId = (data) => {
    const dataAsString = String(data);
    return CryptoJS.AES.encrypt(dataAsString, SECRET_KEY).toString();
};

/**
 * Déchiffre un texte.
 */
export const decryptId = (ciphertext) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
};
