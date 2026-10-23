// NO "use client" here on purpose — like `app/page.tsx`, this is a Server
// Component. Where that page renders a curated set and is the surface the
// client-bundle assertions measure, this one exists for coverage: it imports
// *every* value export of the barrel and renders every one that a server can
// render (I-15/I-16).
//
// Why rendering matters and importing does not: a module-scope client API
// (`createContext`) breaks on import, but a handler on a DOM prop only breaks
// once the server walks the JSX. `Tag` shipped broken for a release while this
// fixture referenced it, because referencing exercises module scope alone.
//
// Exports this page cannot render are listed in `referenced` at the bottom,
// each with the reason. That list is the fixture's honest coverage gap.
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  AepIcon,
  AiIcon,
  Avatar,
  AvatarGroup,
  AviIcon,
  Backdrop,
  Badge,
  BaseDate,
  BaseDateButton,
  baseDateRangeEdgeFromModifiers,
  baseDateStateFromModifiers,
  BlendIcon,
  BottomNavigation,
  BottomNavigationItem,
  BottomNavigationItemV2,
  BottomNavigationV2,
  BottomSheet,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbSeparator,
  Bubble,
  Button,
  C4dIcon,
  Calendar,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardWithAction,
  CardWithImage,
  Carousel,
  CarouselContent,
  CarouselIndicator,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CdrIcon,
  Checkbox,
  Chip,
  colorBgClass,
  COLOR_HEX,
  COLOR_RAMPS,
  colorName,
  Colors,
  CssIcon,
  CsvIcon,
  DateFooter,
  DateHeader,
  DatePicker,
  DateWheelPicker,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  Divider,
  DmgIcon,
  DocIcon,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  Empty,
  ExeIcon,
  FigIcon,
  FileIcon,
  FileType,
  FloatingButton,
  GifIcon,
  Gnb,
  GnbMenu,
  GnbMenuItem,
  Grid,
  GridItem,
  GridOverlay,
  HtmlIcon,
  IcoIcon,
  Input,
  InputDate,
  InputDropdown,
  InputDropdownItem,
  InputDropdownSub,
  InputFileUpload,
  InputFileUploadItem,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputPhoneNumber,
  InputSearch,
  InputTag,
  InputText,
  InputTextarea,
  InputTextFormatting,
  InputV2,
  InputWithButton,
  JavaIcon,
  JpegIcon,
  JpgIcon,
  JsIcon,
  JsonIcon,
  Label,
  List,
  ListItem,
  Lnb,
  LnbFooter,
  LnbGroup,
  LnbGroupContent,
  LnbGroupTrigger,
  LnbHeader,
  LnbItem,
  LnbLogo,
  LnbMenu,
  LnbToggle,
  LnbUser,
  Modal,
  MovIcon,
  Mp3Icon,
  Mp4Icon,
  MpgIcon,
  OverflowMenu,
  OverflowMenuContent,
  OverflowMenuItem,
  OverflowMenuPortal,
  OverflowMenuTrigger,
  Pagination,
  PdfIcon,
  PngIcon,
  Popover,
  PopoverAnchor,
  PopoverClose,
  PopoverContent,
  PopoverGroup,
  PopoverHeader,
  PopoverItem,
  PopoverMenu,
  PopoverPanel,
  PopoverPortal,
  PopoverRoot,
  PopoverSeparator,
  PopoverTrigger,
  Popup,
  PptIcon,
  PricingCard,
  Progress,
  PsdIcon,
  Radio,
  RadioGroup,
  Radius,
  RADIUS_PX,
  radiusClass,
  RarIcon,
  Rating,
  RatingStar,
  ResourceModal,
  ScrollArea,
  ScrollAreaCorner,
  ScrollAreaRoot,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  Shadow,
  SHADOW_BLUR,
  SHADOW_OFFSET,
  shadowClass,
  Sidebar,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
  SidebarMenu,
  Skeleton,
  SkeletonText,
  SktIcon,
  Slider,
  snackbar,
  Snackbar,
  SnackbarAction,
  SnackbarDescription,
  SnackbarTitle,
  SnackbarToaster,
  SNACKBAR_TOASTER_ID,
  Spacing,
  SPACING_PX,
  spacingClass,
  Spinner,
  Stepper,
  StepperIndicator,
  StepperItem,
  SvgIcon,
  SyncProgressBar,
  Tab,
  TabContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TabList,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  TabTrigger,
  Tag,
  TiffIcon,
  toast,
  Toast,
  Toaster,
  Toggle,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  TopNavigation,
  TopNavigationV2,
  TxtIcon,
  Typography,
  TYPOGRAPHY_SPEC,
  typographyClass,
  typographyWeightClass,
  useCarousel,
  WavIcon,
  WebpIcon,
  WheelPicker,
  XlsIcon,
  ZipIcon,
} from '@echoit/itui.css';

