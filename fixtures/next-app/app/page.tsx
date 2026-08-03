// NO "use client" here on purpose — this file is a Server Component, and it is
// the whole point of the fixture. Anything imported below is evaluated in the
// `react-server` condition, so a module missing its own "use client" fails the
// build right here instead of in a consumer's app.
import {
  // Server-safe (Bảng B1) — must render on the server without a directive.
  Button,
  Typography,
  List,
  ListItem,
  // Bảng B2 — these wrappers carry NO directive; they rely on the Radix
  // package shipping its own. Node's `--conditions=react-server` probe cannot
  // verify that (it ignores directives), so this fixture is the only proof.
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  PopoverRoot,
  PopoverTrigger,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  OverflowMenu,
  OverflowMenuTrigger,
  OverflowMenuContent,
  OverflowMenuItem,
  // Bảng A2 — same contract as B2 (the Radix package owns the boundary), so
  // these are RENDERED, not just referenced: a directive-less wrapper only
  // proves itself once the server actually walks its JSX.
  Avatar,
  AvatarGroup,
  Lnb,
  LnbHeader,
  LnbLogo,
  LnbMenu,
  LnbItem,
  LnbFooter,
  LnbUser,
  Modal,
  Progress,
  RadioGroup,
  Radio,
  ScrollArea,
  Slider,
  Toggle,
  // I-27 — `Select` is a client module reached through a barrel. Rendering it
  // (not just referencing it) is what makes the barrel's own export shape
  // observable: with `export *` the whole barrel turns client and drags the
  // rest of the library across the boundary. See the byte budget in
  // scripts/check-rsc.ts.
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  // Bảng A1 + A3 — client modules that stay client. Importing them from a
  // Server Component is legal; what must not happen is their client-only APIs
  // running on the server.
  Accordion,
  BottomSheet,
  Breadcrumb,
  Carousel,
  Dialog,
  Popup,
  Rating,
  SidebarGroup,
  Stepper,
} from '@echoit/itui.css';

// Referenced (not rendered) so the modules cannot be tree-shaken away: their
// public APIs need props this fixture has no business guessing, and each one
// owns state that only exists on the client. Module evaluation is still what
// catches a missing directive at module scope.
const clientModules = {
  Accordion,
  BottomSheet,
  Breadcrumb,
  Carousel,
  Dialog,
  // Popup keeps its directive on purpose: it passes a locally-defined
  // `onChange` arrow down to `Checkbox`, which is Bảng A3, not A2.
  Popup,
  Rating,
  SidebarGroup,
  Stepper,
};

export default function Page() {
  return (
    <main>
      <Typography variant="heading-2xl">RSC fixture</Typography>

      <Button>server-rendered button</Button>

      <List>
        <ListItem>server-safe list item</ListItem>
      </List>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>trigger</TooltipTrigger>
          <TooltipContent>content</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Tabs defaultValue="one">
        <TabsList>
          <TabsTrigger value="one">one</TabsTrigger>
        </TabsList>
        <TabsContent value="one">tab content</TabsContent>
      </Tabs>

      <PopoverRoot>
        <PopoverTrigger>popover</PopoverTrigger>
      </PopoverRoot>

      <DropdownMenu>
        <DropdownMenuTrigger>dropdown</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <OverflowMenu>
        <OverflowMenuTrigger>overflow</OverflowMenuTrigger>
        <OverflowMenuContent>
          <OverflowMenuItem>item</OverflowMenuItem>
        </OverflowMenuContent>
      </OverflowMenu>

      {/*
        Bảng A2 rendered from the server. No prop here is a function: a Server
        Component cannot hand one to a Client Component, and a display-only
        render is exactly the case that makes these wrappers worth un-marking.
      */}
      <section>
        <Typography variant="heading-xl">Bảng A2</Typography>

        <Avatar size="md" alt="ITUI" backgroundColor="brand" />
        <AvatarGroup count={3} size="md">
          <Avatar size="md" alt="A" backgroundColor="brand" />
          <Avatar size="md" alt="B" backgroundColor="brand" />
        </AvatarGroup>

        <Lnb>
          <LnbHeader>
            <LnbLogo>itui</LnbLogo>
          </LnbHeader>
          <LnbMenu>
            <LnbItem label="menu item" active />
            <LnbItem label="sub item" indented />
          </LnbMenu>
          <LnbFooter>
            <LnbUser name="Server" email="rsc@example.com" />
          </LnbFooter>
        </Lnb>

        <Modal defaultOpen={false} title="modal title" trigger={null}>
          modal body
        </Modal>

        <Progress value={42} />
        <Progress variant="circular" value={42} status="active" />

        <RadioGroup defaultValue="one">
          <Radio value="one">one</Radio>
          <Radio value="two" size="sm">
            two
          </Radio>
        </RadioGroup>

        <ScrollArea orientation="both" className="h-20 w-40">
          scrollable content
        </ScrollArea>

        <Slider defaultValue={[40]} min={0} max={100} />

        <Toggle defaultChecked aria-label="toggle" />
        <Toggle size="sm" aria-label="small toggle" />
      </section>

      {/*
        I-27 — rendered, not referenced. `defaultValue` keeps it uncontrolled so
        no function crosses the boundary, which a Server Component could not do
        anyway.
      */}
      <section>
        <Typography variant="heading-xl">I-27</Typography>

        <Select defaultValue="one">
          <SelectTrigger label="barrel export shape">
            <SelectValue placeholder="pick one" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="one">one</SelectItem>
            <SelectItem value="two">two</SelectItem>
          </SelectContent>
        </Select>
      </section>

      <p>{Object.keys(clientModules).length} client modules loaded</p>
    </main>
  );
}
