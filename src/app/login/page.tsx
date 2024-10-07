"use client";
import { useState } from "react";
import React from "react";

import "../_styles/Authentication.scss";
import { trpc } from "../_trpc/client";
import { redirect } from "next/navigation";
import Link from "next/link";

function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const { mutate: login } = trpc.user.login.useMutation({
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

	async function handleKeyDownPassword(event: { key: string }) {
		if (event.key === "Enter") {
			await signin(email, password);
		}
	}

	async function signin(email: string, password: string) {
		// username must be between 4 ~ 31 characters, and only consists of lowercase letters, 0-9, -, and _
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
			typeof password !== "string" ||
			password.length < 6 ||
			password.length > 255
		) {
			return {
				error: "Invalid password",
			};
		}

		login({ email, password });
	}

	return (
		<div className={"loginPage"}>
			<div className={"loginPageTitle"}>Welcome</div>
			<div className={"registrationPageSubTitle"}>
				Please sing in with your password
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
				<Link href={"/forgotPassword"} className={"forgotPasswordText"}>
					Forgot password?
				</Link>
			</div>
			<button onClick={async() => {await signin(email, password);}} className={"loginButton"}>
				Sing In
			</button>
			<Link href={"/registration"} className={"dontHaveAccount"}>
				Don’t have an account? Sign Up
			</Link>
		</div>
	);
}

export default LoginPage;
