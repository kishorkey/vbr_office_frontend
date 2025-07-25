import React from 'react';
import { useNavigate} from 'react-router-dom'; // Import useHistory hook


import './Dashboard.css';

function WelcomeDashboard({ username }) {

    const history = useNavigate();
    const navigate = useNavigate();
    let user ;
  console.log(localStorage.getItem('role'));
    const handleLogout = async () => {

        localStorage.removeItem("Name");
        localStorage.removeItem("role");
         localStorage.clear();
        history('/');
         window.location.href = "/";
 
    };

     const goToClientScreen = () => {
    navigate('/clients'); // ✅ Use this function to go to the client screen
  };

  return (
    <div className="WelcomeDashboard">

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
    </div>
  );
}

export default WelcomeDashboard;
