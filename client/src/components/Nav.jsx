import { useSelector } from 'react-redux';
import { HashLink } from 'react-router-hash-link';
import { useState, useRef } from 'react';
import noImage from '../assets/Images/no-image.png';
import { useNavigate } from 'react-router-dom';

export default function Nav() {
    const { loggedUser, avatar } = useSelector(state => state.user);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const hamburgerRef = useRef();
    const navRef = useRef();

    // Use environment variable for the backend URL
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

    const handleProfile = () => {
        setIsDropdownOpen(false);
        if (localStorage.getItem('userInfo')) {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            navigate(`/dashboard/${userInfo.role}/${userInfo._id}`);
        }
    };

    const handleLogOut = () => {
        setIsDropdownOpen(false);
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        window.location.href = '/login';
    };

    const toggleMenu = () => {
        hamburgerRef.current.classList.toggle('active');
        navRef.current.classList.toggle('active');
    };

    const closeMobileMenu = () => {
        hamburgerRef.current.classList.remove('active');
        navRef.current.classList.remove('active');
    };

    return (
        <div className='Nav'>
            <div className="container">
                <header>
                    <div className="logo">
                        <HashLink to="/#">FlexiHire</HashLink>
                    </div>
                    
                    <nav ref={navRef}>
                        <span className='menu-logo'>FlexiHire</span>
                        <HashLink to="/#" onClick={closeMobileMenu}>Home</HashLink>
                        <HashLink to="/#services" smooth onClick={closeMobileMenu}>Services</HashLink>
                        <HashLink to="/#aboutus" smooth onClick={closeMobileMenu}>About Us</HashLink>
                        <HashLink to="/#contactus" smooth onClick={closeMobileMenu}>Contact Us</HashLink>
                        
                        {loggedUser == null ? (
                            <button className="sign-in-btn">
                                <HashLink to="/login">Sign in</HashLink>
                            </button>
                        ) : (
                            <div className="user-menu">
                                <img 
                                    src={avatar === 'no-image.png' ? noImage : `${API_URL}/ProfilePic/${avatar}`} 
                                    alt="Profile" 
                                    className="user-avatar"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    onError={(e) => {
                                        e.target.src = noImage;
                                    }}
                                />
                                
                                <div className={`user-dropdown ${isDropdownOpen ? 'active' : ''}`}>
                                    <button className="dropdown-item" onClick={handleProfile}>
                                        <svg viewBox="0 0 24 24" width="18" height="18">
                                            <path d="M4 13h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1zm-1 7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v4zm10 0a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v7zm1-10h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1z"/>
                                        </svg>
                                        Dashboard
                                    </button>
                                    
                                    <div className="dropdown-divider"></div>
                                    
                                    <button className="dropdown-item" onClick={handleLogOut}>
                                        <svg viewBox="0 0 24 24" width="18" height="18">
                                            <path d="M16 17v-3h-5v-2h5V8l4 4-4 4zM2 12c0-3.3 2.7-6 6-6h5v2H8c-2.2 0-4 1.8-4 4s1.8 4 4 4h5v2H8c-3.3 0-6-2.7-6-6z"/>
                                        </svg>
                                        Log Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </nav>
                    
                    <button 
                        className="hamburger" 
                        onClick={toggleMenu}
                        ref={hamburgerRef}
                        aria-label="Menu"
                    >
                        <span className="bar"></span>
                        <span className="bar"></span>
                        <span className="bar"></span>
                    </button>
                </header>
            </div>
        </div>
    );
}