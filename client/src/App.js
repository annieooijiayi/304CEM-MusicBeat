import './App.css';
import { BrowserRouter as Router,Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/Signup';
import ProtectedRoute from './component/protectedRoute';
import Navbar from './component/navbar';

function App() {
  return (
    
    <Router>
      <Navbar />
      <Route exact path='/'>
        <Login />
      </Route>

      <Route path='/signup'>
        <SignUp />
      </Route>

      <>
      
      <ProtectedRoute path="/home" component={Home} />
      </>

    </Router>
  );
}

export default App;
