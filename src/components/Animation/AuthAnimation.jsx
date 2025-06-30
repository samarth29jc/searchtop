import React from "react";
import "../../styles/component.css"

function LoginVideo() {
    return (
        <>
            <div className="top-card-container">
                <div className="card-header">
                    <div className="card-title blue line-one-animation"></div>
                    <div className="card-title-two line-two-animation"></div>
                </div>
                <div className="card-body">
                    <input type="text" placeholder="Enter Here" disabled />
                    <div className="card-button" >
                        <div className="white-line"></div>
                    </div>
                </div>
                <div className="card-header">
                    <div className="card-title-two bottom-line"></div>
                </div>
            </div>
            <div className="bottom-card-container">
                <div className="dots">
                    <div className="dot red"></div>
                    <div className="dot green"></div>
                    <div className="dot blue"></div>
                </div>
                <div className="column-for-login">
                    <div className="first-div">
                        <div>
                            <div className="card-title-two first-line"></div>
                            <div className="card-title-two first-line second-line"></div>
                        </div>
                        <div className="card-title-two first-line third-line"></div>
                    </div>

                    <div className="first-div">
                        <div className="card-title-two first-line third-line "></div>
                        <div className="card-title-two third-line green"></div>
                    </div>

                    <div className="first-div">
                        <div className=" card-title-two card-title white"></div>
                        <div className=" card-title-two card-title white second-line"></div>
                    </div>

                    <div className="first-div lines-div">
                        <div className="box green"></div>
                        <div>
                            <div className=" card-title-two card-title white second-line"></div>
                            <div className=" card-title-two card-title white second-line"></div>
                            <div className=" card-title-two card-title white second-line"></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LoginVideo;