import React from 'react';
import {
    ColumnDef,
    ColumnFiltersState, flexRender,
    getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState
} from "@tanstack/react-table";
import type {Request} from "@/types/request";
import {Checkbox} from "@/components/ui/checkbox";
import {Button} from "@/components/ui/button";
import {ArrowUpDown, MoreHorizontal} from "lucide-react";
import {formatRelativeDate, statusToBadge} from "@/helpers";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {data} from "@/app/requests/all/fixtures";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";



const columns: ColumnDef<Request>[] = [
    {
        accessorKey: "publicId",
        header: "ID",
        cell: ({row}) => (
            <div className="capitalize font-mono">{row.getValue("publicId")}</div>
        ),
    },
    {
        accessorKey: "shortDescription",
        header: "Descrição",
        cell: ({row}) => {
            return <div >{row.getValue("shortDescription")}</div>
        },
    },

    {
        accessorKey: "status",
        header: "Status",
        cell: ({row}) => {
            return <div >{statusToBadge(row.getValue("status"))}</div>
        },
    },
    {
        accessorKey: "category",
        header: "Categoria",
        cell: ({row}) => <div className="lowercase font-mono">{row.getValue("category")}</div>,
    },
    {
        accessorKey: "createdAt",
        header: () => <div className="text-right">Solicitado em</div>,
        cell: ({ row }) => {
            const readable = formatRelativeDate(row.getValue("createdAt"))


            return <div className="text-right font-medium">{readable}</div>
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({row}) => {
            const payment = row.original

            const status = row.getValue("status")
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(payment.id)}
                        >
                            { status === "APPROVED" ? "Visualizar" : "Avaliar"}
                        </DropdownMenuItem>
                        {/*<DropdownMenuSeparator />*/}
                        {/*<DropdownMenuItem>View customer</DropdownMenuItem>*/}
                        {/*<DropdownMenuItem>View payment details</DropdownMenuItem>*/}
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]


function OlderRequests(props) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const table = useReactTable({
        data: data.slice(0, 5),
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })
    return (
        <div>
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="h-24 text-center"
                            >
                                Nenhum Resultado.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}

export default OlderRequests;