/** The 37 generated file-type glyphs — one shape, so one loop renders them all. */
const FILE_TYPE_ICONS = [
  AepIcon,
  AiIcon,
  AviIcon,
  BlendIcon,
  C4dIcon,
  CdrIcon,
  CssIcon,
  CsvIcon,
  DmgIcon,
  DocIcon,
  ExeIcon,
  FigIcon,
  GifIcon,
  HtmlIcon,
  IcoIcon,
  JavaIcon,
  JpegIcon,
  JpgIcon,
  JsIcon,
  JsonIcon,
  MovIcon,
  Mp3Icon,
  Mp4Icon,
  MpgIcon,
  PdfIcon,
  PngIcon,
  PptIcon,
  PsdIcon,
  RarIcon,
  SktIcon,
  SvgIcon,
  TiffIcon,
  TxtIcon,
  WavIcon,
  WebpIcon,
  XlsIcon,
  ZipIcon,
];

/**
 * Exports no Server Component can render, kept referenced so their modules are
 * still evaluated. Every entry is here for one of two reasons:
 *
 *   - it is not a component (a token map, a class helper, a hook, an imperative
 *     `toast()` / `snackbar()` caller), or
 *   - its required props include a function, which is exactly what a Server
 *     Component may not pass — `ResourceModal` needs `onClose`.
 */
const referenced = {
  COLOR_HEX,
  COLOR_RAMPS,
  RADIUS_PX,
  SHADOW_BLUR,
  SHADOW_OFFSET,
  SNACKBAR_TOASTER_ID,
  SPACING_PX,
  TYPOGRAPHY_SPEC,
  baseDateRangeEdgeFromModifiers,
  baseDateStateFromModifiers,
  colorBgClass,
  colorName,
  radiusClass,
  shadowClass,
  snackbar,
  spacingClass,
  toast,
  typographyClass,
  typographyWeightClass,
  useCarousel,
  ResourceModal,
};

