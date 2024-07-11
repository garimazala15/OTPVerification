import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth, Auth, RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import { firebaseConfig } from '../Component/Firebase/FirebaseConfig';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth;

  constructor() {
    const app = initializeApp(firebaseConfig);
    this.auth = getAuth(app);
  }

  getAuth(): Auth {
    return this.auth;
  }

  sendOTP(phoneNumber: string, recaptchaVerifier: RecaptchaVerifier) {
    return signInWithPhoneNumber(this.auth, phoneNumber, recaptchaVerifier);
  }

  verifyOtp(verificationId: string, verificationCode: string) {
    const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
    return signInWithCredential(this.auth, credential);
  }
}
