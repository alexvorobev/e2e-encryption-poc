import { useEffect, useState } from 'react';
import arrayBufferToBase64 from '../utils/arrayBufferToBase64';

function addNewLines(str) {
  var finalString = '';
  while (str.length > 0) {
    finalString += str.substring(0, 64) + '\n';
    str = str.substring(64);
  }

  return finalString;
}

function toPem(privateKey) {
  var b64 = addNewLines(arrayBufferToBase64(privateKey));

  return b64;
}

const useGenerateKeys = () => {
  const [privateKey, setPrivateKey] = useState(null);
  const [publicKey, setPublicKey] = useState(null);

  useEffect(() => {
    window.crypto.subtle
      .generateKey(
        {
          name: 'RSA-OAEP',
          modulusLength: 2048,
          publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
          hash: 'SHA-256',
        },
        true,
        ['encrypt', 'decrypt'],
      )
      .then(async function (keyPair) {
        window.crypto.subtle
          .exportKey('pkcs8', keyPair.privateKey)
          .then((exportedPrivateKey) => setPrivateKey(toPem(exportedPrivateKey)));

        window.crypto.subtle
          .exportKey('spki', keyPair.publicKey)
          .then((exportedPublicKey) => setPublicKey(toPem(exportedPublicKey)));
      });
  }, []);

  return {
    privateKey,
    publicKey,
  };
};

export default useGenerateKeys;
