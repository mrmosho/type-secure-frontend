import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';

export const EncryptionPage: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [encryptedText, setEncryptedText] = useState('');
  const [keyPair, setKeyPair] = useState<CryptoKeyPair | null>(null);
  const [exportedPublicKey, setExportedPublicKey] = useState<string>('');
  const [exportedPrivateKey, setExportedPrivateKey] = useState<string>('');

  const generateKeys = async () => {
    try {
      const generatedKeyPair = await window.crypto.subtle.generateKey(
        {
          name: 'RSA-OAEP',
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: 'SHA-256'
        },
        true,
        ['encrypt', 'decrypt']
      );

      setKeyPair(generatedKeyPair);

      // Export the public key
      const exportedPubKey = await window.crypto.subtle.exportKey(
        'spki',
        generatedKeyPair.publicKey
      );
      const exportedPubKeyString = btoa(
        String.fromCharCode(...new Uint8Array(exportedPubKey))
      );
      setExportedPublicKey(exportedPubKeyString);

      // Export the private key
      const exportedPrivKey = await window.crypto.subtle.exportKey(
        'pkcs8',
        generatedKeyPair.privateKey
      );
      const exportedPrivKeyString = btoa(
        String.fromCharCode(...new Uint8Array(exportedPrivKey))
      );
      setExportedPrivateKey(exportedPrivKeyString);
    } catch (error) {
      console.error('Error generating keys:', error);
    }
  };

  const handleEncrypt = async () => {
    if (!keyPair || !inputText) return;

    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(inputText);
      
      const encrypted = await window.crypto.subtle.encrypt(
        {
          name: 'RSA-OAEP'
        },
        keyPair.publicKey,
        data
      );

      const encryptedBase64 = btoa(
        String.fromCharCode(...new Uint8Array(encrypted))
      );
      setEncryptedText(encryptedBase64);
    } catch (error) {
      console.error('Encryption error:', error);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Secure Text Encryption
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Button 
          variant="contained" 
          onClick={generateKeys} 
          sx={{ mb: 2 }}
        >
          Generate New Key Pair
        </Button>

        <TextField
          fullWidth
          multiline
          rows={4}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          label="Enter sensitive text"
          sx={{ mb: 2 }}
        />

        <Button 
          variant="contained" 
          onClick={handleEncrypt}
          disabled={!keyPair || !inputText}
        >
          Encrypt Text
        </Button>
      </Paper>

      {encryptedText && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Encrypted Result
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={encryptedText}
            InputProps={{ readOnly: true }}
            sx={{ mb: 2 }}
          />

          <Typography variant="h6" gutterBottom>
            Private Key (Keep this secure!)
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={exportedPrivateKey}
            InputProps={{ readOnly: true }}
          />
        </Paper>
      )}
    </Box>
  );
};

export default EncryptionPage;