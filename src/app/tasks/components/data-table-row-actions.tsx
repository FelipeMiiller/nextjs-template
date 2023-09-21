"use client"

import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Row } from "@tanstack/react-table"

import { ButtonUi, DropdownMenuUi } from "@/components/ui"

import { labels } from "../data/data"
import { taskSchema } from "../data/schema"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const task = taskSchema.parse(row.original)

  return (
    <DropdownMenuUi.Root>
      <DropdownMenuUi.Trigger asChild>
        <ButtonUi.Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </ButtonUi.Button>
      </DropdownMenuUi.Trigger>
      <DropdownMenuUi.Content align="end" className="w-[160px]">
        <DropdownMenuUi.Item>Edit</DropdownMenuUi.Item>
        <DropdownMenuUi.Item>Make a copy</DropdownMenuUi.Item>
        <DropdownMenuUi.Item>Favorite</DropdownMenuUi.Item>
        <DropdownMenuUi.Separator />
        <DropdownMenuUi.Sub>
          <DropdownMenuUi.SubTrigger>Labels</DropdownMenuUi.SubTrigger>
          <DropdownMenuUi.SubContent>
            <DropdownMenuUi.RadioGroup value={task.label}>
              {labels.map((label) => (
                <DropdownMenuUi.RadioItem key={label.value} value={label.value}>
                  {label.label}
                </DropdownMenuUi.RadioItem>
              ))}
            </DropdownMenuUi.RadioGroup>
          </DropdownMenuUi.SubContent>
        </DropdownMenuUi.Sub>
        <DropdownMenuUi.Separator />
        <DropdownMenuUi.Item>
          Delete
          <DropdownMenuUi.Shortcut>⌘⌫</DropdownMenuUi.Shortcut>
        </DropdownMenuUi.Item>
      </DropdownMenuUi.Content>
    </DropdownMenuUi.Root>
  )
}
