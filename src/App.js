import { useState } from 'react';
import './App.css';

function App() {

  const [userInfo, setUserInfo] = useState({});

  const handleBlur = (e) => {
    let formData = { ...userInfo };
    formData[e.target.name] = e.target.value;
    setUserInfo(formData);
  }

  const handleRegistration = (e) => {
    e.preventDefault();
    console.log(userInfo);
  }

  return (
    <div className="login-container">

      {/* login form */}

      <form onSubmit={handleRegistration} className="login-form">
        <h2>Login</h2>

        <input type="text" name="email" placeholder="Your Email"
          onBlur={handleBlur}
          required />
        <input type="password" name="password" placeholder="Your Password"
          onBlur={handleBlur}
          required />

        <div>
          <input type="checkbox" name="switchForm" id="switchForm" />
          <label htmlFor="switchForm">Returning User</label>
        </div>

        <button type="submit">Login</button>
      </form>

    </div>
  );
}

export default App;
