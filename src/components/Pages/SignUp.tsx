"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { SignUpData, signUpSchema } from "@/lib/schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { handleSignUp } from "@/lib/server/auth";
import { toast } from "sonner"
import { useAuthStore } from "@/stores/authStore";
import { useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { useRouter } from "next/navigation";

export const SignUpPage = () => {
    const [loading, setLoading] = useState(false)

    const setUser = useAuthStore(state => state.setUser)
    const router = useRouter()

    const form = useForm<SignUpData>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: "",
            email: "",
            password: ""
        }
    })

    const onSubmit = async (values: SignUpData) => {
        setLoading(true)
        const response = await handleSignUp(values)

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
                    <CardTitle>Crie uma conta</CardTitle>
                    <CardDescription>Insira seu nome, email e senha para criar uma conta.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="space-y-3">
                                {loading ?
                                    <>
                                        {...Array.from({ length: 3 }).map((_, key) => (
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
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Nome</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Ex: João da Silva" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

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

                            <Button disabled={loading}>Registrar</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </main>
    );
} 