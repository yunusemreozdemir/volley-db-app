import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


import { CreatePlayer, UpdateStadium } from "@/components"

export default function DBManager () {

    return (
        <div className="p-8">
            <div className="flex flex-row gap-5">
                <div className="flex-[70%] rounded-md shadow-sm border p-5 flex flex-col gap-2">
                    <h1 className="text-2xl font-bold">Create User</h1>
                    <Tabs defaultValue="coach" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="coach">Coach</TabsTrigger>
                            <TabsTrigger value="jury">Jury</TabsTrigger>
                            <TabsTrigger value="player">Player</TabsTrigger>
                        </TabsList>
                        <TabsContent value="coach"></TabsContent>
                        <TabsContent value="jury"></TabsContent>
                        <TabsContent value="player"><CreatePlayer /></TabsContent>
                    </Tabs>
                </div>
                <div className="flex-[30%] rounded-md shadow-sm border p-5 flex flex-col gap-2">
                    <h1 className="text-2xl font-bold">Update Stadium</h1>
                    <UpdateStadium />
                </div>
            </div>
        </div>
        
    )
}