"use client"

import * as React from "react"
import { cn } from "@/util/utils"
import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons"

import {
  AvatarUi,
  ButtonUi,
  CommandUi,
  DialogUi,
  InputUi,
  LabelUi,
  PopoverUi,
  SelectUi,
} from "@/components/ui"

const groups = [
  {
    label: "Personal Account",
    teams: [
      {
        label: "Alicia Koch",
        value: "personal",
      },
    ],
  },
  {
    label: "Teams",
    teams: [
      {
        label: "Acme Inc.",
        value: "acme-inc",
      },
      {
        label: "Monsters Inc.",
        value: "monsters",
      },
    ],
  },
]

type Team = (typeof groups)[number]["teams"][number]

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverUi.Trigger
>

interface TeamSwitcherProps extends PopoverTriggerProps {}

export default function TeamSwitcher({ className }: TeamSwitcherProps) {
  const [open, setOpen] = React.useState(false)
  const [showNewTeamDialog, setShowNewTeamDialog] = React.useState(false)
  const [selectedTeam, setSelectedTeam] = React.useState<Team>(
    groups[0].teams[0]
  )

  return (
    <DialogUi.Root open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
      <PopoverUi.Root open={open} onOpenChange={setOpen}>
        <PopoverUi.Trigger asChild>
          <ButtonUi.Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a team"
            className={cn("w-[200px] justify-between", className)}
          >
            <AvatarUi.Root className="mr-2 h-5 w-5">
              <AvatarUi.Image
                src={`https://avatar.vercel.sh/${selectedTeam.value}.png`}
                alt={selectedTeam.label}
              />
              <AvatarUi.Fallback>SC</AvatarUi.Fallback>
            </AvatarUi.Root>
            {selectedTeam.label}
            <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </ButtonUi.Button>
        </PopoverUi.Trigger>
        <PopoverUi.Content className="w-[200px] p-0">
          <CommandUi.Root>
            <CommandUi.List>
              <CommandUi.Input placeholder="Search team..." />
              <CommandUi.Empty>No team found.</CommandUi.Empty>
              {groups.map((group) => (
                <CommandUi.Group key={group.label} heading={group.label}>
                  {group.teams.map((team) => (
                    <CommandUi.Item
                      key={team.value}
                      onSelect={() => {
                        setSelectedTeam(team)
                        setOpen(false)
                      }}
                      className="text-sm"
                    >
                      <AvatarUi.Root className="mr-2 h-5 w-5">
                        <AvatarUi.Image
                          src={`https://avatar.vercel.sh/${team.value}.png`}
                          alt={team.label}
                          className="grayscale"
                        />
                        <AvatarUi.Fallback>SC</AvatarUi.Fallback>
                      </AvatarUi.Root>
                      {team.label}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          selectedTeam.value === team.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandUi.Item>
                  ))}
                </CommandUi.Group>
              ))}
            </CommandUi.List>
            <CommandUi.Separator />
            <CommandUi.List>
              <CommandUi.Group>
                <DialogUi.Trigger asChild>
                  <CommandUi.List
                    onSelect={() => {
                      setOpen(false)
                      setShowNewTeamDialog(true)
                    }}
                  >
                    <PlusCircledIcon className="mr-2 h-5 w-5" />
                    Create Team
                  </CommandUi.List>
                </DialogUi.Trigger>
              </CommandUi.Group>
            </CommandUi.List>
          </CommandUi.Root>
        </PopoverUi.Content>
      </PopoverUi.Root>
      <DialogUi.Content>
        <DialogUi.Header>
          <DialogUi.Title>Create team</DialogUi.Title>
          <DialogUi.Description>
            Add a new team to manage products and customers.
          </DialogUi.Description>
        </DialogUi.Header>
        <div>
          <div className="space-y-4 py-2 pb-4">
            <div className="space-y-2">
              <LabelUi htmlFor="name">Team name</LabelUi>
              <InputUi id="name" placeholder="Acme Inc." />
            </div>
            <div className="space-y-2">
              <LabelUi htmlFor="plan">Subscription plan</LabelUi>
              <SelectUi.Root>
                <SelectUi.Trigger>
                  <SelectUi.Value placeholder="Select a plan" />
                </SelectUi.Trigger>
                <SelectUi.Content>
                  <SelectUi.Item value="free">
                    <span className="font-medium">Free</span> -{" "}
                    <span className="text-muted-foreground">
                      Trial for two weeks
                    </span>
                  </SelectUi.Item>
                  <SelectUi.Item value="pro">
                    <span className="font-medium">Pro</span> -{" "}
                    <span className="text-muted-foreground">
                      $9/month per user
                    </span>
                  </SelectUi.Item>
                </SelectUi.Content>
              </SelectUi.Root>
            </div>
          </div>
        </div>
        <DialogUi.Footer>
          <ButtonUi.Button
            variant="outline"
            onClick={() => setShowNewTeamDialog(false)}
          >
            Cancel
          </ButtonUi.Button>
          <ButtonUi.Button type="submit">Continue</ButtonUi.Button>
        </DialogUi.Footer>
      </DialogUi.Content>
    </DialogUi.Root>
  )
}
