import {
  NavigationMenu as RadixNavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@radix-ui/react-navigation-menu";
import { cn } from "@/lib/utils";

type NavigationMenuProps = React.ComponentPropsWithoutRef<typeof RadixNavigationMenu>;

export function NavigationMenu({
  className,
  ...props
}: NavigationMenuProps) {
  return (
    <RadixNavigationMenu className={cn("relative", className)} {...props}>
      <NavigationMenuList>
        {["Work", "Services", "Process", "About", "Contact"].map((item) => (
          <NavigationMenuItem key={item}>
            <NavigationMenuTrigger className="rounded-sm px-3 py-2 text-sm font-medium text-[#cccbcb] transition-colors hover:text-ivory [text-decoration:none]">
              {item}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="w-[200px] rounded-md border border-[#1a1b19] bg-[#10110f] p-3">
                <p className="text-xs font-medium text-[#9B8468] uppercase tracking-wider">
                  {item}
                </p>
                <ul className="mt-2 space-y-1">
                  <li>
                    <NavigationMenuLink asChild>
                      <a
                        href="#"
                        className="block rounded-sm px-3 py-2 text-sm text-[#d5d3c8] hover:bg-[rgba(255,255,255,0.06)]"
                      >
                        Landing page
                      </a>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </RadixNavigationMenu>
  );
}


