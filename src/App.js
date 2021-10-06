import { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import './App.css';
import initializeAuthentication from './Firebase/firebase.init';

initializeAuthentication();

function App() {

  const auth = getAuth();

  const [loginUserName, setLoginUserName] = useState('');
  const [userInfo, setUserInfo] = useState({ isLogin: false });
  const [registerInfo, setRegisterInfo] = useState({ error: '', success: '' })

  const toggleLogin = (e) => {
    const logingStatus = { ...userInfo };
    logingStatus.isLogin = e.target.checked;
    setUserInfo(logingStatus);

    const clearMessage = { ...registerInfo };
    clearMessage.error = '';
    clearMessage.success = '';
    setRegisterInfo(clearMessage);

    setLoginUserName('');
  }

  const handleBlur = (e) => {
    const formData = { ...userInfo };
    formData[e.target.name] = e.target.value;
    setUserInfo(formData);
  }

  const handleRegistration = (e) => {
    e.preventDefault();

    const { email, password } = userInfo;

    userInfo.isLogin ? loginUser(email, password) : createNewUser(email, password);


  }

  const loginUser = (email, password) => {

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        // console.log(user);
        const { displayName, email } = user;
        setLoginUserName(displayName);

        const regSuccess = { ...registerInfo };
        regSuccess.error = '';
        regSuccess.success = 'Login Success';
        setRegisterInfo(regSuccess);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // console.log(errorMessage, errorCode);
        const regError = { ...registerInfo };
        regError.error = errorMessage;
        regError.success = '';
        setRegisterInfo(regError);
      });
  }

  const createNewUser = (email, password) => {

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
        // console.log(user);
        const regSuccess = { ...registerInfo };
        regSuccess.error = '';
        regSuccess.success = 'Register Success';
        setRegisterInfo(regSuccess);
        setUserName();
        setLoginUserName('');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage, errorCode);
        const regError = { ...registerInfo };
        regError.error = errorMessage;
        regError.success = '';
        setRegisterInfo(regError);
        setLoginUserName('');
      });
  }

  const setUserName = () => {
    updateProfile(auth.currentUser, { displayName: userInfo.name })
      .then(() => {
        // Profile updated!
        // ...
      })
  }

  return (
    <div>

      <div className="login-container">

        {/* login form */}

        <form onSubmit={handleRegistration} className="login-form">
          <h2>Please {userInfo.isLogin ? 'Login' : 'Register'}</h2>

          {
            !userInfo.isLogin && <input type="text" name="name" placeholder="Your Name"
              onBlur={handleBlur}
              required />
          }
          <input type="email" name="email" placeholder="Your Email"
            onBlur={handleBlur}
            required />
          <input type="password" name="password" placeholder="Your Password"
            onBlur={handleBlur}
            required />

          <div>
            <input type="checkbox" name="switchForm" id="switchForm"
              onChange={toggleLogin} />
            <label htmlFor="switchForm">Already Registered?</label>
          </div>

          <button type="submit">{userInfo.isLogin ? 'Login' : 'Register'}</button>
        </form>
      </div>
      <div className="error-message">{registerInfo.error}</div>
      <div className="success-message">{registerInfo.success}</div>
      {loginUserName && <p className="welcome-user">Welcome {loginUserName}</p>}
    </div>
  );
}

export default App;
