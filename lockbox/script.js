async function getKey(passphrase, salt) {
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
        "raw",
        enc.encode(passphrase),
        { name: "PBKDF2" },
        false,
        ["deriveKey"]
    );

    return window.crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: salt,
            iterations: 100000,
            hash: "SHA-256"
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
    );
}

async function encryptMessage() {
    const message = document.getElementById('plainText').value;
    const passphrase = document.getElementById('passphrase').value;

    if (!message || !passphrase) {
        alert("Please provide both message and passphrase.");
        return;
    }

    const enc = new TextEncoder();
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const key = await getKey(passphrase, salt);

    const cipherText = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv },
        key,
        enc.encode(message)
    );

    const combined = new Uint8Array([...salt, ...iv, ...new Uint8Array(cipherText)]);
    const base64 = btoa(String.fromCharCode(...combined));

    document.getElementById('cipherText').value = base64;
}

async function decryptMessage() {
    const base64 = document.getElementById('cipherInput').value;
    const passphrase = document.getElementById('passphraseDecrypt').value;

    if (!base64 || !passphrase) {
        alert("Please provide both encrypted message and passphrase.");
        return;
    }

    const combined = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
    const salt = combined.slice(0, 16);
    const iv = combined.slice(16, 28);
    const data = combined.slice(28);

    try {
        const key = await getKey(passphrase, salt);
        const decrypted = await window.crypto.subtle.decrypt(
            { name: "AES-GCM", iv: iv },
            key,
            data
        );

        const dec = new TextDecoder();
        document.getElementById('decryptedText').value = dec.decode(decrypted);
    } catch (e) {
        alert("Decryption failed. Incorrect passphrase or corrupted data.");
    }
}

async function copyText(id, copyBtnID) {
    const textBox = document.getElementById(id);
    textBox.select();
    textBox.setSelectionRange(0, 99999); // For mobile devices
    navigator.clipboard.writeText(textBox.value)
    .then(() => {
        document.getElementById(copyBtnID).innerText = "copied";
        setTimeout(() => document.getElementById(copyBtnID).innerText = "copy", 1000);
    })
    .catch(err => {
        alert("Failed to copy text: " + err);
    });
}