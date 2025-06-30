import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../../components/utilitis/Input";
import ResponsiveModal from "../../components/utilitis/Modal.jsx";
import Icon from "../../media/icon/icons.jsx";
import Button from "../../components/utilitis/Button.jsx";
import { apiRequest } from "../../services/apiService.jsx";

const ForgetPasswordModal = ({
    isOpen,
    onClose,
    defaultEmail,
    modalType
}) => {
    const [email, setEmail] = useState(defaultEmail || "");
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [newPassword, setNewPassword] = useState("");
    const [passwordVisibility, setPasswordVisibility] = useState({
        newPassword: false,
        confirmNewPassword: false,
    });
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [step, setStep] = useState(1);
    const navigate = useNavigate();
    const handleLoginClick = () => {
        navigate("/auth?form=login");
        onClose();
    };

    useEffect(() => {
        if (!isOpen) {
            resetForm();
        }
        if (isOpen && defaultEmail) {
            setEmail(defaultEmail);
        }
    }, [isOpen, defaultEmail]);

    const generateOtp = () => {
        const otp = Math.floor(100000 + Math.random() * 900000);
        return otp.toString();
    };

    const handleEmailSubmit = async () => {
        if (email) {
            const generatedOtp = generateOtp();

            const data = {
                email: email,
                otp: generatedOtp,
            };
            try {
                const apiEndpoint = 'api/v1/auth/sendotp';
                const response = await apiRequest(apiEndpoint, "POST", data);

                if (response.status === "success") {
                    sessionStorage.setItem("generatedOtp", generatedOtp);
                    setStep(2);
                } else {
                }
            } catch (error) {
            }
        }
    };

    const resetForm = () => {
        setEmail("");
        setOtp(new Array(6).fill(""));
        setNewPassword("");
        setConfirmNewPassword("");
        setStep(1);
    };

    // const handleEmailSubmit = () => {
    //     if (email) {
    //         handlePasswordReset(email);
    //         setStep(2);
    //     }
    // };

    const handleOtpSubmit = () => {
        const enteredOtp = otp.join("");  
        const storedOtp = sessionStorage.getItem("generatedOtp");  
    
        if (enteredOtp === storedOtp) {
            setStep(3);  
        } else {
        }
    };
    
    const handleNewPasswordSubmit = async () => {
        if (newPassword && newPassword === confirmNewPassword) {
            try {
                const data = { email, password:newPassword };
                const apiEndpoint = 'api/v1/auth/resetpassword'; 
                const response = await apiRequest(apiEndpoint, "PATCH", data);
    
                if (response.success) {
                    onClose(); 
                } else {
                }
            } catch (error) {
            }
        } else {
        }
    };
    

    const handleOtpChange = (value, index) => {
        const updatedOtp = [...otp];
        updatedOtp[index] = value.slice(-1); 
        setOtp(updatedOtp);

        if (value && index < otp.length - 1) {
            document.getElementById(`otp-${index + 1}`).focus();
        }
    };

    const getTitle = () => {
        if (modalType === "signup") {
            return "Signup";
        }
        if (modalType === "terms&policy") {
            return "Privacy Policy";
        }
        switch (step) {
            case 1:
                return "Reset Password";
            case 2:
                return "Enter Verification Code";
            case 3:
                return "Create New Password";
            default:
                return "Reset Password";
        }
    };

    const getPara = () => {
        if (modalType === "signup") {
            return;
        }
        if (modalType === "terms&policy") {
            return;
        }
        switch (step) {
            case 1:
                return "Use your registered e-mail address to reset your password.";
            case 2:
                return "Enter the 6-digit code received via registered email.";
            case 3:
                return "Set your new password.";
            default:
                return "Reset Password";
        }
    };

    const handleCancel = () => {
        if (step > 1) {
            setStep(step - 1); 
        } else {
            onClose(); 
        }
    };

    const togglePasswordVisibility = (field) => {
        setPasswordVisibility((prevState) => ({
            ...prevState,
            [field]: !prevState[field],
        }));
    };

    return (
        <ResponsiveModal
            isOpen={isOpen}
            onClose={onClose}
            centered
            title={getTitle()}
            modalbuttonCancel="forgot-button-back"
            content={getPara()}
            confirmText={modalType === "signup" ? null : modalType === "terms&policy" ? null : (step === 1 ? "Send OTP" : step === 2 ? "Verify OTP" : "Create")}
            onCancel={handleCancel}
            cancelText={step > 1 ? "Back" : ""}
            overlay
            showbuttons={modalType !== "signup"}
            modalbuttonConfirm="forgot-password-button"
            iconName="arrow_right_alt"
            iconColor="#ffffff"
            onConfirm={
                step === 1
                    ? handleEmailSubmit
                    : step === 2
                        ? handleOtpSubmit
                        : handleNewPasswordSubmit
            }
        >
            {modalType === "forgetpassword" && (<div className="forget-password-modal-window">
                {step === 1 && (
                    <div className="input-container">
                        <Input
                            id="email"
                            value={email}
                            onChange={(value) => setEmail(value)}
                            placeholder="Enter your email"
                            type="email"
                            className="form-input"
                        />
                        <p className="description-text">Please provide the email address associated with your account. We’ll send you a verification code to reset your password.</p>
                    </div>

                )}

                {step === 2 && (
                    <div>
                        <div className="otp-input-container">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    id={`otp-${index}`}
                                    type="text"
                                    value={digit}
                                    onChange={(e) => handleOtpChange(e.target.value, index)}
                                    maxLength="1"
                                    className="otp-input"
                                />
                            ))}
                        </div>
                        <div className="otp-actions">
                            <span>Didn't Receive OTP?</span>
                            <div>
                                <span className="otp-link" onClick={() => console.log("Resend OTP")}>
                                    <Icon name="reply" width={20} height={20}></Icon>Resend OTP
                                </span>
                                {/* <span className="otp-link" onClick={() => console.log("Change Email ID")}>
                                    <Icon name="mode" width={20} height={20}></Icon>Change Email ID
                                </span> */}
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="input-container">
                        <div className="create-new-password-input input-password">
                            <Input
                                id="newpassword"
                                value={newPassword}
                                onChange={(value) => setNewPassword(value)}
                                placeholder="New Password"
                                type={
                                    passwordVisibility.newpassword ? "text" : "password"
                                }
                                className="form-input"
                            />
                            <span
                                className="password-icon"
                                onClick={() => togglePasswordVisibility("newpassword")}
                            >
                                {passwordVisibility.newpassword ? (
                                    <Icon
                                        name="visibility_hide"
                                        width={18}
                                        height={18}
                                        color="#dedddd"
                                    />
                                ) : (
                                    <Icon
                                        name="show"
                                        width={18}
                                        height={18}
                                        color="#dedddd"
                                    />
                                )}
                            </span>
                        </div>
                        <div className="create-new-password-input input-password">
                            <Input
                                id="confirmNewpassword"
                                value={confirmNewPassword}
                                onChange={(value) => setConfirmNewPassword(value)}
                                placeholder="Confirm New Password"
                                type={
                                    passwordVisibility.confirmpassword ? "text" : "password"
                                }
                                className="form-input"
                            />
                            <span
                                className="password-icon"
                                onClick={() => togglePasswordVisibility("confirmpassword")}
                            >
                                {passwordVisibility.confirmpassword ? (
                                    <Icon
                                        name="visibility_hide"
                                        width={18}
                                        height={18}
                                        color="#dedddd"
                                    />
                                ) : (
                                    <Icon
                                        name="show"
                                        width={18}
                                        height={18}
                                        color="#dedddd"
                                    />
                                )}
                            </span>
                        </div>
                    </div>
                )}
            </div>
            )}
            {modalType === "signup" && (
                <div className="forget-password-modal-window">
                    <div className="signup-modal">
                        <div>
                            <h3> Signup Successfully</h3>
                            <p className="description-text">You have successfully signed up. Click on the 'Login' button to log-in.</p>
                        </div>
                        <Button className="btn-medium" backgroundcolor="#003366" size="medium" onClick={handleLoginClick}>Login</Button>
                    </div>

                </div>
            )}

            {modalType === "terms&policy" && (
                <div className="termsandpolicy-modal">
                    <p> Axipays and its associates (“Axipays” or, “us “, “our “, “we “) is the maker and holder of software for payment gateway (“Axipays”). We acknowledge and highly regard the significance of managing the privacy of our customers (each a “Customer “) as well as our customers’ clients. This Privacy Policy narrates the kinds of information we accumulate from you when you visit and operate our website (“Site “) and/or use the Services, documentation and services provided by Axipays in regard of the Services. This Privacy Policy also describes how we may exercise, shift, keep and impart the information accumulated, as well as your capability to be in control definite operation of the accumulated information. Axipays is the data custodian in relation to the processing activities delineated in this Privacy Policy pertaining to information accumulated and/or furnished by operators through the Site and the data processor pertaining to any information furnished by a customer pertaining to its clients. The Customer is the data custodian concerning processing of activities delineated in this Privacy Policy pertaining to any information furnished by a customer relating to its clients. “You” means any operator who has attained an age of majority and is operating the Site or Services, using the Site or Services in the name of an entity, individual or yourself or any parent or warden of any minor whom you permit to operate the Site (as defined below) or Services, and for whom you will be held strictly accountable.
                    </p>

                    <h4>Personal Information We Accumulate</h4>
                    <p> While you contact us by the Site, we accumulate Personal Information furnished by you, for instance your name, email address, information concerning your (desired) operation of the Services and title. We also accumulate information about your operation of the Services and our Customers’ clients (including as provided by the Customer). If you connect with us for questions or grievances, we will accumulate the information associated with your query.
                    </p>
                    <h4>  Basis for Processing Your Personal Information</h4>
                    <p>   Processing your Personal Information is required for the provision of the Site and Services to you. Processing for the motive of evolving and amplify our products and Services, for analytics and usage review, for fraud avoidance and security and for our record keeping and safe guard of our legal rights – are all mandatory for the object of lawful interests that we follow.
                    </p>
                    <h4>  How We Use the Information We Collect</h4>
                    <p>   We operate the information (including Personal Information). We accumulate largely to orchestrate and furnish the Site and Services and furnishing you with administrative information and enhance the Site and Services.
                    </p>
                    <h4>   Sharing the Personal Information, We Collect</h4>
                    <p>  We may share the Personal Information we accumulate with our service providers and apprentices who help us in the functioning of the Site and Services and exercise the information in our support and under our directions, as well as with the distinct Customer through which their client is operating our Services. We may share your information with any third party that you direct us to furnish such information with. You by virtue of this warrant that any such direction and transfer shall be in compliance with applicable law, along with reference to international transfer.
                    </p>
                    <h4>  Your Rights</h4>
                    <p> Subject to appropriate law and auxiliary rights as described below, you may have a right to access, edit and/or delete your Personal Information and retrieve a copy of the Personal Information we have accumulated about you.
                    </p>
                    <h4>Use of Cookies</h4>
                    <p>We operate cookies to help customize your experience. You can alter your settings to decide which cookies you do or do not permit. Replacing your settings and/or deleting subsisting cookies may influence the Services.
                    </p>
                    <h4>  Retention</h4>
                    <p>  We preserve information for as long as it is essential for the objectives stated in this Privacy Policy.
                    </p>
                    <h4>    Security</h4>
                    <p>  We apply industry standard measures directed at lower the risks of damage and unapproved access or operation of Personal Information, but they do not furnish complete information security.
                    </p>
                    <h4>     Updates or amendments to the Privacy Policy</h4>
                    <p>  We retain the right to make changes to this Privacy Policy periodically, in our sole circumspection. If we determine to amend this Privacy Policy, we will post these amendments so our operators are always conscious of what information we accumulate, how we operate it, and under what conditions we divulge it. The most recent version of this Privacy Policy will always pop up on our website.

                        If at any period we determine to accumulate or operate your Personal Data in a way different from that stated in this Privacy Policy at the time it was accumulated, we will inform relevant individuals. We will operate your Personal Data only in compliance with the Privacy Policy under which the information was accumulated.
                    </p>
                    <h4> How to contact us</h4>

                    <p>   If you have any query or concerns about this Privacy Policy or our privacy practices, please communicate with us at mailto:info@Axipays.com.
                    </p>
                </div>

            )}
        </ResponsiveModal>
    );
};

export default ForgetPasswordModal;
