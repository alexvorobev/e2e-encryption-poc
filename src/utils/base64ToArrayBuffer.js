export default function base64ToArrayBuffer(base64) {
    let byteString = window.atob(base64);
    let byteArray = new Uint8Array(byteString.length);
    for(let i=0; i < byteString.length; i++) {
        byteArray[i] = byteString.charCodeAt(i);
    }

    return byteArray;
}