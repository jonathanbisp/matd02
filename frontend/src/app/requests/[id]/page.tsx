"use client"

import React from 'react';
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import { z } from "zod";
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
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {RadioGroup} from "@/components/ui/radio-group";
import {RadioGroupItem} from "@/components/ui/radio-group";
import {Label} from "@/components/ui/label";
import { format } from "date-fns"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {Calendar} from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {CalendarIcon} from "lucide-react";
import {cn} from "@/lib/utils";
import {Textarea} from "@/components/ui/textarea";
import {Card} from "@/components/ui/card";
import OlderRequests from "@/app/requests/new/older-requests";
import {Progress} from "@/components/ui/progress";
import AppBar from "@/components/app-bar";
import {redirect} from "next/navigation";

const formSchema = z.object({
    category: z.string(),
    start: z.date(),
    end: z.date(),
    subcategory: z.string(),
    activity: z.string(),
    activityHours: z.number(),
    requestHours: z.number(),
    shortDescription: z.string().min(3, {
        message: "Descrição curta deve ter pelo menos 3 caracteres.",
    }).max(100, {message: "Maximum characters."}),
})

function NewRequest(props: any) {
    const [start, setStart] = React.useState<Date | undefined>(new Date())
    const [end, setEnd] = React.useState<Date | undefined>(new Date())

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            shortDescription: "",
            category: "",
            subcategory: "",
            activity: ""
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {

        console.log(values)
    }
    return (
        <>
            <AppBar />
            <div className="w-4/5 mx-auto">
                <div className={"w-full flex items-center justify-between"}>

                    <div className={"w-4/5"}>
                        <h1 className={"text-5xl font-bold my-5"}>Solicitação de Horas</h1>
                    </div>

                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                        <Card className="w-full px-10 py-5">
                            <FormField
                                control={form.control}
                                name="shortDescription"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel className={"font-semibold"}>Descrição Curta</FormLabel>
                                        <FormControl>
                                            <Input placeholder="" {...field}  disabled value={"VACINA COVID"}/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <div className={"flex flex-row justify-between w-full mt-5"}>
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({field}) => (
                                        <FormItem className={"w-1/5"}>
                                            <FormLabel className={"font-semibold"}>Categoria</FormLabel>
                                            <FormControl>
                                                <RadioGroup defaultValue="comfortable">
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="default" id="r1" checked/>
                                                        <Label htmlFor="category">Complementar</Label>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="comfortable" id="r2" disabled checked={false}/>
                                                        <Label htmlFor="category">Extensão</Label>
                                                    </div>
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="subcategory"
                                    render={({field}) => (
                                        <FormItem className={"w-2/5"}>
                                            <FormLabel className={"font-semibold"}>Subcategoria</FormLabel>
                                            <FormControl>
                                                <Select value={"apple"} disabled>
                                                    <SelectTrigger className="w-[300px]">
                                                        <SelectValue placeholder="Selecione uma subcategoria"/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup >
                                                            <SelectLabel>Subcategoria</SelectLabel>
                                                            <SelectItem value="apple">Eventos técnicos
                                                                cientificos</SelectItem>
                                                            <SelectItem value="banana">Banana</SelectItem>
                                                            <SelectItem value="blueberry">Blueberry</SelectItem>
                                                            <SelectItem value="grapes">Grapes</SelectItem>
                                                            <SelectItem value="pineapple">Pineapple</SelectItem>
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="activity"
                                    render={({field}) => (
                                        <FormItem className={"w-2/5"}>
                                            <FormLabel className={"font-semibold"}>Atividade</FormLabel>
                                            <FormControl>
                                                <Select value={"apple"} disabled>
                                                    <SelectTrigger className="w-[300px]">
                                                        <SelectValue placeholder="Selecione uma atividade"/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>Atividade</SelectLabel>
                                                            <SelectItem value="apple">Associação em sociedade cientifica
                                                                (ex. SBC, IEEE, ACM).</SelectItem>
                                                            <SelectItem value="banana">Banana</SelectItem>
                                                            <SelectItem value="blueberry">Blueberry</SelectItem>
                                                            <SelectItem value="grapes">Grapes</SelectItem>
                                                            <SelectItem value="pineapple">Pineapple</SelectItem>
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className={"flex flex-row justify-between mt-5"}>
                                <FormField
                                    control={form.control}
                                    name="start"
                                    render={({field}) => (
                                        <FormItem className={"w-1/4"}>
                                            <FormLabel className={"font-semibold"}>Inicio da Atividade</FormLabel>
                                            <br/>
                                            <FormControl>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-[280px] justify-start text-left font-normal",
                                                                !start && "text-muted-foreground"
                                                            )}
                                                        >
                                                            <CalendarIcon/>
                                                            {start ? format(start, "PPP") :
                                                                <span>Selecione uma data</span>}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0">
                                                        <Calendar
                                                            disabled
                                                            mode="single"
                                                            selected={start}
                                                            onSelect={setStart}
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="end"
                                    render={({field}) => (
                                        <FormItem className={"w-1/4"}>
                                            <FormLabel className={"font-semibold"}>Fim da Atividade</FormLabel>
                                            <br/>
                                            <FormControl>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-[280px] justify-start text-left font-normal",
                                                                !end && "text-muted-foreground"
                                                            )}
                                                        >
                                                            <CalendarIcon/>
                                                            {end ? format(end, "PPP") : <span>Selecione uma data</span>}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0">
                                                        <Calendar
                                                            disabled
                                                            mode="single"
                                                            selected={end}
                                                            onSelect={setEnd}
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <div className={"flex flex-row w-1/2 justify-end"}>
                                    <FormField
                                        control={form.control}
                                        name="activityHours"
                                        render={({field}) => (
                                            <FormItem className={"w-1/2"}>
                                                <FormLabel className={"font-semibold"}>Horas da atividade</FormLabel>
                                                <br/>
                                                <FormControl className={"w-[100px]"}>
                                                    <Input type="number" id="activityHours" placeholder="00" disabled/>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="requestHours"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel className={"font-semibold"}>Horas solicitadas</FormLabel>
                                                <br/>
                                                <FormControl className={"w-[100px]"}>
                                                    <Input type="number" id="requestHours" placeholder="00" disabled/>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>


                            <div className={"mt-5"}>
                                <FormField
                                    control={form.control}
                                    name="requestHours"
                                    render={({field}) => (
                                        <FormItem className={"w-1/4"}>
                                            <FormLabel className={"font-semibold"}>Descrição longa</FormLabel>
                                            <br/>
                                            <FormControl className={"w-[600px]"}>
                                                <Textarea placeholder="Uma longa descrição da atividade..."
                                                      disabled
                                                value={"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."}/>
                                            </FormControl>
                                            <FormMessage/>
                                            <span className={"text-xs text-gray-500"}>Apenas 500 caracteres.</span>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className={"flex flex-row justify-end mt-5"}>
                                <Button type="submit" className={"mr-5"} disabled>Anexar Comprovantes</Button>
                            </div>
                        </Card>

                    </form>
                </Form>
            </div>
        </>
    );
}

export default NewRequest;