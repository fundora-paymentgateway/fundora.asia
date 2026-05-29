let chosenChannel = "";
let timeRemainingSeconds = 299; // 4m 59s
let timerCountdownInterval = null;

// 0. Fungsi Logik Validasi Log Masuk Akun & Paparan Mesej Dinamik
function validateLogin() {
  const phoneInput = document.getElementById('loginPhone').value.trim();
  const pinInput = document.getElementById('loginPin').value.trim();
  const errorMsg = document.getElementById('loginErrorMsg');

  // SEKARANG DAHTUKAR: Log masuk menggunakan 0000000000 dan PIN 210404
  if (phoneInput === "0000000000" && pinInput === "210404") {
    errorMsg.classList.add('hidden');
    
    // Memasukkan teks secara dinamik selepas log masuk berjaya
    document.getElementById('dashboardUserGreeting').innerText = "Hai ANBU";
    document.getElementById('dashboardUserSubGreeting').innerText = "Selamat kembali ke Fundora";
    
    navigateTo('screenDashboard'); 
  } else {
    errorMsg.classList.remove('hidden'); 
  }
}

// 1. Fungsi Navigasi Antara Skrin (SPA Controller)
function navigateTo(screenId) {
  const screens = ['screenLogin', 'screenDashboard', 'screenBayaranBalik', 'screenKaedahBayar', 'screenQRCodeGateway', 'screenUploadResit'];
  
  screens.forEach(id => {
    const targetScreen = document.getElementById(id);
    if (id === screenId) {
      targetScreen.classList.remove('hidden');
      targetScreen.classList.add('flex');
    } else {
      targetScreen.classList.remove('flex');
      targetScreen.classList.add('hidden');
    }
  });

  // Bermula jika masuk ke Skrin QR
  if (screenId === 'screenQRCodeGateway') {
    startTimer();
  } else {
    stopTimer();
  }
}

// 2. Logik Pilihan Pembayaran (Halaman Kaedah)
function handlePaymentSelection(radio) {
  const labelDuitNow = document.getElementById('duitNowLabel');
  const dropdown = document.getElementById('dropdownChannels');

  if (radio.value === 'duitnow') {
    labelDuitNow.classList.add('bg-[#E6F4F0]', 'border-[#005E42]', 'border-2', 'rounded-t-xl');
    labelDuitNow.classList.remove('border-gray-200', 'rounded-xl');
    dropdown.classList.remove('hidden');
  } else {
    resetDuitNowSelection();
    document.getElementById('paymentAlertModal').classList.remove('hidden');
    radio.checked = false;
  }
}

// Pilihan saluran perbankan/e-wallet
function selectChannel(channelName) {
  chosenChannel = channelName;
  document.getElementById('selectedBankName').innerText = channelName;
  document.getElementById('bankDisplayBox').classList.remove('hidden');
  document.getElementById('dropdownChannels').classList.add('hidden');
}

// Mengeset semula pilihan jika memilih kaedah lain selain DuitNow
function resetDuitNowSelection() {
  const labelDuitNow = document.getElementById('duitNowLabel');
  document.getElementById('dropdownChannels').classList.add('hidden');
  document.getElementById('bankDisplayBox').classList.add('hidden');
  labelDuitNow.classList.remove('bg-[#E6F4F0]', 'border-[#005E42]', 'border-2', 'rounded-t-xl');
  labelDuitNow.classList.add('border-gray-200', 'rounded-xl');
  chosenChannel = "";
}

// Tutup Modal Amaran Kaedah Lain
function closeAlertModal() {
  document.getElementById('paymentAlertModal').classList.add('hidden');
}

// 3. Validasi Kemasukan QR Skrin
function validateAndProcessQR() {
  const checkedOption = document.querySelector('input[name="pay_opt"]:checked');
  if (!checkedOption || checkedOption.value !== 'duitnow' || chosenChannel === "") {
    alert("Sila pilih kaedah DuitNow beserta salah satu saluran bank/e-wallet dahulu!");
    return;
  }
  navigateTo('screenQRCodeGateway');
}

// 4. Sistem Countdown Timer (4m 59s)
function startTimer() {
  if (timerCountdownInterval) return; 
  
  timeRemainingSeconds = 299; 
  const display = document.getElementById('countdownDisplay');

  timerCountdownInterval = setInterval(() => {
    if (timeRemainingSeconds <= 0) {
      clearInterval(timerCountdownInterval);
      timerCountdownInterval = null;
      display.innerText = "0m 00s";
      navigateTo('screenUploadResit'); 
      return;
    }

    timeRemainingSeconds--;
    let min = Math.floor(timeRemainingSeconds / 60);
    let sec = timeRemainingSeconds % 60;
    if (sec < 10) sec = "0" + sec;
    display.innerText = min + "m " + sec + "s";
  }, 1000);
}

// Hentikan fungsi timer jika keluar skrin QR
function stopTimer() {
  if (timerCountdownInterval) {
    clearInterval(timerCountdownInterval);
    timerCountdownInterval = null;
  }
}

// 5. Muat Naik Bukti Fail Resit
function handleFileChange(input) {
  if (input.files && input.files.length > 0) {
    document.getElementById('uploadTextContainer').classList.add('hidden');
    document.getElementById('fileAttachedContainer').classList.remove('hidden');
    document.getElementById('receiptFileName').innerText = input.files[0].name;
  }
}

// Hantar borang resit penutup
function executeFinalSubmit() {
  const fileCheck = document.getElementById('receiptFile').files;
  if (fileCheck.length === 0) {
    alert("Sila masukkan/pilih fail resit bayaran anda terlebih dahulu!");
    return;
  }
  alert("Tahniah! Resit anda selamat diterima. Pembayaran Anda Selesai Diuruskan.");
  
  resetDuitNowSelection();
  document.querySelectorAll('input[name="pay_opt"]').forEach(el => el.checked = false);
  document.getElementById('uploadTextContainer').classList.remove('hidden');
  document.getElementById('fileAttachedContainer').classList.add('hidden');
  document.getElementById('receiptFile').value = "";
  navigateTo('screenDashboard');
}
