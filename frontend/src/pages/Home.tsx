import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import axios from 'axios';
import { useAuth } from '../hooks'

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const loginFormSchema = z.object({
    username: z.string().min(2).max(50),
    password: z.string().min(2).max(50),
  })


export default function Home() {
    const { checkAuth, login } = useAuth()
    const isAuth = checkAuth()
    const navigate = useNavigate()

    if (isAuth) return <Navigate to="/Feed" />

    const loginForm = useForm<z.infer<typeof loginFormSchema>>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    })

    function onLoginSubmit(values: z.infer<typeof loginFormSchema>) {
        axios.post(`http://localhost:8000/api/login/`, values)
          .then(function (response) {
            loginForm.reset();
            //login(response.data);
            //navigate('/feed');
          })
          .catch(function (error) {
            console.log(error);
          });        
    }

    return (
        <div className="flex justify-center w-screen h-screen">
            <div className='flex flex-col w-full h-full justify-center items-center'>
                <div className="flex flex-col w-1/4 items-center gap-5 rounded-md shadow-sm border p-7">
                    <div className="text-2xl font-bold">
                        Login
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                    <Form {...loginForm}>
                            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-2">
                                <FormField
                                control={loginForm.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormControl>
                                        <Input placeholder="Username" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                    
                                )}
                                />
                                <FormField
                                control={loginForm.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormControl>
                                        <Input placeholder="Password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                    
                                )}
                                />
                                <Button className="w-full bg-zinc-900" type="submit">Continue</Button>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    )
}
