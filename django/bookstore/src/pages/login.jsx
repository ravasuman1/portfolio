import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Link } from 'react-router-dom'

import { buttonVariants } from "@/components/ui/button"
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
import { useAuth } from '@/context/AuthContext'
import MainPageLayout from '@/MainPageLayout'





const formSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    password: z.string().min(2, {
        message: "Password must be at least 6 characters.",
    }),

})



const Login = () => {
    const auth = useAuth();




    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",

        },
    })


    // 2. Define a submit handler.
    function onSubmit(values) {
        auth.loginAction(values)

    }





    return (
        <MainPageLayout>
            <div className='container max-w-7xl mx-auto px-8 py-2 h-screen flex items-center justify-center'>
                <Card className="max-w-xl w-full py-8">
                    <CardHeader>
                        <CardTitle className="text-3xl text-bold">Login</CardTitle>

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
                                <Link to="/register" className={buttonVariants({ variant: "outline" })}>Create Account</Link>
                                <Button type="submit">Login</Button>
                            </CardFooter>
                        </form>
                    </Form>
                </Card>
            </div>
        </MainPageLayout>
    )
}





export default Login