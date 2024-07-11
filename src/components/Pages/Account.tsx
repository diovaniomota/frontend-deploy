"use client";

import { updateUser } from "@/lib/requests";
import { UpdateUserData, updateUserSchema } from "@/lib/schemas/userSchema";
import { useAuthStore } from "@/stores/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Label } from "../ui/label";

export const AccountPage = () => {
    const { user, setUser } = useAuthStore()

    const [loading, setLoading] = useState(false)
    const [avatar, setAvatar] = useState<File | null>(null)
    const [avatarUrl, setAvatarUrl] = useState<string>('')

    const form = useForm<UpdateUserData>({
        resolver: zodResolver(updateUserSchema),
        defaultValues: {
            name: user?.name,
            email: user?.email,
            password: "",
            confirm_password: "",
        }
    })

    const onSubmit = async (data: UpdateUserData) => {
        const formData = new FormData();

        formData.append("name", data.name)
        formData.append("email", data.email)
        formData.append("password", data.password)
        formData.append("avatar", avatar || "")

        setLoading(true)
        const response = await updateUser(formData)
        setLoading(false)

        if (response.error) {
            toast.error(response.error.message, { position: "top-center" })

            return;
        }

        const user = response.data.user

        setUser(user)

        form.setValue("name", user.name)
        form.setValue("email", user.email)
        form.setValue("password", "")
        form.setValue("confirm_password", "")
        setAvatar(null)

        toast.success('Dados atualizados com sucesso!', { position: "top-center" })
    }

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        
        if (file) {
            setAvatar(file)
            setAvatarUrl(URL.createObjectURL(file))
        }
    }

    return (
        <div className="h-full flex items-center justify-center px-6">
            <Card className="w-full sm:w-[450px]">
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="pt-5 space-y-8">
                            <div className="space-y-6">
                                {loading &&
                                    <>
                                        {...Array.from({ length: 7 }).map((_, key) => (
                                            <Skeleton
                                                key={key}
                                                className="h-10 rounded-md"
                                            />
                                        ))}
                                    </>
                                }

                                {!loading &&
                                    <>
                                        <div className="space-y-3">
                                            <Label htmlFor="avatar">Avatar</Label>

                                            <div className="flex items-center gap-3">
                                                <Avatar className="size-11">
                                                    <AvatarImage
                                                        src={avatarUrl ?? user?.avatar}
                                                        alt={user?.name}
                                                    />
                                                    <AvatarFallback>{user?.name.slice(0, 2)}</AvatarFallback>
                                                </Avatar>

                                                <Input
                                                    id="avatar"
                                                    type="file"
                                                    onChange={handleAvatarChange}
                                                />
                                            </div>
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Seu nome</FormLabel>
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
                                                    <FormLabel>Seu email</FormLabel>
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
                                                    <FormLabel>Sua senha</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} type="password" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="confirm_password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Confirme sua senha</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} type="password" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </>
                                }
                            </div>

                            <Button className="w-full" disabled={loading}>Atualizar os dados</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}