export default function AllExportsPage() {
  return (
    <main>
      <Typography variant="heading-2xl">Every export, server-rendered</Typography>

      {/* ── Primitives ─────────────────────────────────────────────────── */}
      <section>
        <Button>button</Button>
        <FloatingButton>+</FloatingButton>
        <Badge>badge</Badge>
        <Label>label</Label>
        <Divider />
        <Spinner />
        <Skeleton className="h-4 w-24" />
        <SkeletonText />
        <Bubble>bubble</Bubble>
        <Backdrop position="absolute" />
        <Tag>tag</Tag>
        <Chip>chip</Chip>
        <Checkbox label="checkbox" />
        <Toggle aria-label="toggle" />
        <Slider defaultValue={[40]} min={0} max={100} />
        <Progress value={42} />
        <Progress variant="circular" value={42} status="active" />
        <SyncProgressBar value={42} />
        <Pagination page={2} total={9} />
        <Rating value={3} />
        <RatingStar />
        <Avatar size="md" alt="ITUI" backgroundColor="brand" />
        <AvatarGroup count={2} size="md">
          <Avatar size="md" alt="A" backgroundColor="brand" />
          <Avatar size="md" alt="B" backgroundColor="brand" />
        </AvatarGroup>
        <Empty />
        <FileType />
        <FileIcon iconType="pdf" />
        {FILE_TYPE_ICONS.map((Icon, index) => (
          <Icon key={index} width={20} height={20} />
        ))}
      </section>

      {/* ── Token primitives ───────────────────────────────────────────── */}
      <section>
        <Colors />
        <Radius />
        <Shadow />
        <Spacing />
        <Typography variant="body-md">typography</Typography>
        <Grid>
          <GridItem>grid item</GridItem>
        </Grid>
        <GridOverlay />
      </section>

      {/* ── Layout & navigation ────────────────────────────────────────── */}
      <section>
        <List>
          <ListItem>list item</ListItem>
        </List>

        <Breadcrumb>
          <BreadcrumbItem>home</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>here</BreadcrumbItem>
        </Breadcrumb>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>head</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow selected>
              <TableCell>cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {/* Gnb takes its slots as props, not children. */}
        <Gnb
          logo="itui"
          menu={
            <GnbMenu>
              <GnbMenuItem>gnb item</GnbMenuItem>
            </GnbMenu>
          }
        />

        <TopNavigation title="top" />
        <BottomNavigation>
          <BottomNavigationItem label="one" />
        </BottomNavigation>

        <TopNavigationV2 title="top v2" />
        <BottomNavigationV2>
          <BottomNavigationItemV2 label="one" />
        </BottomNavigationV2>

        <Lnb>
          <LnbHeader>
            <LnbLogo>itui</LnbLogo>
            <LnbToggle />
          </LnbHeader>
          <LnbMenu>
            <LnbItem label="menu item" active />
            <LnbGroup>
              <LnbGroupTrigger>group</LnbGroupTrigger>
              <LnbGroupContent>
                <LnbItem label="sub item" indented />
              </LnbGroupContent>
            </LnbGroup>
          </LnbMenu>
          <LnbFooter>
            <LnbUser name="Server" email="rsc@example.com" />
          </LnbFooter>
        </Lnb>

        <Sidebar>
          <SidebarHeader>sidebar</SidebarHeader>
          <SidebarMenu>
            <SidebarItem>item</SidebarItem>
          </SidebarMenu>
          <SidebarGroup label="group">
            <SidebarItem>grouped item</SidebarItem>
          </SidebarGroup>
          <SidebarFooter>footer</SidebarFooter>
        </Sidebar>

        <ScrollArea orientation="both" className="h-20 w-40">
          scrollable content
        </ScrollArea>
        <ScrollAreaRoot className="h-20 w-40">
          <ScrollAreaViewport>viewport</ScrollAreaViewport>
          <ScrollAreaScrollbar orientation="vertical">
            <ScrollAreaThumb />
          </ScrollAreaScrollbar>
          <ScrollAreaCorner />
        </ScrollAreaRoot>
      </section>

      {/* ── Cards ──────────────────────────────────────────────────────── */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle>card title</CardTitle>
            <CardDescription>card description</CardDescription>
            <CardAction>
              <Button size="sm">action</Button>
            </CardAction>
          </CardHeader>
          <CardContent>card content</CardContent>
          <CardFooter>card footer</CardFooter>
        </Card>

        <CardWithImage title="with image" />
        <CardWithAction title="with action" />
        <PricingCard
          badge="Most popular"
          title="Pro"
          price="$9"
          features={[{ label: 'one' }, { label: 'two', included: false }]}
        />
      </section>

      {/* ── Disclosure & steps ─────────────────────────────────────────── */}
      <section>
        <Accordion type="single" collapsible>
          <AccordionItem value="one">
            <AccordionTrigger>accordion trigger</AccordionTrigger>
            <AccordionContent>accordion content</AccordionContent>
          </AccordionItem>
        </Accordion>

        <Stepper current={1}>
          <StepperItem title="step one" description="first">
            <StepperIndicator step={1} status="current" />
          </StepperItem>
          <StepperItem title="step two" />
        </Stepper>

        <Tab defaultValue="one">
          <TabList>
            <TabTrigger value="one">tab one</TabTrigger>
          </TabList>
          <TabContent value="one">tab content</TabContent>
        </Tab>

        {/* The legacy family the README steers away from — still exported, so
            still the fixture's business. */}
        <Tabs defaultValue="one">
          <TabsList>
            <TabsTrigger value="one">tabs one</TabsTrigger>
          </TabsList>
          <TabsContent value="one">tabs content</TabsContent>
        </Tabs>

        <Carousel>
          <CarouselContent>
            <CarouselItem>slide</CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
          <CarouselIndicator />
        </Carousel>
      </section>

      {/* ── Overlays ───────────────────────────────────────────────────── */}
      <section>
        <Dialog>
          <DialogTrigger>open dialog</DialogTrigger>
          <DialogPortal>
            <DialogOverlay />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>dialog title</DialogTitle>
                <DialogDescription>dialog description</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose>close</DialogClose>
              </DialogFooter>
            </DialogContent>
          </DialogPortal>
        </Dialog>

        <Modal defaultOpen={false} title="modal title" trigger={null}>
          modal body
        </Modal>

        <Popup title="popup title">popup body</Popup>

        <BottomSheet title="sheet title">sheet body</BottomSheet>

        <Popover>
          <PopoverAnchor />
          <PopoverTrigger>open popover</PopoverTrigger>
          <PopoverPortal>
            <PopoverContent>
              <PopoverHeader>popover header</PopoverHeader>
              <PopoverMenu>
                <PopoverGroup>
                  <PopoverItem>item</PopoverItem>
                </PopoverGroup>
                <PopoverSeparator />
                <PopoverItem asMenuItem>menu item</PopoverItem>
              </PopoverMenu>
              <PopoverClose>close</PopoverClose>
            </PopoverContent>
          </PopoverPortal>
        </Popover>

        {/* The deprecated alias still resolves to the root. */}
        <PopoverRoot>
          <PopoverTrigger>alias</PopoverTrigger>
        </PopoverRoot>

        {/* The panel surface on its own — no popover machinery. */}
        <PopoverPanel>panel</PopoverPanel>

        <DropdownMenu>
          <DropdownMenuTrigger>open menu</DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuContent>
              <DropdownMenuLabel>label</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  item
                  <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuCheckboxItem checked>checkbox</DropdownMenuCheckboxItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value="one">
                <DropdownMenuRadioItem value="one">radio</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>more</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>sub item</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenu>

        <OverflowMenu>
          <OverflowMenuTrigger>overflow</OverflowMenuTrigger>
          <OverflowMenuPortal>
            <OverflowMenuContent>
              <OverflowMenuItem>item</OverflowMenuItem>
            </OverflowMenuContent>
          </OverflowMenuPortal>
        </OverflowMenu>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>tooltip trigger</TooltipTrigger>
            <TooltipContent>tooltip content</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Both toasters mount their own portal root; neither takes a handler. */}
        <Toaster />
        <SnackbarToaster />
        <Toast>toast body</Toast>
        <Snackbar action={<SnackbarAction>undo</SnackbarAction>}>
          <SnackbarTitle>snackbar title</SnackbarTitle>
          <SnackbarDescription>snackbar description</SnackbarDescription>
        </Snackbar>
      </section>

      {/* ── Fields ─────────────────────────────────────────────────────── */}
      <section>
        <Select defaultValue="one">
          <SelectTrigger label="select label" placeholder="pick one" />
          <SelectContent>
            <SelectScrollUpButton />
            <SelectGroup>
              <SelectLabel>group</SelectLabel>
              <SelectItem value="one">one</SelectItem>
              <SelectSeparator />
              <SelectItem value="two">
                <SelectValue />
                two
              </SelectItem>
            </SelectGroup>
            <SelectScrollDownButton />
          </SelectContent>
        </Select>

        {/* Error path: the wiring I-17 added only exists when `error` is set. */}
        <Select>
          <SelectTrigger
            label="with error"
            error="required"
            placeholder="pick one"
          />
          <SelectContent>
            <SelectItem value="one">one</SelectItem>
          </SelectContent>
        </Select>

        <RadioGroup defaultValue="one">
          <Radio value="one">one</Radio>
          <Radio value="two" size="sm">
            two
          </Radio>
        </RadioGroup>

        <InputV2 label="input v2" placeholder="…" />
        <InputText label="input text" placeholder="…" />
        <InputTextarea label="textarea" placeholder="…" />
        <InputSearch label="search" placeholder="…" />
        <InputTag label="tags" />
        <InputDate label="date" />
        <InputPhoneNumber label="phone" />
        <InputWithButton label="with button" buttonLabel="send" />
        <InputTextFormatting label="rich text" />
        <InputFileUpload
          label="upload"
          files={[{ id: '1', name: 'file.pdf', status: 'done' }]}
        />
        <InputFileUploadItem name="file.pdf" />
        <InputDropdown label="dropdown">
          <InputDropdownItem value="one">one</InputDropdownItem>
          <InputDropdownSub label="more">
            <InputDropdownItem value="two">two</InputDropdownItem>
          </InputDropdownSub>
        </InputDropdown>

        {/* The deprecated single-line input, still exported. */}
        <Input placeholder="legacy input" />

        <InputGroup>
          <InputGroupAddon>
            <InputGroupText>@</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput placeholder="handle" />
          <InputGroupButton>go</InputGroupButton>
        </InputGroup>
      </section>

      {/* ── Date & time ────────────────────────────────────────────────── */}
      <section>
        <Calendar />
        <DatePicker />
        <DateHeader>caption</DateHeader>
        <DateFooter />
        <BaseDate>1</BaseDate>
        <BaseDateButton>2</BaseDateButton>
        <WheelPicker
          columns={[
            {
              key: 'hour',
              options: [
                { value: '09', label: '09' },
                { value: '10', label: '10' },
              ],
            },
          ]}
          value={{ hour: '09' }}
        />
        <DateWheelPicker value={new Date('2026-01-01T00:00:00Z')} />
      </section>

      <p>{Object.keys(referenced).length} non-renderable exports referenced</p>
    </main>
  );
}
