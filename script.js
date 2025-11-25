// --------- Navigation (Sidebar) ----------
const navButtons = document.querySelectorAll(".nav-btn");
const toolSections = document.querySelectorAll(".tool-section");

navButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetId = btn.dataset.target;

    navButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    toolSections.forEach((sec) => {
      sec.classList.toggle("active", sec.id === targetId);
    });
  });
});

// --------- Footer Year ----------
document.getElementById("year").textContent = new Date().getFullYear();

// =============================
// 1) Word & Character Counter
// =============================
const wcInput = document.getElementById("wcInput");
const wordCountEl = document.getElementById("wordCount");
const charCountEl = document.getElementById("charCount");
const charCountNoSpaceEl = document.getElementById("charCountNoSpace");
const lineCountEl = document.getElementById("lineCount");
const wcClearBtn = document.getElementById("wcClear");

function updateWordStats() {
  const text = wcInput.value;

  const charsWithSpaces = text.length;
  const charsWithoutSpaces = text.replace(/\s/g, "").length;

  const trimmed = text.trim();
  const words =
    trimmed.length === 0 ? 0 : trimmed.split(/\s+/).filter(Boolean).length;

  const lines = text.length === 0 ? 0 : text.split(/\r\n|\r|\n/).length;

  wordCountEl.textContent = words;
  charCountEl.textContent = charsWithSpaces;
  charCountNoSpaceEl.textContent = charsWithoutSpaces;
  lineCountEl.textContent = lines;
}

if (wcInput) {
  wcInput.addEventListener("input", updateWordStats);
}
if (wcClearBtn) {
  wcClearBtn.addEventListener("click", () => {
    wcInput.value = "";
    updateWordStats();
  });
}
updateWordStats();

// =============================
// 2) Case Converter
// =============================
const caseInput = document.getElementById("caseInput");
const caseOutput = document.getElementById("caseOutput");
const caseButtons = document.querySelectorAll(
  "#caseConverter .secondary-btn[data-case]"
);
const copyCaseOutputBtn = document.getElementById("copyCaseOutput");

function toTitleCase(text) {
  return text
    .toLowerCase()
    .split(" ")
    .map((word) =>
      word.length ? word[0].toUpperCase() + word.slice(1) : ""
    )
    .join(" ");
}

function toSentenceCase(text) {
  const lowerText = text.toLowerCase();
  return lowerText.replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
}

caseButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const mode = btn.dataset.case;
    const input = caseInput.value || "";
    let output = input;

    switch (mode) {
      case "upper":
        output = input.toUpperCase();
        break;
      case "lower":
        output = input.toLowerCase();
        break;
      case "title":
        output = toTitleCase(input);
        break;
      case "sentence":
        output = toSentenceCase(input);
        break;
    }

    caseOutput.value = output;
  });
});

if (copyCaseOutputBtn) {
  copyCaseOutputBtn.addEventListener("click", async () => {
    if (!caseOutput.value) return;
    try {
      await navigator.clipboard.writeText(caseOutput.value);
      copyCaseOutputBtn.textContent = "Copied!";
      setTimeout(() => {
        copyCaseOutputBtn.textContent = "Copy";
      }, 1500);
    } catch (err) {
      alert("Copy failed, please copy manually.");
    }
  });
}

// =============================
// 3) Text → PDF
// =============================
const pdfTextArea = document.getElementById("pdfText");
const pdfFileNameInput = document.getElementById("pdfFileName");
const pdfPageSizeSelect = document.getElementById("pdfPageSize");
const generatePdfBtn = document.getElementById("generatePdfBtn");

