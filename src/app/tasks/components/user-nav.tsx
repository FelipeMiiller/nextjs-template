"use client"

import { AvatarUi, ButtonUi, DropdownMenuUi } from "@/components/ui"

export function UserNav() {
  return (
    <DropdownMenuUi.Root>
      <DropdownMenuUi.Trigger asChild>
        <ButtonUi.Button
          variant="ghost"
          className="relative h-8 w-8 rounded-full"
        >
          <AvatarUi.Root className="h-9 w-9">
            <AvatarUi.Image src="/avatars/03.png" alt="@shadcn" />
            <AvatarUi.Fallback>SC</AvatarUi.Fallback>
          </AvatarUi.Root>
        </ButtonUi.Button>
      </DropdownMenuUi.Trigger>
      <DropdownMenuUi.Content className="w-56" align="end" forceMount>
        <DropdownMenuUi.Label className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">shadcn</p>
            <p className="text-xs leading-none text-muted-foreground">
              m@example.com
            </p>
          </div>
        </DropdownMenuUi.Label>
        <DropdownMenuUi.Separator />
        <DropdownMenuUi.Group>
          <DropdownMenuUi.Item>
            Profile
            <DropdownMenuUi.Shortcut>⇧⌘P</DropdownMenuUi.Shortcut>
          </DropdownMenuUi.Item>
          <DropdownMenuUi.Item>
            Billing
            <DropdownMenuUi.Shortcut>⌘B</DropdownMenuUi.Shortcut>
          </DropdownMenuUi.Item>
          <DropdownMenuUi.Item>
            Settings
            <DropdownMenuUi.Shortcut>⌘S</DropdownMenuUi.Shortcut>
          </DropdownMenuUi.Item>
          <DropdownMenuUi.Item>New Team</DropdownMenuUi.Item>
        </DropdownMenuUi.Group>
        <DropdownMenuUi.Separator />
        <DropdownMenuUi.Item>
          Log out
          <DropdownMenuUi.Shortcut>⇧⌘Q</DropdownMenuUi.Shortcut>
        </DropdownMenuUi.Item>
      </DropdownMenuUi.Content>
    </DropdownMenuUi.Root>
  )
}
