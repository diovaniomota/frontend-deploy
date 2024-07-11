"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { SignInData, signInSchema } from "@/lib/schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { handleSignIn } from "@/lib/server/auth";
import { toast } from "sonner"
import { useAuthStore } from "@/stores/authStore";
import { useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { useRouter } from 'next-nprogress-bar';

export const SignInPage = () => {
    const [loading, setLoading] = useState(false)

    const { setUser } = useAuthStore()

    const router = useRouter()

    const form = useForm<SignInData>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    const onSubmit = async (values: SignInData) => {
        setLoading(true)
        const response = await handleSignIn(values)

        if (response.error) {
            setLoading(false)
            toast.error(response.error.message, { position: "top-center" })

            return;
        }

        setUser(response.data.user)
        toast.success('Autenticado com sucesso!', { position: "top-center" })

        // Redirect to home
        router.push("/")
    }

    return (
        <main className="h-app flex items-center justify-center overflow-auto px-6">
            <Card className="w-96">
                <CardHeader>
                    <CardTitle>Faça Login</CardTitle>
                    <CardDescription>Insira seu email e senha para acessar sua conta.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="space-y-3">
                                {loading ?
                                    <>
                                        {...Array.from({ length: 2 }).map((_, key) => (
                                            <Skeleton
                                                key={key}
                                                className="h-10 rounded-md"
                                            />
                                        ))}
                                    </>
                                    :
                                    <>
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Ex: joao2000@gmail.com" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Senha</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Ex: 123456" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </>
                                }
                            </div>

                            <Button disabled={loading}>Entrar</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </main>
    );
} 