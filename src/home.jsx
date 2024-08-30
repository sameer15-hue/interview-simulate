import React from 'react';

const Home = () => {
  return (
    <div className="login-container">
      <form className="login-form">
        <h1>Login</h1>
        <p>Hey, Enter your details to get sign in to your account</p>
        <input type="text" placeholder="Enter your username/email" />
        <input type="password" placeholder="Enter your password" />
        <button type="submit">Login In</button>
        <p className="signup-text">Don't have an account? Sign up Now</p>
      </form>
      <style jsx>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #f0f2f5;
        }
        .login-form {
          background-color: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 400px;
        }
        h1 {
          color: #4361ee;
          font-size: 24px;
          margin-bottom: 1rem;
          text-align: center;
        }
        p {
          color: #666;
          font-size: 14px;
          margin-bottom: 1.5rem;
          text-align: center;
        }
        input {
          width: 100%;
          padding: 0.75rem;
          margin-bottom: 1rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
        }
        button {
          width: 100%;
          padding: 0.75rem;
          background-color: #4361ee;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 16px;
          cursor: pointer;
        }
        button:hover {
          background-color: #3a4fd8;
        }
        .signup-text {
          margin-top: 1rem;
        }
      `}</style>
    </div>
  );
};

export default Home;