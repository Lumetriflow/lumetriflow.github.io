let locked = false;
let originalWidth = 1920;
let originalHeight = 1080;
let originalRatio = originalWidth / originalHeight;

function gcd(a, b) {
    return b == 0 ? a : gcd(b, a % b);
}

function onLockToggle() {
    locked = document.getElementById('lockRatio').checked;
    if (locked) {
        const width = parseInt(document.getElementById('widthInput').value, 10);
        const height = parseInt(document.getElementById('heightInput').value, 10);
        originalRatio = width / height;
        originalWidth = width;
        originalHeight = height;
    }
}

function onWidthChange() {
    if (locked) {
        const width = parseInt(document.getElementById('widthInput').value, 10);
        const height = Math.round(width / originalRatio);
        document.getElementById('heightInput').value = height;
    }
    calculateAspectRatio();
}

function onHeightChange() {
    if (locked) {
        const height = parseInt(document.getElementById('heightInput').value, 10);
        const width = Math.round(height * originalRatio);
        document.getElementById('widthInput').value = width;
    }
    calculateAspectRatio();
}

function calculateAspectRatio() {
    let width = parseInt(document.getElementById('widthInput').value, 10);
    let height = parseInt(document.getElementById('heightInput').value, 10);

    const divisor = gcd(width, height);
    const simplifiedWidth = width / divisor;
    const simplifiedHeight = height / divisor;

    document.getElementById('output').textContent = `Aspect Ratio: ${simplifiedWidth}:${simplifiedHeight}`;

    drawShape(simplifiedWidth, simplifiedHeight);
}

function drawShape(ratioWidth, ratioHeight) {
    const canvas = document.getElementById('ratioCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const maxDimension = 250;
    let drawWidth, drawHeight;

    if (ratioWidth > ratioHeight) {
        drawWidth = maxDimension;
        drawHeight = (ratioHeight / ratioWidth) * maxDimension;
    } else {
        drawHeight = maxDimension;
        drawWidth = (ratioWidth / ratioHeight) * maxDimension;
    }

    ctx.fillStyle = "#4CAF50";
    ctx.fillRect(
        (canvas.width - drawWidth) / 2,
        (canvas.height - drawHeight) / 2,
        drawWidth,
        drawHeight
    );
}

window.onload = calculateAspectRatio;
