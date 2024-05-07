import { Navigate, useNavigate } from 'react-router-dom'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import axios from 'axios';

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"

const createUserSchema = z.object({
    username: z.string().min(2).max(50),
    password: z.string().min(2).max(50),
    name: z.string().min(2).max(50),
    surname: z.string().min(2).max(50),
    date_of_birth: z.date(),
    height: z.coerce.number(),
    weight: z.coerce.number(),
    nationality: z.string().min(2).max(50),
    usertype: z.string().min(2).max(50),
  })

export default function CreateUser() {
    const navigate = useNavigate()


    const createUserForm = useForm<z.infer<typeof createUserSchema>>({
        resolver: zodResolver(createUserSchema),
        defaultValues: {
            username: "",
            password: "",
            name: "",
            surname: "",
            date_of_birth: new Date(),
            height: 0,
            weight: 0,
            nationality: "",
            usertype: "Player"
        },
    })

    function onCreateUserSubmit(values: z.infer<typeof createUserSchema>) {
        console.log(values);
        axios.post(`http://localhost:8000/api/create-user/`, values)
          .then(function (response) {
            console.log(response);
            createUserForm.reset();
            navigate('/ManagerPage');
          })
          .catch(function (error) {
            console.log(error);
          });
    }

    return (
        <div>
            <h1>Create User</h1>
            <Form {...createUserForm}>
                <form onSubmit={createUserForm.handleSubmit(onCreateUserSubmit)} className="space-y-2">
                {FormBlock("Username","username")}
                {FormBlock("Password","password")}
                {FormBlock("Name","name")}
                {FormBlock("Surname","surname")}
                {FormBlock("Date of Birth","date_of_birth")}
                {FormBlock("Height","height")}
                {FormBlock("Weight","weight")}
                {FormBlock("Nationality","nationality")}
                {FormBlock("User Type","usertype")}
                <FormItem>
                    <Button type="submit">Create</Button>
                </FormItem>
                </form>
            </Form>
        </div>
    )

    function FormBlock(text: string, fieldname: string) {
        return <FormItem>
            <FormLabel>{text}</FormLabel>
            <FormField
                control={createUserForm.control}
                name={fieldname}
                render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            {fieldname=="date_of_birth" ? 
                            <Calendar {...field} mode="single" selected={field.value} onSelect={field.onChange} className="rounded-md border" /> :
                            (fieldname=="height" || fieldname=="weight") ? <Input type="number" {...field}  /> :
                            <Input placeholder={text} {...field} />
                            }
                        </FormControl>
                        <FormMessage />
                    </FormItem>)} />
        </FormItem>;
    }
}

