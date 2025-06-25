import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {MDBContainer,MDBInput,MDBBtn,} from 'mdb-react-ui-kit';
import CryptoJS from 'crypto-js' ;

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
            var key  = CryptoJS.enc.Latin1.parse('1234567812345678');
            var iv   = CryptoJS.enc.Latin1.parse('1234567812345678');  
            var encrypted = CryptoJS.AES.encrypt(
                password,
              key,
              {iv:iv,mode:CryptoJS.mode.CBC,padding:CryptoJS.pad.Pkcs7
            });
            if (!username || !password) {
                setError('Please enter both username and password.');
                return;
            }
            console.log('working..');
            // const response = await axios.get('http://192.168.0.2:8080/test/login', {
                  const response = await axios.get('https://vbr-office-backend.onrender.com/test/login', {
                params: {
                    username:username,
                  password:encrypted,
                },
              });
                if(response.data == 'Login Successfull'){
                    // const responseUser = await axios.get('http://192.168.0.2:8080/test/getUserroles', {
                          const responseUser = await axios.get('https://vbr-office-backend.onrender.com/test/getUserroles', {
                        params: {
                            username:username,
                        },
                      });
                      console.log( response.data);
                      localStorage.setItem('Name', responseUser.data.username);
                      localStorage.setItem('role', responseUser.data.roles[0]);
                      history('/dashboard');
                }
                else{
                        console.error('Login failed:', error.response ? error.response.data : error.message);
                        setError('Invalid username or password.');
                }
           

           
        } catch (error) {
            console.error('Login failed:', error.response ? error.response.data : error.message);
            setError('Invalid username or password.');
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="border rounded-lg p-4" style={{ width: '500px', height: 'auto' }}>
                <MDBContainer className="p-3">
                    <h2 className="mb-4 text-center">Login Page</h2>
                    <MDBInput wrapperClass='mb-4' placeholder='Email address' id='email' value={username} type='email' onChange={(e) => setUsername(e.target.value)} />
                    <MDBInput wrapperClass='mb-4' placeholder='Password' id='password' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                    {error && <p className="text-danger">{error}</p>} {/* Render error message if exists */}
                    <button className="mb-4 d-block btn-primary" style={{ height:'50px',width: '100%' }} onClick={handleLogin}>Sign in</button>
                    <div className="text-center">
                        <p>Not a member? <a href="/signup" >Register</a></p>
                    </div>
                    <div className="text-center">
                        <p>forget password? <a href="/reset" >forget</a></p>
                    </div>
                </MDBContainer>
            </div>
        </div>
    );
}

export default LoginPage;