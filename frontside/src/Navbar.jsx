import { useRef } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

import './Navbar.css'

function Navbar() {
    const navRef = useRef();

    const showNavbar = () => {
        navRef.current.classList.toggle(
            "responsive_nav"
        );
    };

    return (
        <header>
            <h3>rOLeX</h3>
            <nav ref={navRef}>
                <a href="/products">Home</a>
                <a href="/buyhistory">Buy History</a>
                <a href="/sellhistory">Sell History</a>
                <a href="/product">Post Product</a>
                <a href="/bestseller">On demand products of the hour</a>
                <a href="/logout">Logout</a>
                <button
                    className="nav-btn nav-close-btn"
                    onClick={showNavbar}>
                    <FaTimes />
                </button>
            </nav>
            <button
                className="nav-btn"
                onClick={showNavbar}>
                <FaBars />
            </button>
        </header>
    );
}

export default Navbar;