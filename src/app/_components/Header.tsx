import React from "react";
import Link from "next/link";
import "@/app/_styles/Header.scss";

function Header() {
	return (
		<div className={"header"}>
			<div className={"logo"}></div>
			<div className={"authLinks"}>
				<Link href="/login" className={"singInHeaderButton"}>
					Sign In
				</Link>
				<Link href="/registration" className={"singUpHeaderButton"}>
					Sign Up
				</Link>
			</div>
		</div>
	);
}

export default Header;
