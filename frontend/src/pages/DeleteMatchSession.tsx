import { Navigate, useNavigate } from 'react-router-dom'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import axios from 'axios';

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

const deleteFormSchema = z.object({
    session_ID: z.string().min(1).max(50),
  })

export default function DeleteMatchSession() {
    const navigate = useNavigate()

    const deleteForm = useForm<z.infer<typeof deleteFormSchema>>({
        resolver: zodResolver(deleteFormSchema),
        defaultValues: {
            session_ID: "",
        },
    })

    function onDeleteSubmit(values: z.infer<typeof deleteFormSchema>) {
        axios.post(`http://localhost:8000/api/delete-match-session/`, values)
          .then(function (response) {
            console.log(response.data);
            navigate('/Coach');
          })
          .catch(function (error) {
            console.log(error);
          });        
    }

    return (
        <div className="flex flex-col gap-2 w-full">
            <Form {...deleteForm}>
                    <form onSubmit={deleteForm.handleSubmit(onDeleteSubmit)} className="space-y-2">
                        <FormField
                        control={deleteForm.control}
                        name="session_ID"
                        render={({ field }) => (
                            <FormItem>
                            <FormControl>
                                <Input placeholder="Session ID" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                            
                        )}
                        />
                        <Button className="w-full bg-zinc-900" type="submit">Delete</Button>
                    </form>
                </Form>
            </div>
    )
}