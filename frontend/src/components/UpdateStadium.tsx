import React from "react";
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

const updateFormSchema = z.object({
    previous_name: z.string().min(2).max(50),
    name: z.string().min(2).max(50),
  })

export default function UpdateStadium() {

    const updateForm = useForm<z.infer<typeof updateFormSchema>>({
        resolver: zodResolver(updateFormSchema),
        defaultValues: {
            previous_name: "",
            name: "",
        },
    })

    function onUpdateSubmit(values: z.infer<typeof updateFormSchema>) {
        axios.post(`http://localhost:8000/api/update-stadium/`, values)
          .then(function (response) {
            updateForm.reset();
          })
          .catch(function (error) {
            console.log(error);
          });        
    }

    return (
        <div className="flex flex-col gap-2 w-full">
            <Form {...updateForm}>
                <form onSubmit={updateForm.handleSubmit(onUpdateSubmit)} className="space-y-2">
                    <FormField
                    control={updateForm.control}
                    name="previous_name"
                    render={({ field }) => (
                        <FormItem>
                        <FormControl>
                            <Input placeholder="Previous Name" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                        
                    )}
                    />
                    <FormField
                    control={updateForm.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormControl>
                            <Input placeholder="New Name" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                        
                    )}
                    />
                    <Button className="w-full bg-zinc-900" type="submit">Update</Button>
                </form>
            </Form>
        </div>
    );
}