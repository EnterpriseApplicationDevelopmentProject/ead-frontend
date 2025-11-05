export const authNotifications = {
  loginSuccess: () => {
    console.log('Login successful');
    // You can implement toast notifications here later
  },
  
  loginError: (message: string) => {
    console.error('Login error:', message);
    // You can implement toast notifications here later
  },
  
  logoutSuccess: () => {
    console.log('Logout successful');
    // You can implement toast notifications here later
  },
  
  signupSuccess: () => {
    console.log('Signup successful');
    // You can implement toast notifications here later
  },
  
  signupError: (message: string) => {
    console.error('Signup error:', message);
    // You can implement toast notifications here later
  },
  
  passwordResetSent: () => {
    console.log('Password reset email sent');
    // You can implement toast notifications here later
  },
  
  passwordResetSuccess: () => {
    console.log('Password reset successful');
    // You can implement toast notifications here later
  }
};