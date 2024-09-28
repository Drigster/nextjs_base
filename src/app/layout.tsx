import Header from "@/app/_components/Header";
import "./globals.css";
import "@/app/_styles/Header.scss";
import Provider from "./_trpc/Provider";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`mainPage`}>
				<Provider>
					<Header />
					{children}
				</Provider>
			</body>
		</html>
	);
}
