import { generateIdFromEntropySize } from "lucia";
import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { lucia } from "../auth";
import { cookies } from "next/headers";

export const userRouter = router({
	list: publicProcedure.query(async ({ ctx }) => {
		return await ctx.db.selectFrom("User").selectAll();
	}),
	byId: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
		return await ctx.db
			.selectFrom("User")
			.selectAll()
			.where("id", "=", input);
	}),
	register: publicProcedure
		.input(
			z.object({
				username: z.string(),
				email: z.string(),
				password: z.string(),
				name: z.string(),
			}),
		)
		.output(z.boolean())
		.mutation(async ({ ctx, input }) => {
			// const passwordHash = await hash(input.password, {
			// 	// recommended minimum parameters
			// 	memoryCost: 19456,
			// 	timeCost: 2,
			// 	outputLen: 32,
			// 	parallelism: 1,
			// });
			const userId = generateIdFromEntropySize(10); // 16 characters long

			await ctx.db
				.insertInto("User")
				.values({
					id: userId,
					username: input.username,
					email: input.email,
					password: input.password,
					name: input.name,
				})
				.execute();

			const session = await lucia.createSession(userId, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			cookies().set(
				sessionCookie.name,
				sessionCookie.value,
				sessionCookie.attributes,
			);

			return true;
		}),
	login: publicProcedure
		.input(
			z.object({
				email: z.string(),
				password: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			// const passwordHash = await hash(input.password, {
			// 	// recommended minimum parameters
			// 	memoryCost: 19456,
			// 	timeCost: 2,
			// 	outputLen: 32,
			// 	parallelism: 1,
			// });

			const user = await ctx.db
				.selectFrom("User")
				.select(["id", "password"])
				.where("email", "=", input.email)
				.executeTakeFirst();

			if (user === undefined) {
				return false;
			}

			if (user.password !== input.password) {
				return false;
			}

			const session = await lucia.createSession(user.id, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			cookies().set(
				sessionCookie.name,
				sessionCookie.value,
				sessionCookie.attributes,
			);

			return true;
		}),
});
