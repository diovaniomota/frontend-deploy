"use client";

import { z } from "zod"

/* Sign In */
export const signInSchema = z.object({
    email: z.string().email({ message: "Email inválido" }),
    password: z.string().min(1, { message: "Senha obrigatória" }),
})

export type SignInData = z.infer<typeof signInSchema>

/* Sign Up */
export const signUpSchema = z.object({
    name: z.string().min(1, { message: "Nome obrigatório" }).max(80, { message: "Nome muito grande" }),
    email: z.string().email({ message: "Email inválido" }).max(254, { message: "Email muito grande" }),
    password: z.string().min(1, { message: "Senha obrigatória" }).regex(/^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9\s]).+$/, { message: "A Senha deve conter pelo menos uma letra, um número e um caractere especial" }).max(80, { message: "Senha muito grande" }),
})

export type SignUpData = z.infer<typeof signUpSchema>