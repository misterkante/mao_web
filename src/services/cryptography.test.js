import { describe, it, expect } from 'vitest';
import { encryptId, decryptId } from './cryptography';

describe('Fonctions de chiffrement', () => {
  it('devrait chiffrer une donnée puis la déchiffrer pour retrouver la valeur originale', () => {
    const originalId = 12345;

    const encryptedId = encryptId(originalId);
    const decryptedString = decryptId(encryptedId);
    const finalId = parseInt(decryptedString, 10);

    expect(encryptedId).not.toBe(String(originalId));
    expect(finalId).toBe(originalId);
  });

  it('ne devrait pas avoir de lien entre deux chiffrements de la même donnée', () => {
    const id = 987;
    const encryptedId1 = encryptId(id);
    const encryptedId2 = encryptId(id);

    expect(encryptedId1).not.toBe(encryptedId2);
  });
});
