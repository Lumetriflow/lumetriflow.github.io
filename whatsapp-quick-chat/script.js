const phoneInput = document.getElementById("num");
const goBtn = document.getElementById("go");
const cc = document.getElementById("cc");

phoneInput.addEventListener("input", () => {
    goBtn.disabled = phoneInput.value.trim() === "";
});

goBtn.addEventListener("click", () => {
    const fullPhoneNumber = cc.value + phoneInput.value.trim();
    window.location.href = `whatsapp://send?phone=${fullPhoneNumber}&text=Hello`;
});
