# E2E Encryption PoC

The main idea of the app is to try a native browser encryption with window.crypto. In this app implemented two synthetic chats. The root element generates key pairs for both participant and share it with and between them in PEM format. Each participant import own private key and participant public key to encrypt messages that he sending and decrypt received messages. 

## Getting Started

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.
