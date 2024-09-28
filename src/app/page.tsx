"use client";
import { trpc } from "./_trpc/client";

export default function Home() {
	const { data } = trpc.test.useQuery();
	return <div>{data}</div>;
}
