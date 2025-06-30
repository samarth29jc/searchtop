import React from 'react';
import { Link } from "react-router-dom";
import '../styles/component.css';
import AxipaysFull_logo from '../media/image/Logo-stroke.webp';
import Door from "../media/image/404-door.webp";

function Error() {
    return (
        <div className="error-container">
            <div className="error-header">
                <img src={AxipaysFull_logo} alt="Axipays Logo" className="error-logo" />
            </div>

            <div className="error-body">
                <div className="rectangle rectangle-1"></div>
                <div className="rectangle rectangle-2"></div>
                <div className="rectangle rectangle-3"></div>
                <div className="rectangle rectangle-4"></div>
                <div className="rectangle rectangle-5"></div>
                <div className="rectangle rectangle-6"></div>
                <div className="rectangle rectangle-7"></div>
                <div className="rectangle rectangle-8"></div>
                <div className="rectangle rectangle-9"></div>

                <div className="digit-container">
                    <div className="digit">4</div>
                    <div className="digit door">
                        <img src={Door} alt="Door" className="door-image" />
                    </div>
                    <div className="digit">4</div>
                </div>

                <div className="overlay">
                    <h1 className="error-title">We can't seem to find the page you are looking for.</h1>
                    <p>Please consider entering a valid URL.</p>
                    <p>This page does not exist.</p>
                    <Link to="/home">
                        <button className="primary-btn-bright">Back to Home Page</button>
                    </Link>
                </div>
            </div>

            <div className="error-footer">
            </div>
        </div>
    );
}

export default Error;
