"use client";
import Link from "next/link";
import { useState } from "react";
import React from "react";
import "../_styles/Authentication.scss";
import { trpc } from "../_trpc/client";
import { redirect } from "next/navigation";

import zxcvbn from 'zxcvbn';

function RegistrationPage() {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [repeatedPassword, setRepeatedPassword] = useState("");
	const [name, setName] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showRepeatedPassword, setShowRepeatedPassword] = useState(false);

	const testResult = zxcvbn(password);
	const strengthScore = testResult.score * 100/4;

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
			window.location.href = '/';
			return;
		}
	})

	function drawPassStrengthChecker() {
		return(
			<div className={"passStrength"}>
				<div className={"progressBarDiv"}>
					<div className={"progress"} style={changePasswordColor()}/>
				</div>
				<div className={"passStrengthText"} style={{ color: funcProgressColor() }}>
					{password.length > 0 && createPassLabel()}
				</div>
			</div>
		)
	}

	const changePasswordColor = () => ({
		width: `${strengthScore}%`,
		background: funcProgressColor(),
		borderRadius: `${(strengthScore === 100) ? '3px' : '3px 0 0 3px'}`,
	})

	const createPassLabel = () => {
		switch(testResult.score) {
			case 0:
				return 'Very weak';
			case 1:
				return 'Weak';
			case 2:
				return 'Fear';
			case 3:
				return 'Good';
			case 4:
				return 'Strong';
			default:
				return '';
		}
	}

	const funcProgressColor = () => {
		switch(testResult.score) {
			case 0:
				return '#828282';
			case 1:
				return '#EA1111';
			case 2:
				return '#FFAD00';
			case 3:
				return '#9bc158';
			case 4:
				return '#00b500';
			default:
				return 'none';
		}
	}

	async function handleKeyDownPassword(event: { key: string }) {
		if (event.key === "Enter") {
			await signup(username, email, password)
		}
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
				<div className={"inputTitleAndRequired"}>
					<div className={"inputName"}>Username</div>
				</div>
				<input
					value={username}
					type={"username"}
					onChange={(e) => setUsername(e.target.value)}
				/>
			</div>
			<div className={"emailInput"}>
				<div className={"inputTitleAndRequired"}>
					<div className={"inputName"}>Name</div>
				</div>
				<input
					value={name}
					type={"name"}
					onChange={(e) => setName(e.target.value)}
				/>
			</div>
			<div className={"emailInput"}>
				<div className={"inputTitleAndRequired"}>
					<div className={"inputName"}>Email</div>
				</div>
				<input
					value={email}
					type={"email"}
					onChange={(e) => setEmail(e.target.value)}
					autoComplete="new-password"
				/>
			</div>
			<div className={"passwordInput"}>
				<div className={"inputTitleAndRequired"}>
					<div className={"inputName"}>Password</div>
				</div>
				<input
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
			{drawPassStrengthChecker()}
			<div className={"repeatPasswordInput"}>
				<div className={"inputTitleAndRequired"}>
					<div className={"inputName"}>Repeat password</div>
				</div>
				<input
					onKeyDown={handleKeyDownPassword}
					value={repeatedPassword}
					type={showRepeatedPassword ? "text" : "password"}
					onChange={(e) => setRepeatedPassword(e.target.value)}
					autoComplete="new-password"
				/>
				{showPassword ? (
					<span
						className="material-symbols-outlined visibility"
						onClick={() => setShowRepeatedPassword(!showRepeatedPassword)}
					>
						visibility
					</span>
				) : (
					<span
						className="material-symbols-outlined visibility"
						onClick={() => setShowRepeatedPassword(!showRepeatedPassword)}
					>
						visibility_off
					</span>
				)}
				<div className={"notSamePassError"}>
					{repeatedPassword.length > 0 && repeatedPassword !== password && "Passwords do not match"}
				</div>
			</div>
			<button onClick={async() => {
				await signup(username, email, password)
			}} className={"registrationButton"}>
				Sing Up
			</button>
			<Link href='/login' className={"alreadyHaveAnAccount"}>
				Already have an account? Sign In
			</Link>
		</div>
	);
}

export default RegistrationPage;
