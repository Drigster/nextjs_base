import { validateRequest } from "./auth";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { db } from "./db";

export async function createContext({
	req,
	resHeaders,
}: FetchCreateContextFnOptions) {
	const { session, user } = await validateRequest();
	return { req, resHeaders, session, user, db };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
