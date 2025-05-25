const otpStore = {}; 

function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function sendOtp(email) {
    const otp = generateOtp();
    otpStore[email] = otp;
    console.log(`OTP for ${email}: ${otp}`); 
    return otp;
}

function verifyOtp(email, otp) {
    return otpStore[email] === otp;
}

module.exports = { sendOtp, verifyOtp };
