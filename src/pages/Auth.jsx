import React, { useState, useEffect, useMemo, useCallback  } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

// assets
	import Icon from "../media/icon/icons";
	import Company_Logo_short from "../media/image/axi_wideLogo.png";
	import LoginDotBG from "../media/image/login-dot-bg.png";
	import certificates from "../media/image/certificates.png";
	import LoginLine from "../media/image/login-line.png";

// styles & components
	import "../styles/pages.css";
	import Button from "../components/utilitis/Button.jsx";
	import Input from "../components/utilitis/InputField.jsx";
	import AuthAnimation from "../components/Animation/AuthAnimation.jsx";
	import Loader from "../components/utilitis/Loader.jsx";
	import ModalForAuth from "../components/modals/modalforauth.jsx";
	import Errorbox from "../components/utilitis/ErrorBox.jsx";

	import { EmailInput, PasswordInput } from "../components/utilitis/inputs/Input.jsx";

// services
	import { login, signup } from "../services/authService";

const Auth = () => {

	const location = useLocation();
	const navigate = useNavigate();

	const [fields, setFields] = useState({});
	const [errors, setErrors] = useState({});

	const [activePage, setActivePage] = useState("login");
	const [hasSwitched, setHasSwitched] = useState(false);
	const [passwordVisibility, setPasswordVisibility] = useState({ create: false, confirm: false, login: false });
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalType, setModalType] = useState("");
	const [loading, setLoading] = useState(false);
	const [termsAccepted, setTermsAccepted] = useState(false);
    const [submitted, setSubmitted] = useState(false);
	const [errorIcon, setErrorIcon] = useState(null);

	const currentYear = useMemo(() => new Date().getFullYear(), []);

	const regex = {
		name: /^[A-Za-z\s]{2,}$/,
		email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
		contact: /^[0-9+\-\s()]{5,}$/,
		url: /^[^\s.]+\.[^\s]{2,}$/,
		password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
	};
	
	useEffect(() => {
		const formParam = new URLSearchParams(location.search).get("form");
		const newPage = formParam === "signup" ? "signup" : "login";
		setActivePage(newPage);
		setHasSwitched(newPage);
	}, [location.search]);

	const handleInputChange = useCallback((e) => {
		const { name, value } = e.target;
		setFields((prev) => ({ ...prev, [name]: value }));
		setErrors((prev) => ({ ...prev, [name]: "" }));
		if (value !== "" && submitted) setSubmitted(false);
	},[submitted]);

	const togglePasswordVisibility = (field) => {
		setPasswordVisibility((prevState) => ({
			...prevState,
			[field]: !prevState[field],
		}));
	};

	const handlePageSwitch = (page) => {
		if (page !== activePage) {
			setActivePage(page);
			navigate(`/auth?form=${page}`);
		}
	};

	const validateLogin = ({ email, password }) => {
		if (!email || !password) {
			setErrorIcon("fail");
			return "Please fill in all fields";
		}
		return "";
	};

	// Handle login
	const handleLogin = async (e) => {
		e.preventDefault();
		const error = validateLogin(fields);
		if (error) return setErrors(error);

		setLoading(true);
		try {
			await login(fields.email, fields.password);
			navigate("/monitoring");
		} catch {
			setErrors("Wrong password or invalid credentials.");
			setErrorIcon("fail");
		} finally {
			setLoading(false);
		}
	};

	const validateSignup = () => {
		const {
			name, useremail, country, contact, companyName,
			companyURL, povID, new_password, new_confirm,
		} = fields;

		const newErrors = {};
		if (!regex.name.test(name || "")) newErrors.name = "Valid name required";
		if (!regex.email.test(useremail || "")) newErrors.useremail = "Valid email required";
		if (!regex.contact.test(contact || "")) newErrors.contact = "Valid contact required";
		if (!country || country.trim().length < 2) newErrors.country = "Country required";
		if (!companyName || companyName.trim().length < 2) newErrors.companyName = "Company name required";
		if (!regex.url.test(companyURL || "")) newErrors.companyURL = "Valid URL required";
		if (!povID || povID.trim().length < 2) newErrors.povID = "Telegram/Skype ID required";
		if (!regex.password.test(new_password || "")) newErrors.new_password = "Weak password";
		if (new_password !== new_confirm) newErrors.new_confirm = "Passwords do not match";
		if (!termsAccepted) return { form: "Please accept the privacy policy and terms" };

		return newErrors;
	};


	// Handle signup
	const handleSignup = async (e) => {
		e.preventDefault();
		setSubmitted(true);
		setErrorIcon(null);
		const validationErrors = validateSignup();
		if (Object.keys(validationErrors).length) return setErrors(validationErrors);

		setLoading(true);
		try {
			await signup({
				name: fields.name,
				email: fields.useremail,
				company_name: fields.companyName,
				company_url: fields.companyURL,
				phone_no: fields.contact,
				country: fields.country,
				telegram_id: fields.povID,
				password: fields.new_password,
			});
			setModalType("signup");
			setIsModalOpen(true);
			setFields({});
		} catch (err) {
			setErrors(err.message);
		} finally {
			setLoading(false);
		}
	};

	const handleInputBlur = ({ target: { name, value } }) => {
		let message = "";
		if (!value.trim()) message = "This field is required.";
		else {
			if (name === "useremail" && !regex.email.test(value)) message = "Invalid email format.";
			if (name === "contact" && !regex.contact.test(value)) message = "Invalid contact number.";
			if (name === "companyURL" && !regex.url.test(value)) message = "Invalid URL format.";
			if (name === "new_password" && !regex.password.test(value)) message = "Weak password.";
			if (name === "new_confirm" && value !== fields.new_password) message = "Passwords do not match.";
			if (name === "name" && !regex.name.test(value)) message = "Only letters (min 2 chars)";
		}
		setErrors((prev) => ({ ...prev, [name]: message }));
	};

	const openForgetPasswordModal = () => {
		setModalType("forgetpassword")
		setIsModalOpen(true);
	};

	const openPrivacyPolicy = () => {
		setModalType("terms&policy")
		setIsModalOpen(true);
	};

	const [formState, setFormState] = useState({
		email: '',
		password: '',
	});

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormState((prevState) => ({
			...prevState,
			[name]: value,
		}));

		// Clear errors as user types (optional: real-time UX)
		setErrors((prevErrors) => ({
			...prevErrors,
			[name]: '',
		}));
	};


	return (
		<div className="auth-wrapper">
			{typeof errors === "string" && <Errorbox title={errors} iconStatus={errorIcon} />}
			<ModalForAuth
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				defaultEmail={fields.email}
				modalType={modalType}
			/>

			{/* login UI */}
			<div className="auth-page">
				<div className="wrap">

					<div className="auth-left">
						<div className="auth-left-container-screen">
							<div className="auth-left-header">
								<img className="companyFullWideLogo" src={Company_Logo_short} alt="company logo" />
								{activePage === "signup" ? <h2>
									Let's get started!
								</h2> : <h2>
									Back in action!
								</h2> 
								}
								<p className="lastLine" >Your gateway to effortless management.</p>
							</div>

							<div className="auth-left-body">
								<AuthAnimation />
							</div>

							<div className="auth-left-footer">
								<div className="auth-sign">
									<p className="firstLine">Seamless Collaboration</p>
									<img src={LoginLine} alt="auth line" />
								</div>
								<p className="lastLine">
									Effortlessly work together with your team in real-time.
								</p>
							</div>
						</div>
					</div>

					<div className="auth-right">
						{/* Form Buttons*/}
						<div className="form-btn-container">
							<div className={`auth-buttons ${activePage === "signup" ? "signup-active" : "login-active" } ${hasSwitched ? "with-animation" : ""}`} >
								<button
									onClick={() => handlePageSwitch("login")}
									className={activePage === "login" ? "auth-active" : ""}
								>
									Login
								</button>
								<button
									onClick={() => handlePageSwitch("signup")}
									className={activePage === "signup" ? "auth-active" : ""}
								>
									Sign up
								</button>
							</div>
						</div>

						{/* Login Form */}
						<div className={`form-wrapper ${activePage === "login" ? "auth-active" : "inactive" }`} >
							<form className="login-form">
								<div>
									<Input
										label="Email ID"
										type="email"
										placeholder="Email ID"
										name="email"
										value={fields.email}
										onChange={handleInputChange}
										onBlur={handleInputBlur}
										required
										errorMessage={errors.email}
									/>
							<div className="inputStablizer">
								<EmailInput
									name='email'
									placeholder='Email'
									value={formState.email}
									onChange={handleChange}
									// helpText={errors.email}
									// helpText={"Hello"}
									required={true}
								/>
							</div>

							<PasswordInput
								name='password'
								placeholder='Password'
								value={formState.password}
								onChange={handleChange}
								// helpText={errors.password}
								// helpText={"Hello"}
								// helpCount={"20"}
								required={true}
							/>

									<div className="input-password">
										<Input
											type={
												passwordVisibility.login ? "text" : "password"
											}
											label="Password"
											name="password"
											placeholder="Password"
											onChange={handleInputChange}
											onBlur={handleInputBlur}
											required
											errorMessage={errors.password}
											value={fields.password || ""}
										/>
										{fields.password && (
											<span
												className="password-icon"
												onClick={() => togglePasswordVisibility("login")}
											>
												{passwordVisibility.login ? (
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
										)}
									</div>
									<p className="forgotpassword-link" onClick={openForgetPasswordModal}>
										Forgot Password?
									</p>
								</div>
								<div>
									<Button
										className="auth_btn"
										type="submit"
										backgroundcolor="#007bff"
										size="large"
										textColor="#ffffff"
										onClick={handleLogin}
									>
										<span>Log In</span>
										{loading ? (
											<Loader
												strokeColor="#fafafa"
												width={20}
												height={20}
											/>
										) : (
											<>
												<Icon
													name="auth_btn_right_arrow"
													width={20}
													height={20}
													color="#ffffff"
												/>
											</>
										)}
									</Button>
									<Link to="https://axipays.com" className="authBackBtn">
										<div className="backBtn-label">
											<p>Back To Homepage</p>
										</div>
									</Link>
								</div>
							</form>
						</div>

						{/* Signup Form */}
						<div className={`form-wrapper ${activePage === "signup" ? "auth-active" : "inactive" }`} >
							<form className="signup-form">
								<div>
									<Input
										type="text"
										label="Full Name"
										name="name"
										placeholder="Name"
										value={fields.name}
										onChange={handleInputChange}
										onBlur={handleInputBlur}
										required
										errorMessage={errors.name}
									/>
									<Input
										type="email"
										label="Email ID"
										placeholder="Email"
										name="useremail"
										value={fields.useremail}
										onChange={handleInputChange}
										onBlur={handleInputBlur}
										required
										errorMessage={errors.useremail}
									/>
								</div>
								<div>
									<Input
										type="text"
										placeholder="Contact No."
										label="Contact No."
										name="contact"
										value={fields.contact}
										onChange={handleInputChange}
										onBlur={handleInputBlur}
										required
										errorMessage={errors.contact}
									/>
									<div className="country-input">
										<Input
											type="text"
											label="Country"
											name="country"
											placeholder="Country"
											value={fields.country}
											onChange={handleInputChange}
											onBlur={handleInputBlur}
											required
											errorMessage={errors.country}
										/>
										<div className="country-icon">
											<Icon
												name="world"
												width={18}
												height={18}
												color="#dedddd"
											/>
										</div>
									</div>
								</div>
								<div>
									<Input
										type="text"
										placeholder="Company Name"
										label="Company Name"
										name="companyName"
										value={fields.companyName}
										onChange={handleInputChange}
										onBlur={handleInputBlur}
										required
										errorMessage={errors.companyName}
									/>
									<Input
										type="text"
										placeholder="Company URL"
										label="Company URL"
										name="companyURL"
										value={fields.companyURL}
										onChange={handleInputChange}
										onBlur={handleInputBlur}
										required
										errorMessage={errors.companyURL}
									/>
								</div>
								<div>
									<Input
										type="text"
										placeholder="Telegram User ID"
										label="Telegram User ID"
										name="povID"
										value={fields.povID}
										onChange={handleInputChange}
										onBlur={handleInputBlur}
										required
										errorMessage={errors.povID}
									/>
									<div className="input-password">
										<Input
											type={
												passwordVisibility.create ? "text" : "password"
											}
											placeholder="Create Password"
											label="Create Password"
											name="new_password"
											value={fields.new_password}
											onChange={handleInputChange}
											onBlur={handleInputBlur}
											required
											errorMessage={errors.new_password}
										/>
										{fields.new_password && (
											<span
												className="password-icon icon-pass"
												onClick={() => togglePasswordVisibility("create")}
											>
												{passwordVisibility.create ? (
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
										)}
									</div>
								</div>
								<div className="termspolicy">
									<Input
										type="checkbox"
										id="type-checkbox"
										onChange={() => setTermsAccepted(!termsAccepted)}
										required={true}
									/>
									<span>
										I agree to <i onClick={openPrivacyPolicy}>privacy policy and terms</i>
									</span>
								</div>
								<span>
									<Button
										className="auth_btn signup_btn"
										backgroundcolor="#007bff"
										size="large"
										textColor="#ffffff"
										onClick={handleSignup}
									>
										Sign Up
										{loading ? (
											<Loader
												strokeColor="#fafafa"
												width={20}
												height={20}
											/>
										) : (
											<>
												<Icon
													name="auth_btn_right_arrow"
													width={20}
													height={20}
													color="#ffffff"
												/>
											</>
										)}
									</Button>
									<Link to="https://axipays.com" className="authBackBtn">
										<div className="backBtn-label">
											<p>Back To Homepage</p>
										</div>
									</Link>
								</span>
								
							</form>
							
						</div>

						{/* Auth fotter */}
						<div className="auth-right-footer">
							<div className="certificates">
								<img src={certificates} alt="" />
								<p>{currentYear} Axipays. All rights reserved.</p>
							</div>

							<p className="company_tagline">
								Your Global Payment Processor
							</p>
						</div>

						{/* Auth-Right BG */}
						<div className="authRight-page-dotBackground">
							<img src={LoginDotBG} alt="Login Dot Background" />
						</div>
					</div>

				</div>
			</div>
		</div>
	);
};

export default Auth;