"use client"

import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { MixerHorizontalIcon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { ButtonUi, DropdownMenuUi } from "@/components/ui"

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>
}

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  return (
    <DropdownMenuUi.Root>
      <DropdownMenuTrigger asChild>
        <ButtonUi.Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
        >
          <MixerHorizontalIcon className="mr-2 h-4 w-4" />
          View
        </ButtonUi.Button>
      </DropdownMenuTrigger>
      <DropdownMenuUi.Content align="end" className="w-[150px]">
        <DropdownMenuUi.Label>Toggle columns</DropdownMenuUi.Label>
        <DropdownMenuUi.Separator />
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide()
          )
          .map((column) => {
            return (
              <DropdownMenuUi.CheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuUi.CheckboxItem>
            )
          })}
      </DropdownMenuUi.Content>
    </DropdownMenuUi.Root>
  )
}
