import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Dashboard from "./components/Dashboard";
import SignupPage from "./components/SignUpPage";
import ResetPassword from "./components/ResetPassword";


function App() {
  return (
  //   
  <div className="App">
  <Router>

        <Routes>
        <Route path="/" element={<LoginPage/>} />
            <Route path = "/dashboard" element={<Dashboard/>}/>
            <Route path="/signup" element={ <SignupPage/>} />
            <Route path="/reset" element={ <ResetPassword/>} />
            
        </Routes>

  </Router>
  </div>
  )
}

export default App;
