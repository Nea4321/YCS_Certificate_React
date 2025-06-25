import React from 'react';
import '@/shared/style/Header.css';
import {Link} from "react-router-dom";

export const Header: React.FC = () => {
    return (
        <header className="header-wrapper">
            <div className="logo">
                <Link to="/">
                    <img
                        src="/자격지신.png"
                        alt="자격증 포털 로고"
                        className="logo"
                    />
                </Link>
            </div>

            <nav className="nav">
                <ul>
                    <li className='nav-dept'><Link to="/departments">학과리스트</Link></li>
                    <li className='nav-cert'><a href="#">자격증리스트</a></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
