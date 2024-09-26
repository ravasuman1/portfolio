import React from 'react'



import { buttonVariants } from "@/components/ui/button"
import { Link } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Input
} from "@/components/ui/Input"
import { useMutation } from 'react-query'


import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react'
import axiosInstance from '@/axiosConfig'
import MainPageLayout from '@/MainPageLayout'



const formSchema = z.object({
    email: z.string({ message: "Email.required" }).email(),
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    password: z.string().min(2, {
        message: "Password must be at least 6 characters.",
    }),


})


const Register = () => {
    const registerUser = (data) => axiosInstance.post('/register', data)



    const mutation = useMutation({
        mutationFn: registerUser,
        onSuccess: () => {
            toast.success('User created successfully!');
        },
        onError: (error) => {
            toast.error(error.response.data[0] || error.message);
        },
    });


    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            group_name: "user"

        },
    })


    // 2. Define a submit handler.
    function onSubmit(values) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
        mutation.mutate(values);
    }

    return (
        <MainPageLayout>
            <div className='container max-w-7xl mx-auto px-8 py-2 h-screen flex items-center justify-center'>
                <Card className="max-w-xl w-full py-8">
                    <CardHeader>
                        <CardTitle className="text-3xl text-bold">Register</CardTitle>

                    </CardHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} >
                            <CardContent className="space-y-6">




                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Whats Your  username ?" {...field} />
                                            </FormControl>
                                            {/* <FormDescription>
                                            This is your public name
                                        </FormDescription> */}
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
                                                <Input placeholder="Whats Your  email ?" {...field} />
                                            </FormControl>
                                            {/* <FormDescription>
                                            This is your public name
                                        </FormDescription> */}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"

                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Whats Your  Password?" type="password" {...field} />
                                            </FormControl>
                                            {/* <FormDescription>
                                            This is your public name
                                        </FormDescription> */}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />




                            </CardContent>
                            <CardFooter className="flex justify-between mt-6">
                                <Link to="/login" className={buttonVariants({ variant: "outline" })}>I have an Account</Link>
                                <Button type="submit" disabled={mutation.isLoading}>{mutation.isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Register</Button>
                            </CardFooter>
                        </form>
                    </Form>
                </Card>
            </div>
        </MainPageLayout>
    )
}

export default Register