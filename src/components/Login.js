import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import './Login.css';

function Login() {
  const handleGoogleSuccess = (credentialResponse) => {
    console.log('Login Success:', credentialResponse);
    
    // Decode the JWT token to get user info
    const userData = JSON.parse(atob(credentialResponse.credential.split('.')[1]));
    
    const user = {
      email: userData.email,
      name: userData.name,
      picture: userData.picture,
      loggedIn: true,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('userAuth', JSON.stringify(user));
    window.location.reload();
  };

  const handleGoogleError = () => {
    console.log('Login Failed');
    alert('Login failed. Please try again.');
  };

  const handleManualLogin = (e) => {
    e.preventDefault();
    // Fallback for manual login
    const mockUser = {
      email: 'user@eztechmovie.com',
      name: 'EZTech User',
      loggedIn: true,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('userAuth', JSON.stringify(mockUser));
    window.location.reload();
  };

  return (
    <GoogleOAuthProvider clientId="1004494284402-986slsi7im0lodbmeg78t82i0chr6o56.apps.googleusercontent.com">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>StreamList</h1>
            <p className="login-tagline">Your Watch, Plan, and Stream Hub</p>
          </div>
          
          <div className="login-content">
            <h2>Welcome Back</h2>
            <p className="login-subtitle">Sign in to access your subscriptions</p>
            
            <div className="google-login-wrapper">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="filled_blue"
                size="large"
                text="continue_with"
                shape="rectangular"
              />
            </div>
            
            <div className="login-divider">
              <span>or</span>
            </div>
            
            <form className="login-form" onSubmit={handleManualLogin}>
              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Password</label>
                <input 
                  type="password" 
                  placeholder="Enter your password"
                  required
                />
              </div>
              
              <button type="submit" className="login-submit-btn">
                Sign In
              </button>
            </form>
            
            <p className="login-footer">
              Don't have an account? <a href="#signup">Sign up</a>
            </p>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default Login;