import React from 'react';
import { useNavigate} from 'react-router-dom'; // Import useHistory hook
import axios from 'axios';

import './Dashboard.css';

function WelcomeDashboard({ username }) {

    const history = useNavigate();
    let user ;

    const handleLogout = async () => {

        localStorage.removeItem("Name");
        localStorage.removeItem("role");
        
        history('/');
 
    };

  return (
    <div className="WelcomeDashboard">
      <header className="header">
        <div class= "headercard">
        {/* <h1 className="Title">Welcome to VBR & Associates</h1> */}
        <p className='usernameclass'>{localStorage.getItem('Name')}</p>
        <button type="button" class="button" onClick={handleLogout}> Log out
        </button>
        </div>  

        <div class= "navcard">
        <nav>
          <a href="#about">About</a>
          <a href="#features">Features</a>
          <a href="#contact">Contact</a>
        </nav>
        </div>
      </header>

      <main className="main-content">
        <section id="about">
          <h2>About</h2>
          <p>Law firm based out of sindhanur</p>
          <p>We are a team of experienced lawyers dedicated to providing top-notch legal services.</p>
          <p className="mb-4 text-center">you are a {localStorage.getItem('role')} user</p>
         
        </section>

        <section id="features">
          <h2>Features</h2>
          <ul>
            <li>Fast and responsive</li>
            <li>Built with modern React</li>
            <li>Easy to customize</li>
          </ul>
        </section>

        <section id="contact">
          <h2>Contact</h2>
          <p>Feel free to reach out via email or follow me on social media.</p>
        </section>
      </main>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} VBR. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default WelcomeDashboard;
