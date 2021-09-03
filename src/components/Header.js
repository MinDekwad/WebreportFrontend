import { React } from "react";

const Header = () => {
    return (
        <nav className="main-header navbar navbar-expand navbar-white navbar-light">
            {/* Left navbar links */}
            <ul className="navbar-nav">
                <li className="nav-item">
                <a className="nav-link" data-widget="pushmenu" href="#"><i className="fas fa-bars" /></a>
                </li>
            </ul>

            {/* Right navbar links */}
            <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                <a className="nav-link" data-widget="control-sidebar" data-slide="true" href="#"><i className="fas fa-sign-out-alt" /></a>
                </li>
            </ul>
        </nav>
    )
};

export default Header;