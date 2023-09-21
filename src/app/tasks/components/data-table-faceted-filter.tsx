import * as React from "react"
import { cn } from "@/util/utils"
import { CheckIcon, PlusCircledIcon } from "@radix-ui/react-icons"
import { Column } from "@tanstack/react-table"

import {
  BadgeUi,
  ButtonUi,
  CommandUi,
  PopoverUi,
  SeparatorUi,
} from "@/components/ui"

interface DataTableFacetedFilter<TData, TValue> {
  column?: Column<TData, TValue>
  title?: string
  options: {
    label: string
    value: string
    icon?: React.ComponentType<{ className?: string }>
  }[]
}

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
}: DataTableFacetedFilter<TData, TValue>) {
  const facets = column?.getFacetedUniqueValues()
  const selectedValues = new Set(column?.getFilterValue() as string[])

  return (
    <PopoverUi.Root>
      <PopoverUi.Trigger asChild>
        <ButtonUi.Button
          variant="outline"
          size="sm"
          className="h-8 border-dashed"
        >
          <PlusCircledIcon className="mr-2 h-4 w-4" />
          {title}
          {selectedValues?.size > 0 && (
            <>
              <SeparatorUi orientation="vertical" className="mx-2 h-4" />
              <BadgeUi.Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </BadgeUi.Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <BadgeUi.Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.size} selected
                  </BadgeUi.Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <BadgeUi.Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </BadgeUi.Badge>
                    ))
                )}
              </div>
            </>
          )}
        </ButtonUi.Button>
      </PopoverUi.Trigger>
      <PopoverUi.Content className="w-[200px] p-0" align="start">
        <CommandUi.Root>
          <CommandUi.Input placeholder={title} />
          <CommandUi.List>
            <CommandUi.Empty>No results found.</CommandUi.Empty>
            <CommandUi.Group>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value)
                return (
                  <CommandUi.Item
                    key={option.value}
                    onSelect={() => {
                      if (isSelected) {
                        selectedValues.delete(option.value)
                      } else {
                        selectedValues.add(option.value)
                      }
                      const filterValues = Array.from(selectedValues)
                      column?.setFilterValue(
                        filterValues.length ? filterValues : undefined
                      )
                    }}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <CheckIcon className={cn("h-4 w-4")} />
                    </div>
                    {option.icon && (
                      <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    )}
                    <span>{option.label}</span>
                    {facets?.get(option.value) && (
                      <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                        {facets.get(option.value)}
                      </span>
                    )}
                  </CommandUi.Item>
                )
              })}
            </CommandUi.Group>
            {selectedValues.size > 0 && (
              <>
                <CommandUi.Separator />
                <CommandUi.Group>
                  <CommandUi.Item
                    onSelect={() => column?.setFilterValue(undefined)}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandUi.Item>
                </CommandUi.Group>
              </>
            )}
          </CommandUi.List>
        </CommandUi.Root>
      </PopoverUi.Content>
    </PopoverUi.Root>
  )
}
