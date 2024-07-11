import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {  getAuth, signInWithPhoneNumber } from 'firebase/auth';
import { RecaptchaVerifier } from 'firebase/auth';
import { AuthService } from '../../Service/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  registerForm: FormGroup;
  otpForm: FormGroup;
  isOtpSent = false;
  isOtpModalVisible = false;
  generatedOtp: string;
  phoneNumber: string = '';
  otp: string = '';
  verificationId: string | null = null;
  recaptchaVerifier: RecaptchaVerifier | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.registerForm = this.fb.group({
      fullname: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
      username: ['', [Validators.required, Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()_+{}\[\]:;<>,.?~`|\//-]{8,20}$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;,.""<>?~`|//\-])[A-Za-z\d!@#$%^&*()_+{}\[\]:;"'<>.,?~`|\\/-]{8,20}$/)]],
      phone: ['', [
        Validators.required,
        Validators.pattern(/^\+?\d{10,12}$/)
      ]],
      
            confirmPassword: ['']
    });
    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  ngOnInit() {
    this.setupRecaptcha();
  }

  setupRecaptcha() {
    const authInstance = this.authService.getAuth();
    this.recaptchaVerifier = new RecaptchaVerifier( authInstance,'recaptcha-container',{}); // Pass the Auth instance here
    this.recaptchaVerifier.render();
  }

  sendOTP() {
    const auth = getAuth();
    let phoneNumber = this.registerForm.value.phone.trim(); // Remove any leading/trailing spaces
  
    // Firebase may require stripping the '+' sign for some implementations
    if (phoneNumber.startsWith('+')) {
      phoneNumber = phoneNumber.slice(1); // Remove the leading '+'
    }
  
    // Ensure the phone number is in E.164 format
    phoneNumber = `+${phoneNumber}`; // Assuming country code for India (+91)
  
    signInWithPhoneNumber(auth, phoneNumber, this.recaptchaVerifier!)
      .then((confirmationResult) => {
        this.verificationId = confirmationResult.verificationId;
        console.log(this.verificationId);
        this.isOtpSent = true;
        console.log('OTP sent');
        alert('OTP sent successfully');
        this.isOtpModalVisible = true;

      })
      .catch((error) => {
        console.error('Error during sending OTP:', error);
      });
  }

  resendOTP() {
    if (this.recaptchaVerifier) {
      const auth = getAuth();
      const phoneNumber = `+91${this.registerForm.value.phone.trim()}`; // Adjust as per your country code
      signInWithPhoneNumber(auth, phoneNumber, this.recaptchaVerifier)
        .then((confirmationResult) => {
          this.verificationId = confirmationResult.verificationId;
          this.isOtpSent = true;
          console.log('OTP resent');
        })
        .catch((error) => {
          console.error('Error during resending OTP:', error);
          alert("Failed to resend OTP. Please try again."); // Add user-friendly alert
        });
    } else {
      console.error('RecaptchaVerifier not initialized.');
    }
  }
  

  resetOTP() {
    this.otpForm.reset();
    this.isOtpSent = false;
    this.verificationId = null;
  }

  submitForm() {
    if (this.registerForm.valid) {
      console.log('Form Submitted', this.registerForm.value);
      alert("Registration Successful!");
    } else {
      this.registerForm.markAllAsTouched();
      console.log('Form is invalid');
    }
  }

  generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  
  
  verifyOTP() {
    // Ensure both verificationId and otp are present and valid
    if (this.verificationId && this.otpForm.valid) {
      this.otp = this.otpForm.value.otp; // Capture otp from form
      // Call your authService method to verify OTP
      this.authService.verifyOtp(this.verificationId, this.otp)
        .then(() => {
          console.log('OTP verified successfully');
          alert('OTP Verified Successfully!');
          this.isOtpModalVisible = false; // Optionally close OTP modal
          this.isOtpSent = true; // Optionally set a flag indicating OTP is verified
        })
        .catch((error) => {
          console.error('Error during OTP verification:', error);
          alert('OTP Verification Failed. Please try again.');
        });
    } else {
      console.error('Verification ID or OTP is missing or invalid.');
      alert('Verification ID or OTP is missing or invalid. Please try again.');
    }
  }
  
  
}
