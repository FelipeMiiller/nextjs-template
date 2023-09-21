import { InputUi } from "@/components/ui"

export function Search() {
  return (
    <div>
      <InputUi
        type="search"
        placeholder="Search..."
        className="md:w-[100px] lg:w-[300px]"
      />
    </div>
  )
}
