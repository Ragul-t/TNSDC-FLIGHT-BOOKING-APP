import React, { useContext } from 'react';
import '../styles/Navbar.css';
import { useNavigate } from 'react-router-dom';
import { GeneralContext } from '../context/GeneralContext';

const Navbar = () => {
    const navigate = useNavigate();
    const usertype = localStorage.getItem('userType');
    const { logout } = useContext(GeneralContext);

    return (
        <nav className="new-navbar">
            <div className="navbar-brand">
                <h2 onClick={() => navigate('/')}>
                    {usertype === 'admin' ? 'UNITED (Admin)' : usertype === 'flight-operator' ? 'UNITED (Op)' : 'UNITED'}
                </h2>
            </div>
            <div className="navbar-links">
                {!usertype ? (
                    <>
                        <button onClick={() => navigate('/auth')}>Login</button>
                    </>
                ) : usertype === 'customer' ? (
                    <>
                        <button onClick={() => navigate('/bookings')}>Bookings</button>
                        <button onClick={logout}>Logout</button>
                    </>
                ) : usertype === 'admin' ? (
                    <>
                        <button onClick={() => navigate('/admin')}>Dashboard</button>
                        <button onClick={() => navigate('/all-users')}>Users</button>
                        <button onClick={() => navigate('/all-bookings')}>Bookings</button>
                        <button onClick={() => navigate('/all-flights')}>Flights</button>
                        <button onClick={logout}>Logout</button>
                    </>
                ) : usertype === 'flight-operator' ? (
                    <>
                        <button onClick={() => navigate('/flight-admin')}>Dashboard</button>
                        <button onClick={() => navigate('/flight-bookings')}>Bookings</button>
                        <button onClick={() => navigate('/flights')}>Flights</button>
                        <button onClick={() => navigate('/new-flight')}>Add Flight</button>
                        <button onClick={logout}>Logout</button>
                    </>
                ) : null}
            </div>
        </nav>
    );
};

export default Navbar;
