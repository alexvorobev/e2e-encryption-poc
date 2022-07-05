import { useEffect, useState } from 'react';

import base64ToArrayBuffer from '../../../utils/base64ToArrayBuffer';

const useKeys = ({ publicKey, privateKey, participantKey }) => {
  const [privateKeyCrypto, setPrivateKeyCrypto] = useState(null);
  const [publicKeyCrypto, setPublicKeyCrypto] = useState(null);
  const [participantPublicKeyCrypto, setParticipantPublicKeyCrypto] = useState(null);

  useEffect(() => {
    if (privateKey && privateKey && participantKey) {
      const binaryPublicKey = base64ToArrayBuffer(publicKey);
      const binaryPrivateKey = base64ToArrayBuffer(privateKey);
      const binaryParticipantPublicKey = base64ToArrayBuffer(participantKey);

      window.crypto.subtle
        .importKey(
          'pkcs8',
          binaryPrivateKey,
          {
            name: 'RSA-OAEP',
            hash: { name: 'SHA-256' },
          },
          true,
          ['decrypt'],
        )
        .then(function (importedPrivateKey) {
          setPrivateKeyCrypto(importedPrivateKey);
        });

      window.crypto.subtle
        .importKey(
          'spki',
          binaryPublicKey,
          {
            name: 'RSA-OAEP',
            hash: 'SHA-256',
          },
          true,
          ['encrypt'],
        )
        .then(function (importedPublicKey) {
          setPublicKeyCrypto(importedPublicKey);
        });

      window.crypto.subtle
        .importKey(
          'spki',
          binaryParticipantPublicKey,
          {
            name: 'RSA-OAEP',
            hash: 'SHA-256',
          },
          true,
          ['encrypt'],
        )
        .then(function (importedParticipantPublicKey) {
          setParticipantPublicKeyCrypto(importedParticipantPublicKey);
        });
    }
  }, [participantKey, privateKey, publicKey]);

  return {
    privateKey: privateKeyCrypto,
    publicKey: publicKeyCrypto,
    participantKey: participantPublicKeyCrypto,
  };
};

export default useKeys;
