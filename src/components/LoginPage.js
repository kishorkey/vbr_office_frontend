import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MDBContainer, MDBInput, MDBBtn, } from 'mdb-react-ui-kit';
import CryptoJS from 'crypto-js';
import './LoginPage.css';
import { API } from '../constants/api';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const history = useNavigate();


    // encryptFun() {

    //     console.log('encrypted: ' + encrypted) ;
    //     var decrypted = CryptoJS.AES.decrypt(encrypted,key,{iv:iv,padding:CryptoJS.pad.ZeroPadding});
    //     console.log('decrypted: '+decrypted.toString(CryptoJS.enc.Utf8));
    //   }

    const handleLogin = async () => {
        try {
            var key = CryptoJS.enc.Latin1.parse('1234567812345678');
            var iv = CryptoJS.enc.Latin1.parse('1234567812345678');
            var encrypted = CryptoJS.AES.encrypt(
                password,
                key,
                {
                    iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7
                });
            if (!username || !password) {
                setError('Please enter both username and password.');
                return;
            }
            console.log('working..');
            const response = await axios.get(API.LOGIN, {
                //   const response = await axios.get('https://vbr-office-backend.onrender.com/test/login', {
                params: {
                    username: username,
                    password: encrypted,
                },
            });
            if (response.data == 'Login Successfull') {
                const responseUser = await axios.get(API.GET_USER_ROLES, {
                    //   const responseUser = await axios.get('https://vbr-office-backend.onrender.com/test/getUserroles', {
                    params: {
                        username: username,
                    },
                });
                console.log(response.data);
                console.log(responseUser.data);
                
                

                localStorage.setItem('Name', responseUser.data.username);
                localStorage.setItem('token', responseUser.data.token);
                localStorage.setItem('role', JSON.stringify(responseUser.data.role[0])); //
                history('/dashboard');
            }
            else {
                console.error('Login failed:', error.response ? error.response.data : error.message);
                setError('Invalid username or password.');
            }



        } catch (error) {
            console.error('Login failed:', error.response ? error.response.data : error.message);
            setError('Invalid username or password.');
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-page-container">
                <h2 className="login-title">VBR Associates Login</h2>
                <div className="login-user-form">
                    <input
                        type="email"
                        placeholder="Email address"
                        id="email"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="new-user-input mb-3"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="new-user-input mb-4"
                    />
                </div>

                {error && <p className="text-danger">{error}</p>} {/* Render error message if exists */}
                <button onClick={handleLogin} className="login-button ">
            Sign in
          </button>
                <div className="text-center">
                    <p>Not a member? <a href="/newuser" >Register</a></p>
                </div>
                <div className="text-center">
                    <p>forget password? <a href="/reset" >forget</a></p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;