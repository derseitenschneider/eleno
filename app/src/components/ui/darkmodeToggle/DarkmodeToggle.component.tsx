import { HiOutlineMoon, HiOutlineSun } from "react-icons/hi2";
// import * as Switch from "@radix-ui/react-switch";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import "./darkmodeToggle.style.scss";
import { useDarkMode } from "../../../services/context/DarkModeContext";
import { cn } from "@/lib/utils";

export default function DarkmodeToggle() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <form className="">
      <SwitchPrimitives.Root
        className={cn(
          "peer inline-flex h-[25px] w-[42px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-background50 data-[state=unchecked]:bg-background200",
        )}
        onCheckedChange={toggleDarkMode}
        checked={isDarkMode}
      >
        <SwitchPrimitives.Thumb
          className={cn(
            "text-white pointer-events-none flex items-center justify-center  h-5 w-5 rounded-full bg-primary shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
          )}
        >
          {isDarkMode ? <HiOutlineMoon /> : <HiOutlineSun />}
        </SwitchPrimitives.Thumb>
      </SwitchPrimitives.Root>
    </form>
  );
}