if (generatePdfBtn) {
  generatePdfBtn.addEventListener("click", () => {
    const text = pdfTextArea.value.trim();
    if (!text) {
      alert("Please enter some text to convert into PDF.");
      return;
    }

    const { jsPDF } = window.jspdf;
    const pageSize = pdfPageSizeSelect.value === "letter" ? "letter" : "a4";

    const doc = new jsPDF({
      unit: "pt",
      format: pageSize,
    });

    const margin = 40;
    const maxWidth = doc.internal.pageSize.getWidth() - margin * 2;
    const fontSize = 12;

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(fontSize);

    const lines = doc.splitTextToSize(text, maxWidth);
    let y = margin;

    lines.forEach((line) => {
      if (y > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += fontSize + 4;
    });

    let fileName = pdfFileNameInput.value.trim() || "document";
    if (!fileName.toLowerCase().endsWith(".pdf")) {
      fileName += ".pdf";
    }

    doc.save(fileName);
  });
}

// =============================
// 4) JPG → PNG
// =============================
const jpgInput = document.getElementById("jpgInput");
const jpgCanvas = document.getElementById("jpgCanvas");
const jpgResult = document.getElementById("jpgResult");
const jpgDownloadLink = document.getElementById("jpgDownloadLink");

if (jpgInput) {
  jpgInput.addEventListener("change", () => {
    const file = jpgInput.files[0];
    if (!file) return;

    if (!file.type || !file.type.startsWith("image/jpeg")) {
      alert("Please select a JPG image.");
      jpgInput.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const ctx = jpgCanvas.getContext("2d");
        jpgCanvas.width = img.width;
        jpgCanvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const dataURL = jpgCanvas.toDataURL("image/png");
        jpgDownloadLink.href = dataURL;
        jpgResult.classList.remove("hidden");
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

// =============================
// 5) PNG → JPG
// =============================
const pngInput = document.getElementById("pngInput");
const pngCanvas = document.getElementById("pngCanvas");
const pngResult = document.getElementById("pngResult");
const pngDownloadLink = document.getElementById("pngDownloadLink");

if (pngInput) {
  pngInput.addEventListener("change", () => {
    const file = pngInput.files[0];
    if (!file) return;

    if (!file.type || !file.type.startsWith("image/png")) {
      alert("Please select a PNG image.");
      pngInput.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const ctx = pngCanvas.getContext("2d");
        pngCanvas.width = img.width;
        pngCanvas.height = img.height;

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, pngCanvas.width, pngCanvas.height);
        ctx.drawImage(img, 0, 0);

        const dataURL = pngCanvas.toDataURL("image/jpeg", 0.92);
        pngDownloadLink.href = dataURL;
        pngResult.classList.remove("hidden");
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

// =============================
// 6) Unit Converter
// =============================
const lenCm = document.getElementById("lenCm");
const lenIn = document.getElementById("lenIn");
const convertLengthBtn = document.getElementById("convertLength");

if (convertLengthBtn) {
  convertLengthBtn.addEventListener("click", () => {
    const cmVal = parseFloat(lenCm.value);
    const inVal = parseFloat(lenIn.value);

    if (!isNaN(cmVal) && !isNaN(inVal)) {
      // If both filled, prefer cm -> inches
      lenIn.value = (cmVal / 2.54).toFixed(2);
    } else if (!isNaN(cmVal)) {
      lenIn.value = (cmVal / 2.54).toFixed(2);
    } else if (!isNaN(inVal)) {
      lenCm.value = (inVal * 2.54).toFixed(2);
    } else {
      alert("Please enter at least one value (cm or inches).");
    }
  });
}

const wtKg = document.getElementById("wtKg");
const wtLb = document.getElementById("wtLb");
const convertWeightBtn = document.getElementById("convertWeight");

if (convertWeightBtn) {
  convertWeightBtn.addEventListener("click", () => {
    const kgVal = parseFloat(wtKg.value);
    const lbVal = parseFloat(wtLb.value);

    if (!isNaN(kgVal) && !isNaN(lbVal)) {
      wtLb.value = (kgVal * 2.20462).toFixed(2);
    } else if (!isNaN(kgVal)) {
      wtLb.value = (kgVal * 2.20462).toFixed(2);
    } else if (!isNaN(lbVal)) {
      wtKg.value = (lbVal / 2.20462).toFixed(2);
    } else {
      alert("Please enter at least one value (kg or pounds).");
    }
  });
}

const tempC = document.getElementById("tempC");
const tempF = document.getElementById("tempF");
const convertTempBtn = document.getElementById("convertTemp");

if (convertTempBtn) {
  convertTempBtn.addEventListener("click", () => {
    const cVal = parseFloat(tempC.value);
    const fVal = parseFloat(tempF.value);

    if (!isNaN(cVal) && !isNaN(fVal)) {
      tempF.value = (cVal * 9) / 5 + 32;
    } else if (!isNaN(cVal)) {
      tempF.value = ((cVal * 9) / 5 + 32).toFixed(2);
    } else if (!isNaN(fVal)) {
      tempC.value = (((fVal - 32) * 5) / 9).toFixed(2);
    } else {
      alert("Please enter at least one value (°C or °F).");
    }
  });
}

// =============================
// 7) BMI Calculator
// =============================
const bmiWeight = document.getElementById("bmiWeight");
const bmiHeight = document.getElementById("bmiHeight");
const bmiCalcBtn = document.getElementById("bmiCalcBtn");
const bmiResult = document.getElementById("bmiResult");

if (bmiCalcBtn) {
  bmiCalcBtn.addEventListener("click", () => {
    const w = parseFloat(bmiWeight.value);
    const hCm = parseFloat(bmiHeight.value);

    if (isNaN(w) || isNaN(hCm) || w <= 0 || hCm <= 0) {
      bmiResult.textContent = "Please enter valid weight and height.";
      return;
    }

    const hM = hCm / 100;
    const bmi = w / (hM * hM);
    let category = "Normal";

    if (bmi < 18.5) category = "Underweight";
    else if (bmi >= 25 && bmi < 30) category = "Overweight";
    else if (bmi >= 30) category = "Obese";

    bmiResult.textContent = `BMI: ${bmi.toFixed(1)} (${category})`;
  });
}

// =============================
// 8) Age Calculator
// =============================
const ageDob = document.getElementById("ageDob");
const ageCalcBtn = document.getElementById("ageCalcBtn");
const ageResult = document.getElementById("ageResult");

if (ageCalcBtn) {
  ageCalcBtn.addEventListener("click", () => {
    const dobVal = ageDob.value;
    if (!dobVal) {
      ageResult.textContent = "Please select your date of birth.";
      return;
    }

    const dob = new Date(dobVal);
    const today = new Date();

    if (dob > today) {
      ageResult.textContent = "Date of birth future me nahi ho sakti 😊";
      return;
    }

    let years = today.getFullYear() - dob.getFullYear();
    let months = today.getMonth() - dob.getMonth();
    let days = today.getDate() - dob.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    ageResult.textContent = `Age: ${years} years, ${months} months, ${days} days`;
  });
}

// =============================
// 9) Password Generator
// =============================
const passLength = document.getElementById("passLength");
const passUpper = document.getElementById("passUpper");
const passLower = document.getElementById("passLower");
const passNumbers = document.getElementById("passNumbers");
const passSymbols = document.getElementById("passSymbols");
const passGenBtn = document.getElementById("passGenBtn");
const passOutput = document.getElementById("passOutput");
const passCopyBtn = document.getElementById("passCopyBtn");

if (passGenBtn) {
  passGenBtn.addEventListener("click", () => {
    let length = parseInt(passLength.value, 10);
    if (isNaN(length) || length < 4) length = 4;
    if (length > 64) length = 64;

    let chars = "";
    if (passUpper.checked) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (passLower.checked) chars += "abcdefghijklmnopqrstuvwxyz";
    if (passNumbers.checked) chars += "0123456789";
    if (passSymbols.checked) chars += "!@#$%^&*()_-+=[]{};:,.<>?";

    if (!chars) {
      alert("Please select at least one character set (ABC/abc/123/@#$).");
      return;
    }

    let password = "";
    for (let i = 0; i < length; i++) {
      const idx = Math.floor(Math.random() * chars.length);
      password += chars.charAt(idx);
    }

    passOutput.value = password;
  });
}

if (passCopyBtn) {
  passCopyBtn.addEventListener("click", async () => {
    if (!passOutput.value) return;
    try {
      await navigator.clipboard.writeText(passOutput.value);
      passCopyBtn.textContent = "Copied!";
      setTimeout(() => {
        passCopyBtn.textContent = "Copy";
      }, 1500);
    } catch (err) {
      alert("Copy failed, please copy manually.");
    }
  });
}

// =============================
// 10) URL Encode / Decode
// =============================
const urlInput = document.getElementById("urlInput");
const urlOutput = document.getElementById("urlOutput");
const urlEncodeBtn = document.getElementById("urlEncodeBtn");
const urlDecodeBtn = document.getElementById("urlDecodeBtn");

if (urlEncodeBtn) {
  urlEncodeBtn.addEventListener("click", () => {
    try {
      urlOutput.value = encodeURIComponent(urlInput.value || "");
    } catch (err) {
      urlOutput.value = "Error encoding URL.";
    }
  });
}

if (urlDecodeBtn) {
  urlDecodeBtn.addEventListener("click", () => {
    try {
      urlOutput.value = decodeURIComponent(urlInput.value || "");
    } catch (err) {
      urlOutput.value = "Error decoding URL – invalid format.";
    }
  });
}

// =============================
// 11) Base64 Encode / Decode
// =============================
const b64Input = document.getElementById("b64Input");
const b64Output = document.getElementById("b64Output");
const b64EncodeBtn = document.getElementById("b64EncodeBtn");
const b64DecodeBtn = document.getElementById("b64DecodeBtn");

if (b64EncodeBtn) {
  b64EncodeBtn.addEventListener("click", () => {
    try {
      b64Output.value = btoa(b64Input.value || "");
    } catch (err) {
      b64Output.value = "Error encoding Base64 (non-ASCII characters?).";
    }
  });
}

if (b64DecodeBtn) {
  b64DecodeBtn.addEventListener("click", () => {
    try {
      b64Output.value = atob(b64Input.value || "");
    } catch (err) {
      b64Output.value = "Error decoding Base64 – invalid input.";
    }
  });
}

// =============================
// 12) JSON Formatter
// =============================
const jsonInput = document.getElementById("jsonInput");
const jsonOutput = document.getElementById("jsonOutput");
const jsonFormatBtn = document.getElementById("jsonFormatBtn");
const jsonMinifyBtn = document.getElementById("jsonMinifyBtn");

function handleJson(formatPretty) {
  try {
    const parsed = JSON.parse(jsonInput.value || "");
    if (formatPretty) {
      jsonOutput.value = JSON.stringify(parsed, null, 2);
    } else {
      jsonOutput.value = JSON.stringify(parsed);
    }
  } catch (err) {
    jsonOutput.value = "Invalid JSON: " + err.message;
  }
}

if (jsonFormatBtn) {
  jsonFormatBtn.addEventListener("click", () => handleJson(true));
}
if (jsonMinifyBtn) {
  jsonMinifyBtn.addEventListener("click", () => handleJson(false));
}

// =============================
// 13) QR Code Generator
// =============================
const qrText = document.getElementById("qrText");
const qrGenerateBtn = document.getElementById("qrGenerateBtn");
const qrContainer = document.getElementById("qrContainer");
let qrInstance = null;

if (qrGenerateBtn) {
  qrGenerateBtn.addEventListener("click", () => {
    const value = (qrText.value || "").trim();
    if (!value) {
      alert("Please enter some text or URL.");
      return;
    }

    qrContainer.innerHTML = "";
    qrInstance = new QRCode(qrContainer, {
      text: value,
      width: 180,
      height: 180,
    });
  });
}

// =============================
// 14) Text → Image
// =============================
const txtImgText = document.getElementById("txtImgText");
const txtImgDownloadBtn = document.getElementById("txtImgDownloadBtn");
const txtImgCanvas = document.getElementById("txtImgCanvas");
const txtImgResult = document.getElementById("txtImgResult");
const txtImgDownloadLink = document.getElementById("txtImgDownloadLink");

if (txtImgDownloadBtn) {
  txtImgDownloadBtn.addEventListener("click", () => {
    const text = (txtImgText.value || "").trim();
    if (!text) {
      alert("Please enter some text first.");
      return;
    }

    const width = 800;
    const height = 400;
    txtImgCanvas.width = width;
    txtImgCanvas.height = height;

    const ctx = txtImgCanvas.getContext("2d");
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "#ffffff";
    ctx.font = "22px system-ui";
    ctx.textBaseline = "top";

    const maxWidth = width - 80;
    const lineHeight = 30;
    const words = text.split(" ");
    let line = "";
    let y = 60;

    words.forEach((word) => {
      const testLine = line + word + " ";
      const testWidth = ctx.measureText(testLine).width;
      if (testWidth > maxWidth && line !== "") {
        ctx.fillText(line, 40, y);
        line = word + " ";
        y += lineHeight;
      } else {
        line = testLine;
      }
    });
    if (line) {
      ctx.fillText(line, 40, y);
    }

    const dataURL = txtImgCanvas.toDataURL("image/png");
    txtImgDownloadLink.href = dataURL;
    txtImgResult.classList.remove("hidden");
  });
}
