"use client";
import Link from "next/link";
import { useState } from "react";
import React from "react";
import "../_styles/Authentication.scss";
import { trpc } from "../_trpc/client";
import { redirect } from "next/navigation";

// import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
// // import {setCookie} from "../Utils/Cookies.js";

// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import config from "../Utils/Config.js";
// import './CSSFiles/Authentitication.scss'
// import {Link} from "react-router-dom";

// const app = initializeApp(config.firebaseConfig);
// const analytics = getAnalytics(app);

function LoginPage() {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const { mutate: register } = trpc.user.register.useMutation({
		onSettled() {
			console.log("onSettled");
		},
		onMutate() {
			console.log("onMutate");
		},
		onError(error) {
			console.log("Error message:", error.message);
			setPassword("");
		},
		onSuccess() {
			console.log("onSuccess");
			return redirect("/");
		},
	});

	function handleKeyDownPassword(event: { key: string }) {
		if (event.key === "Enter") {
			handleLogin();
		}
	}

	function handleLogin() {
		signup(username, email, password)
			.then((userCredential) => {
				console.log(userCredential);
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				console.log(errorCode);
				console.log(errorMessage);
			});
		setPassword("");
	}

	async function signup(username: string, email: string, password: string) {
		// username must be between 4 ~ 31 characters, and only consists of lowercase letters, 0-9, -, and _
		if (
			typeof username !== "string" ||
			username.length < 3 ||
			username.length > 31 ||
			!/^[a-zA-Z0-9_-]+$/.test(username)
		) {
			return {
				error: "Invalid username",
			};
		}

		if (
			typeof email !== "string" ||
			!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
				email,
			)
		) {
			return {
				error: "Invalid email",
			};
		}

		if (
			typeof name !== "string" ||
			name.length > 31 ||
			!/^[a-zA-Z]+$/.test(name)
		) {
			return {
				error: "Invalid name",
			};
		}

		if (
			typeof password !== "string" ||
			password.length < 6 ||
			password.length > 255
		) {
			return {
				error: "Invalid password",
			};
		}

		register({
			username,
			email,
			password: password,
			name,
		});
	}

	return (
		<div className={"loginPage"}>
			<div className={"loginPageTitle"}>Welcome</div>
			<div className={"registrationPageSubTitle"}>
				Please sing in with your password
			</div>
			<div className={"emailInput"}>
				<div className={"emailInputName"}>Username</div>
				<input
					value={username}
					type={"username"}
					onChange={(e) => setUsername(e.target.value)}
				/>
			</div>
			<div className={"emailInput"}>
				<div className={"emailInputName"}>Name</div>
				<input
					value={name}
					type={"name"}
					onChange={(e) => setName(e.target.value)}
				/>
			</div>
			<div className={"emailInput"}>
				<div className={"emailInputName"}>Email</div>
				<input
					value={email}
					type={"email"}
					onChange={(e) => setEmail(e.target.value)}
					autoComplete="new-password"
				/>
			</div>
			<div className={"passwordInput"}>
				<div className={"passwordInputName"}>Password</div>
				<input
					onKeyDown={handleKeyDownPassword}
					value={password}
					type={showPassword ? "text" : "password"}
					onChange={(e) => setPassword(e.target.value)}
					autoComplete="new-password"
				/>
				{showPassword ? (
					<span
						className="material-symbols-outlined visibility"
						onClick={() => setShowPassword(!showPassword)}
					>
						visibility
					</span>
				) : (
					<span
						className="material-symbols-outlined visibility"
						onClick={() => setShowPassword(!showPassword)}
					>
						visibility_off
					</span>
				)}
			</div>
			<div className={"forgotPasswordLink"}>
				<Link href="/forgotPassword" className={"forgotPasswordText"}>
					Forgot password?
				</Link>
			</div>
			<button onClick={handleLogin} className={"loginButton"}>
				Sing In
			</button>
			<Link href="/registration" className={"dontHaveAccount"}>
				Don’t have an account? Sign Up
			</Link>
		</div>
	);
}

export default LoginPage;
