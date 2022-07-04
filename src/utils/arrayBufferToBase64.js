export default function arrayBufferToBase64(arrayBuffer) {
    let byteArray = new Uint8Array(arrayBuffer);
    let byteString = '';
    for (let i = 0; i < byteArray.byteLength; i++) {
        byteString += String.fromCharCode(byteArray[i]);
    }
    let base64 = window.btoa(byteString);

    return base64;
}