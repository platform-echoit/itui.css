# Focus Visible — Kế hoạch triển khai

Kế hoạch thực thi cho các phát hiện trong [focus-visible-audit.md](focus-visible-audit.md). Mọi mã
task (`C1`, `H4`, `M9`, …) giữ nguyên mã của bản audit, nên hai tài liệu đọc song song được.

- Ngày: 2026-08-12
- Trạng thái: **mới là kế hoạch — chưa sửa dòng code nào**
- Phạm vi: **chỉ `packages/ui`** (`@echoit/itui.css` v1.1.0) và story trong `apps/storybook`.
  Không đụng vào `apps/web`.
- Quy mô: 5 pull request, 4 cái chỉ thêm (additive), 1 cái đổi giao diện có chủ đích

---

## 0. Cách đọc tài liệu này

Mỗi task ghi rõ: file và dòng sẽ sửa, nội dung sửa, cách verify, và rủi ro kèm theo. Task được gom
theo PR; thứ tự PR là thứ tự **phụ thuộc**, không phải thứ tự ưu tiên — PR 0 ship phần token mà PR 2
và PR 3 cần.

Hai ràng buộc kỹ thuật cần nhớ suốt kế hoạch:

- **`packages/ui` là git submodule.** Mọi PR ở đây là commit trong submodule; repo cha chỉ cần bump
  con trỏ submodule khi muốn lấy bản mới.
- **CSS đến Storybook qua `dist`.** Một `@utility` mới trong `src/styles/global.css` sẽ vô hình cho
  tới khi `tsup` build lại `dist/index.css`. PR nào đụng `global.css` cũng phải build xong mới QA
  được, và output build phải đi kèm PR đó.

---

## 1. Phạm vi, và một phụ thuộc nằm ngoài phạm vi

Kế hoạch này chỉ sửa trong `packages/ui`. Có đúng một phát hiện của bản audit không nằm trong phạm
vi đó, và nó cần được ghi nhận rõ vì nó quyết định người dùng cuối có thấy kết quả hay không.

### C1 — `apps/web` đang tắt outline toàn cục (bàn giao, không làm ở đây)

[apps/web/app/globals.css:443](../../apps/web/app/globals.css#L443):

```css
*:focus {
  outline: none !important;
}
```

Vì `:focus-visible` là tập con của `:focus`, và một khai báo `!important` của author thắng mọi khai
báo thường bất kể specificity, rule này **xoá chỉ báo focus của toàn bộ ~30 component** vẽ qua
`focus-ring`, kể cả outline mặc định của trình duyệt.

**Hệ quả cho kế hoạch này:** mọi thứ PR 0–PR 4 làm đều đúng và verify được **trong Storybook**,
nhưng **không hiển thị trong `apps/web`** cho tới khi rule trên được thu hẹp phạm vi. Đây không phải
bug của library — không có thay đổi nào trong `packages/ui` sửa được nó, kể cả `!important` (sẽ là
cuộc đua leo thang `!important` giữa hai package).

**Nội dung bàn giao cho người sở hữu `apps/web`:**

- Rule nằm giữa một loạt override của BlockNote, dấu hiệu khá rõ là nó được viết để tắt outline của
  editor rồi không ai thu hẹp lại. `apps/web/styles/blocknote.css` vốn đã scope hai rule
  `outline: none !important` của nó vào `.ProseMirror [contenteditable="false"]` và
  `.bn-react-node-view-renderer …` — tiền lệ scope đã có sẵn trong chính codebase đó.
- Hướng sửa đề xuất: thu hẹp về subtree của editor, ví dụ
  `.bn-container *:focus, .ProseMirror:focus { outline: none !important; }`.
- Verify: tab qua toàn app trước và sau khi sửa; kiểm riêng BlockNote editor, slash menu, formatting
  toolbar và các custom block — đó chính là thứ rule này đang bảo vệ.
- Rollback: khôi phục đúng một rule đó.

Nên mở ticket riêng cho `apps/web` và tham chiếu tới mục này. Nếu ticket đó không bao giờ được làm,
kế hoạch dưới đây vẫn đáng làm: nó sửa library cho mọi consumer khác và cho chính Storybook, nhưng
cần nói thẳng với stakeholder rằng sản phẩm web sẽ chưa thấy khác biệt.

---

## 2. Các quyết định cần chốt trước khi code

D1 đã được chốt; ba câu còn lại quyết định code sẽ viết ra sao. Mỗi câu có khuyến nghị, nhưng không
nên coi là đã chốt khi chưa có xác nhận.

### D1 — Width của ring: **đã chốt `1px`**

Không còn là câu hỏi mở. **Width của mọi ring và outline trong library luôn là `1px`** — một giá trị
duy nhất, đọc từ `--itui-focus-ring-width`, và không component hay variant nào được tự đặt width
riêng. `0.5px` hiện tại là sub-pixel: ở DPR 1 Chrome vẽ mờ, Firefox snap lên 1px, chỉ màn 2× mới ra
đúng một device pixel. `1px` bỏ hẳn sự bất định đó mà vẫn giữ đúng cảm giác hairline của bản 1.1.

Hai hệ quả cần ghi nhận — để biết, không phải để bàn lại:

- **1px vẫn dưới con số 2px mà WCAG 2.2 mong đợi** (bản audit gọi mục này là SC 2.4.11). Nó pass SC
  2.4.7 của WCAG 2.1 và crisp ở mọi DPR, nhưng sản phẩm nào cần đúng 2px thì đó là quyết định của
  consumer: `:root { --itui-focus-ring-width: 2px }`. Token vẫn là escape hatch; chỉ default đổi.
- **Họ field vốn đã báo focus bằng border 1px**, nên ở width 1px hai idiom cùng cường độ và mâu thuẫn
  "thickening the ring leaves fields behind" của M10 tự hết. Phần 3.2 vẫn phải làm, nhưng lý do bây
  giờ là H1 (field đang lỗi mất hẳn chỉ báo focus) và việc field không đọc token — không còn là lệch
  độ dày.

**Không cần:** design sign-off cho width. Màu ring (D2) vẫn là câu hỏi mở.

### D2 — Có làm đậm màu ring không?

`--color-brand` `#009ce0` đạt **3.07:1** trên nền trắng (pass) nhưng chỉ **2.82:1** trên `#f5f5f5` —
đúng màu nền hover của row trong `Lnb`, `List` và `PopoverItem`. Nghĩa là một row vừa hover vừa focus
thì về mặt kỹ thuật đang dưới chuẩn SC 1.4.11.

**Khuyến nghị:** giữ `#009ce0` và ghi nhận khoảng hở này. Đổi sang `--color-brand-sky-600` `#008ecc`
(3.6:1 trên `#f5f5f5`) sẽ đổi màu focus của toàn bộ component chỉ để xử lý một trạng thái chỉ xảy ra
khi hover và focus đồng thời. Nếu bắt buộc phải pass SC 1.4.11 tuyệt đối thì lấy màu đậm — token
thêm ở PR 0 khiến đây chỉ là sửa một dòng, chọn hướng nào cũng được.

**Cần:** xác nhận dự án có bắt buộc pass SC 1.4.11 tuyệt đối hay không.

### D3 — `SelectTrigger` có bắt đầu forward `disabled` không?

[ACCESSIBILITY.md](ACCESSIBILITY.md) đã ghi nhận `disabled` không được forward xuống button bên
dưới, nên một select bị disable vẫn focus được mà chẳng hiện gì (H2). Forward nó là cách sửa đúng, và
đây là **thay đổi hành vi**: trigger sẽ không còn là tab stop.

**Khuyến nghị:** forward. `pointer-events-none` vốn đã chặn thao tác chuột, nên giữ nó tab tới được
không phục vụ ai cả.

**Cần:** xác nhận không có chỗ nào dùng `Select` mà đang dựa vào việc tab được vào trigger disabled.

### D4 — Sửa `Chip` / `Tag` nested-interactive tới đâu (M4)?

`role="button" tabIndex={0}` mà bên trong lại có `<button>` thật là ARIA sai. Cách sửa triệt để phải
tái cấu trúc component; cách rẻ là document lại ràng buộc.

**Khuyến nghị:** làm cách rẻ trước (document rằng `onClick` và `onClose` không nên dùng chung, bỏ
class vô nghĩa ở root không interactive — L1), tái cấu trúc sau ở ticket riêng. Mức độ ảnh hưởng
người dùng thấp: cả hai ring đều là hairline, và tình trạng rối tab order chỉ xảy ra với một tổ hợp
props có thể không nơi nào dùng.

**Cần:** grep các consumer xem có chip nào truyền đồng thời `onClick` và `onClose` không.

---

## 3. PR 0 — Nền móng: token và utility inset

**Không đổi giao diện.** Chỉ ship phần từ vựng mà các PR sau cần. Width vẫn để `0.5px` ở PR này —
cố ý: nó sang `1px` ở PR 3, tách riêng để PR 0 verify được bằng đúng một tiêu chí "trông y hệt trước".

### 0.1 — Thêm ba token

[src/styles/global.css:66](src/styles/global.css#L66), trong block `:root` sẵn có, ngay cạnh
`--itui-focus-ring-width`:

```css
/* Left at 0.5px in this PR on purpose — PR 3 moves it to the final 1px. */
--itui-focus-ring-width: 0.5px;

/* Colour and offset were hard-coded in the utility. They are tokens now so the
   inset variant below can share them, and so darkening the ring for contrast is
   a one-line change rather than an edit in two utilities. */
--itui-focus-ring-color: var(--color-brand);
--itui-focus-ring-offset: 2px;

/* For a control whose ancestor clips (Accordion items, Lnb rows, field slot
   buttons, ScrollArea, Carousel): same indicator, painted inward, so the clip
   region cannot cut it. */
--itui-focus-ring-offset-inset: -2px;
```

`--color-brand` đến từ block `@theme` thường (dòng 190), không phải `@theme inline`, nên custom
property chắc chắn resolve được lúc runtime — cách gián tiếp này an toàn.

### 0.2 — Viết lại `focus-ring`, thêm `focus-ring-inset`

[src/styles/global.css:691](src/styles/global.css#L691):

```css
@utility focus-ring {
  outline: var(--itui-focus-ring-width, 0px) solid var(--itui-focus-ring-color);
  outline-offset: var(--itui-focus-ring-offset);
}

@utility focus-ring-inset {
  outline: var(--itui-focus-ring-width, 0px) solid var(--itui-focus-ring-color);
  outline-offset: var(--itui-focus-ring-offset-inset);
}
```

### 0.3 — Tài liệu

- `TOKENS.md`: bổ sung ba token mới.
- `ACCESSIBILITY.md`: bảng focus-indicator thêm một dòng cho `focus-ring-inset`, và dòng "inside a
  surface" phải bỏ khẳng định "không có gì clip nó" — bản audit đã chứng minh ngược lại với
  `Accordion` và `Lnb`. Thêm một ghi chú ngắn rằng consumer tắt outline toàn cục
  (`*:focus { outline: none !important }`) sẽ vô hiệu hoá toàn bộ chỉ báo của library — đây là chỗ
  duy nhất trong `packages/ui` nói được về C1.
- **Không** sửa tay và **không** chạy prettier lên `API.md`; file này do generator sinh ra. Chạy
  `pnpm docs:api` nếu public surface thay đổi (PR này thì không).

### 0.4 — Hai cái bẫy phải ghi vào mô tả PR

- **`tailwind-merge` không biết các utility này.** `cn('focus-ring', 'focus-ring-inset')` sẽ giữ cả
  hai, và cái thắng là cái đứng sau trong source — thắng do cascade chứ không phải do merge. Không
  bao giờ truyền cả hai; mỗi element chọn một.
- **`dist/index.css` phải được build lại** (`pnpm --filter @echoit/itui.css build`), nếu không
  Storybook sẽ render `focus-ring-inset` như một class rỗng và cả PR trông như không làm gì.

**Verify:** build xong, mở Storybook xác nhận `Button` khi focus trông **y hệt** trước đó (token
width không đổi, nên thấy khác nghĩa là phần viết lại utility sai).

---

## 4. PR 1 — Critical + High: những chỗ không có indicator

Chỉ thêm. Không đổi layout, không đổi hình dáng component ở trạng thái không focus.

| ID  | File                                                                                                                                   | Sửa gì                                                                                                                                                                                                                                                               |
| --- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| C2  | [dialog/dialog.tsx:122](src/components/dialog/dialog.tsx#L122)                                                                         | `focus:outline-hidden` → `focus-visible:focus-ring`. Giống hệt `Popup`, `Chip`, `Tag` — cả ba đều đã làm vậy.                                                                                                                                                        |
| C3  | [calendar/WheelPicker.tsx:145-151](src/components/calendar/WheelPicker.tsx#L145-L151)                                                  | Thêm `focus-visible:focus-ring` cho container `role="listbox"`, và **viết lại comment phía trên `outline-none`** — chính tiền đề sai của nó ("a scroll container, not a DS control") đã tạo ra bug. `overflow-y-auto` của chính container không clip outline của nó. |
| C4  | [overflow-menu/OverflowMenu.tsx:190-194](src/components/overflow-menu/OverflowMenu.tsx#L190-L194)                                      | Giữ `data-[highlighted]:bg-muted` làm nền hover; thêm `focus-visible:focus-ring`.                                                                                                                                                                                    |
| H12 | [dropdown-menu/dropdown-menu.tsx:107](src/components/dropdown-menu/dropdown-menu.tsx#L107)                                             | Cùng dạng: giữ `focus:bg-accent`, thêm `focus-visible:focus-ring`.                                                                                                                                                                                                   |
| M1  | [select/Select.tsx:253](src/components/select/Select.tsx#L253)                                                                         | Cùng dạng: giữ `focus:bg-secondary`, thêm `focus-visible:focus-ring`.                                                                                                                                                                                                |
| H6  | [list/List.tsx:137-145](src/components/list/List.tsx#L137-L145)                                                                        | Thêm `focus-visible:focus-ring` vào `rowClassName`.                                                                                                                                                                                                                  |
| H7  | [sidebar/Sidebar.tsx:195](src/components/sidebar/Sidebar.tsx#L195), [SidebarGroup.tsx:68](src/components/sidebar/SidebarGroup.tsx#L68) | Thêm `focus-visible:focus-ring` cho cả hai row button.                                                                                                                                                                                                               |
| H8  | [popover/PopoverPanel.tsx:216](src/components/popover/PopoverPanel.tsx#L216)                                                           | Thêm `focus-visible:focus-ring`. Ưu tiên cao nhất trong nhóm năm: với `asMenuItem` nó chạy roving tabindex, phím mũi tên là cách duy nhất để di chuyển mà hiện không có gì để nhìn.                                                                                  |
| H9  | [InputSearch.tsx:103](src/components/input/InputSearch.tsx#L103), [InputDate.tsx:196](src/components/input/InputDate.tsx#L196)         | Thêm `focus-visible:focus-ring-inset` — **inset**, vì làn dọc 24px trong shell không chứa nổi outline offset `+2px` (xem PR 2).                                                                                                                                      |
| H10 | [input/InputDropdown.tsx:158](src/components/input/InputDropdown.tsx#L158)                                                             | Thêm `focus-visible:focus-ring` vào `cn()` của row button.                                                                                                                                                                                                           |
| H11 | [rating/Rating.tsx:172-182](src/components/rating/Rating.tsx#L172-L182)                                                                | Chuyển `has-[:focus-visible]:focus-ring` từ `RatingStar` xuống từng `<label>` nửa sao; thêm `rounded-sm` ở đó để giữ hình. Mười radio phải cho ra mười vị trí focus phân biệt được.                                                                                  |
| M2  | [src/styles/global.css:709-713](src/styles/global.css#L709-L713)                                                                       | Thêm `[data-sidebar-item]:focus-within` làm selector thứ hai bên cạnh `:hover`, để rail thu gọn hiện tooltip cho người dùng bàn phím. `Lnb` đã ghép `group-hover` với `group-focus-within` tại [Lnb.tsx:232](src/components/lnb/Lnb.tsx#L232).                       |
| M5  | [breadcrumb/Breadcrumb.tsx:158-163](src/components/breadcrumb/Breadcrumb.tsx#L158-L163)                                                | Thêm `focus-visible:focus-ring` cho link.                                                                                                                                                                                                                            |

**Một lưu ý cho ba họ menu (C4 / H12 / M1).** Radix chuyển focus vào menu item bằng script, kể cả
khi hover chuột. `:focus-visible` vẫn là selector đúng — heuristic của browser sẽ match một
`.focus()` gọi bằng script nếu thao tác gần nhất là bàn phím, và không match nếu là chuột — nhưng
đây đúng là trường hợp heuristic có thể khác nhau giữa các browser. **Verify trên Chrome và Firefox
rằng hover không vẽ ring**; nếu một trong hai vẫn vẽ, lùi về ring gắn với `data-[highlighted]` và
chấp nhận hover với bàn phím trông giống nhau — vẫn không tệ hơn hiện tại.

**Verify:** với mọi dòng ở trên, tab tới element trong Storybook và xác nhận có ring; sau đó click
chuột và xác nhận không có ring.

---

## 5. PR 2 — High + Medium: ring có nhưng bị cắt

Dùng `focus-ring-inset` từ PR 0. Cũng chỉ thêm — outline vẽ vào trong không đổi hình học của box.

| ID  | File                                                                                                                             | Sửa gì                                                                                                                                                                                                                                                                                                                                               |
| --- | -------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| H3  | [accordion/Accordion.tsx:149](src/components/accordion/Accordion.tsx#L149)                                                       | `focus-visible:focus-ring` → `focus-visible:focus-ring-inset` trên `AccordionTrigger`. **Không gỡ `overflow-hidden` của `AccordionItem`** ([:117](src/components/accordion/Accordion.tsx#L117)) — nó đang gánh việc bo góc cho variant `filled` / `outline`. Trigger có `px-5` nên ring vẽ vào trong vẫn đủ chỗ.                                     |
| H4  | [lnb/Lnb.tsx:98](src/components/lnb/Lnb.tsx#L98)                                                                                 | `ROW_BASE`: `focus-visible:focus-ring` → `focus-visible:focus-ring-inset`. Row có `p-2` (8px) nên dải 3px vào trong (offset 2px + width 1px) vẫn nằm trong padding. Sửa một chỗ giải quyết cả hai điểm clip — `overflow-y-auto` của `LnbHeader` (khiến trục _ngang_ cũng thành `auto`) và `overflow-hidden` của `LnbGroupContent`.                   |
| H5  | [lnb/Lnb.tsx:480](src/components/lnb/Lnb.tsx#L480)                                                                               | Đã được H4 xử lý — sub-item dùng chung `ROW_BASE`. Chỉ cần verify.                                                                                                                                                                                                                                                                                   |
| M6  | [carousel/Carousel.tsx:226](src/components/carousel/Carousel.tsx#L226)                                                           | Không sửa component. Ghi vào story của Carousel rằng nội dung focus được trong slide nên dùng `focus-ring-inset`; Embla bắt buộc viewport phải `overflow-hidden`.                                                                                                                                                                                    |
| M7  | [scroll/Scroll.tsx:153](src/components/scroll/Scroll.tsx#L153)                                                                   | Tương tự: document, không tái cấu trúc Radix root.                                                                                                                                                                                                                                                                                                   |
| M8  | [table/Table.tsx:111](src/components/table/Table.tsx#L111)                                                                       | Header sort nằm trong `px-3 py-2` nên đã vừa. Rủi ro thật nằm ở `Button` hoặc `Checkbox` đặt trong `TableCell` ở rìa, và ở mọi cell khi bảng scroll ngang. Verify trước, rồi mới chọn giữa inset ring cho nội dung cell hay padding cho khung.                                                                                                       |
| M9  | [Calendar.tsx:181](src/components/calendar/Calendar.tsx#L181), [DatePicker.tsx:256](src/components/calendar/DatePicker.tsx#L256) | Card là `overflow-hidden px-5 pt-5`, **không có padding dưới** — hàng ngày cuối cùng và `DateFooter` là chỗ lộ. `BaseDateButton` vốn vẽ ring trên vòng tròn bên trong ([BaseDate.tsx:199-215](src/components/calendar/BaseDate.tsx#L199-L215)) nên lưới ngày có thể đã an toàn; verify rồi thêm `pb-5` hoặc chuyển control ở footer sang inset ring. |

**Verify:** các ca clip trong mục 7 của bản audit — accordion item đầu/cuối, một `Lnb` đủ dài để
scroll cộng thêm một group đang mở, hàng ngày cuối của calendar ở cả layout 1 tháng lẫn
`w-calendar-xl`.

**Lưu ý:** không cái nào ở đây là vấn đề stacking. Đừng "sửa" bằng `z-index` — bản audit đã xác định
toàn library không có lỗi chồng lấp nào, và đổi stacking không thể phục hồi một vùng vẽ đã bị clip.

---

## 6. PR 3 — Thay đổi giao diện: một width, hai idiom

**Width đã chốt ở D1: `1px`.** Đây là PR làm màn hình trông khác đi. Ship riêng.

### 3.1 — Chuẩn hoá width về `1px` (H13)

[src/styles/global.css:66](src/styles/global.css#L66): `--itui-focus-ring-width: 0.5px` → `1px`, và
viết lại comment của token — nó đang giải thích tại sao đây là hairline sub-pixel rồi mời người đọc
tự nâng lên 2px. Comment mới phải nói đúng hợp đồng hiện tại: `1px` là width **duy nhất** của mọi
ring và outline trong library, chọn vì nó ra đúng một device pixel ở mọi DPR; consumer nào cần 2px
cho WCAG 2.2 thì tự set token.

Kèm theo đó, đọc lại toàn library một lượt để chắc không còn chỗ nào tự đặt width: sau PR 1 và PR 2
thì mọi chỉ báo đều vẽ qua `focus-ring` / `focus-ring-inset`, nên chỉ cần grep các width viết tay còn
sót (`outline-2`, `outline-[…]`, `ring-2` dùng làm chỉ báo focus) và kéo về utility. `ring-2` của
`Slider` là **hover**, không phải focus — nó không thuộc diện này (xem M3 ở PR 4).

### 3.2 — Kéo họ field về cùng token (H1 / H2 / M10)

Họ field báo focus bằng màu border 1px và hoàn toàn không đọc token width. Ở width `1px` thì hai idiom
tình cờ cùng cường độ, nên phần này **không còn là chuyện độ dày** — nó là H1 (field đang lỗi mất hẳn
chỉ báo focus) và M10 (field không đọc token, nên consumer nào nâng token lên 2px sẽ để cả họ field ở
lại 1px).

**Không đổi độ dày border của field.** Bản audit gợi ý nâng lên 2px; điều đó vốn đã sai vì hình học —
shell là `h-12` cố định với `border-box`, nên border dày thêm 1px sẽ đẩy nội dung bên trong 1px và
field giật thấy rõ khi focus. Border giữ nguyên 1px, và ở width 1px thì cũng không có gì phải bù.

**Thay vào đó, chồng ring dùng chung lên trên chỉ báo border sẵn có:**

[input/InputFieldShell.tsx:121-130](src/components/input/InputFieldShell.tsx#L121-L130):

```tsx
className={cn(
  'flex items-center gap-1 h-12 p-3 rounded-lg border overflow-hidden',
  'transition-colors duration-150',
  // The ring is outside the state ternary on purpose: the error branch used to
  // swap the border and take the only focus indicator with it.
  'has-[:focus-visible]:focus-ring',
  disabled
    ? 'bg-surface-neutral-subtle border-input pointer-events-none'
    : isError
      ? 'bg-inverse border-destructive'
      : 'bg-inverse border-input focus-within:border-ring',
  boxClassName,
)}
```

Một sửa đổi này làm được bốn việc:

- **H1** — field đang lỗi giờ có chỉ báo khi focus; border đỏ và brand ring cùng tồn tại, nên "field
  này sai" và "bạn đang ở đây" đều đọc được.
- **M10** — field đọc `--itui-focus-ring-width` như mọi component khác, nên nó đi theo nếu consumer
  đổi width.
- Dùng `has-[:focus-visible]` thay vì `focus-within`: ring chỉ hiện với bàn phím, khớp với `Button`.
  `focus-within:border-ring` sẵn có vẫn sáng lên khi click chuột, đúng quy ước người dùng quen với
  field. Hai chỉ báo không còn mâu thuẫn nhau.
- `overflow-hidden` của chính shell không clip outline của chính nó, nên ring offset ở đây an toàn
  (chỉ **con cháu** mới bị clip — cũng chính là lý do các slot button ở H9 vẫn phải dùng bản inset).

[select/Select.tsx:77-97](src/components/select/Select.tsx#L77-L97) xử lý tương tự: đưa
`focus-visible:focus-ring` lên `triggerBase` để nó áp cho mọi variant, giữ `focus-visible:border-ring`
trong `default`. Cộng thêm D3: forward `disabled` xuống button bên dưới.

### 3.3 — Màu (M12 / D2)

Nếu D2 chọn làm đậm: `--itui-focus-ring-color: var(--color-brand-sky-600)`. Một dòng, nhờ token của
PR 0.

### 3.4 — Tài liệu

Câu khẳng định trong `ACCESSIBILITY.md` — "nếu bạn tìm thấy một control bỏ qua
`--itui-focus-ring-width` thì đó là bug" — lần đầu tiên trở thành sự thật. Ba chỗ phải sửa cho khớp
với `1px`:

- [ACCESSIBILITY.md:40](ACCESSIBILITY.md) — snippet `--itui-focus-ring-width: 2px` đang được giới
  thiệu như "the pre-1.1 look". Giữ snippet nhưng đổi nhãn: đây là cách consumer **chọn** 2px cho
  WCAG 2.2, còn default của library là `1px`.
- [ACCESSIBILITY.md:229-232](ACCESSIBILITY.md) — mục known-limitation "The focus indicator is a 0.5px
  hairline… sub-pixel widths render unevenly" không còn đúng. Viết lại: chỉ báo là `1px`, crisp ở mọi
  DPR, vẫn dưới con số 2px của WCAG 2.2, và nâng bằng một dòng token.
- Bảng focus-indicator: một width duy nhất cho cả hai idiom, kể cả họ field sau 3.2.

**Verify:** toàn bộ danh sách ở mục 7 của bản audit, ở DPR 1 và DPR 2, trên Chrome và Firefox. Đây
là PR trả hết nợ cho cột "Needs Visual Verification".

---

## 7. PR 4 — Polish và hàng rào chống regression

| ID      | File                                                                                                                                                                                 | Sửa gì                                                                                                                                                                                                                                                                                                                |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| M3      | [slider/Slider.tsx:71-73](src/components/slider/Slider.tsx#L71-L73)                                                                                                                  | `ring-2` của hover (box-shadow lan 2px ra ngoài) và focus outline (mép trong cách border box 2px) trùng khít nhau. Cho thumb `outline-offset: 4px` riêng để hai chỉ báo đồng tâm, hoặc bỏ hover ring khi đang focus. Ở width 1px chỉ báo focus đã crisp thay vì mờ, nên vùng trùng này lộ rõ hơn — kiểm lại sau PR 3. |
| M4 / L1 | [chip/Chip.tsx:180](src/components/chip/Chip.tsx#L180), [tag/Tag.tsx:137](src/components/tag/Tag.tsx#L137)                                                                           | Theo D4: bỏ `focus-visible:focus-ring` khỏi root khi component không interactive (một `<div>` không có `tabIndex` thì không bao giờ match được — class vô nghĩa và khiến component đọc như thể focus được), và document ràng buộc `onClick` + `onClose`.                                                              |
| M11     | [input-group/InputGroup.tsx:124](src/components/input-group/InputGroup.tsx#L124)                                                                                                     | Document việc uỷ quyền chỉ báo cho khung group, hoặc thay reset `focus-visible:ring-0` bằng thứ tường minh hơn. Chỉ là docs, trừ khi reset này hoá ra huỷ luôn ring của PR 3.                                                                                                                                         |
| L2      | [tabs/tabs.tsx:60](src/components/tabs/tabs.tsx#L60)                                                                                                                                 | Họ legacy vẽ từ bảng màu slate thô. Kéo về brand ring, hoặc đánh dấu deprecated.                                                                                                                                                                                                                                      |
| L4      | [modal.tsx:106](src/components/modals/modal.tsx#L106), [Popup.tsx:130](src/components/popup/Popup.tsx#L130), [BottomSheet.tsx:219](src/components/bottom-sheet/BottomSheet.tsx#L219) | Các overlay container dùng `focus:outline-none` trong khi ý là `focus-visible:outline-none`. Thực tế vẫn đúng vì đây là container được focus bằng script; chuẩn hoá cho nhất quán.                                                                                                                                    |
| L5      | [table/Table.tsx:150-167](src/components/table/Table.tsx#L150-L167)                                                                                                                  | `TableRow` nhận `onClick`/`onKeyDown` trên một `<tr>` vốn không focus được. Hoặc tự thêm `tabIndex={0}` + `role="button"` khi có `onClick`, hoặc document rằng consumer phải tự thêm.                                                                                                                                 |

### Hàng rào chống regression

Thêm `scripts/check-focus.ts` và script `check:focus`, gắn vào `prebuild` cạnh `check:client`,
`check:barrels`, `check:classes`. Script fail khi một file `.tsx` trong `src/components` render một
node focus được — `<button>`, `<a href>`, `tabIndex={0}`, một `Trigger`/`Item` của Radix — mà chuỗi
class không chứa `focus-visible:` hay `has-[:focus-visible]:`.

Đây là hạng mục rẻ nhất kế hoạch và gần như là có giá trị nhất: mọi phát hiện trong bản audit đều vô
hình khi review code, repo không có bộ test a11y nào (`pnpm test` chạy trên 0 file test), và chính
bản audit phải quét tay toàn bộ mới ra được. Lấy `scripts/check-class-merge.ts` làm khuôn — nó đã
parse sẵn chuỗi class của component.

---

## 8. Thứ tự triển khai

Cả 5 PR đều nằm trong `packages/ui`.

| PR  | Nội dung                                                | Phụ thuộc     | Đổi giao diện         |
| --- | ------------------------------------------------------- | ------------- | --------------------- |
| 0   | Token + `focus-ring-inset` + docs                       | —             | Không                 |
| 1   | Bổ sung indicator còn thiếu (C2–C4, H6–H12, M1, M2, M5) | PR 0 (chỉ H9) | Chỉ thêm              |
| 2   | Ring bị clip (H3–H5, M6–M9)                             | PR 0          | Chỉ thêm              |
| 3   | Width `1px` + gộp họ field (H13, H1, H2, M10, M12)      | D2, D3, PR 0  | **Có — mọi màn hình** |
| 4   | Polish (M3, M4, M11, L1–L5) + `check:focus`             | PR 3          | Nhỏ                   |

PR 0 đến PR 2 có thể xong trong một ngày làm việc và không đổi gì về diện mạo — chúng chỉ làm hiện ra
những thứ lẽ ra đã phải hiện. PR 3 là cái cần lịch QA riêng.

Toàn bộ QA của cả 5 PR chạy trong **Storybook**, không phải trong `apps/web`: chừng nào C1 (mục 1)
chưa được xử lý ở phía đó thì `apps/web` vẫn không vẽ chỉ báo nào, nên nó không dùng làm nơi verify
được.

---

## 9. Verify

### Gate (chạy trong `packages/ui` trước mỗi PR)

```
pnpm check:client     # client-boundary
pnpm check:barrels    # chặn rò rỉ barrel star-export
pnpm check:classes    # class-merge
pnpm check:docs       # API.md do generator sinh — không sửa tay, không prettier
pnpm build            # sinh lại dist/index.css; bắt buộc với mọi thay đổi global.css
```

Hiện trạng đã biết của bộ gate, để không hiểu nhầm là regression: `pnpm test` chạy `vitest` trên 0
file test, và `check:rsc` không chạy được trong môi trường này. Cả hai đều không nói lên điều gì.

### QA thủ công

[Mục 7 của bản audit](focus-visible-audit.md) chính là kịch bản QA; chạy theo từng PR thay vì dồn về
cuối:

- **Sau PR 1:** mọi dòng trong bảng PR 1 — tab vào (có ring), click chuột (không ring).
- **Sau PR 2:** accordion item đầu/cuối · `Lnb` đã scroll + group đang mở · hàng ngày cuối và footer
  của calendar ở cả hai layout · một `Button` trong `CarouselItem` ở rìa viewport · các cạnh của
  `ScrollArea` · header sort của `Table` ở cột đầu và cột cuối, rồi scroll ngang kiểm lại.
- **Sau PR 3:** làm lại tất cả ở `1px`, cộng `InputText` lỗi và `Select` lỗi, cộng `Slider` vừa hover
  vừa focus, cộng DPR 1 với DPR 2 trên Chrome và Firefox — DPR 1 là ca chính, vì đó là chỗ `0.5px`
  đang vẽ mờ và `1px` phải ra đúng một device pixel.

Lưu ý khi QA Storybook: không mở server thứ hai, đợi popper portal render xong rồi mới assert, và
restart nếu story index có vẻ cũ.

### Contrast cần đo lại sau PR 3

| Cặp màu                              | Kỳ vọng                                            |
| ------------------------------------ | -------------------------------------------------- |
| `#009ce0` trên `#ffffff`             | 3.07:1 — pass                                      |
| `#009ce0` trên `#f5f5f5` (row hover) | 2.82:1 — fail, chấp nhận theo D2 nếu không làm đậm |
| `#008ecc` trên `#f5f5f5`             | 3.6:1 — pass, phương án thay thế của D2            |

---

## 10. Rủi ro

| Rủi ro                                                                          | Cách giảm thiểu                                                                                                                     |
| ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Toàn bộ kế hoạch không tạo khác biệt nào trong `apps/web`                       | Đúng như vậy, và đó là C1 — nằm ngoài phạm vi (mục 1). Nói rõ với stakeholder trước khi bắt đầu, và mở ticket riêng cho `apps/web`. |
| PR 3 bị bác vì thẩm mỹ sau khi đã lên                                           | Chỉ là một token. Trả `--itui-focus-ring-width` về `0.5px`, mọi phần còn lại của kế hoạch vẫn đứng vững.                            |
| `focus-visible` không match focus-bằng-script của Radix trên một browser nào đó | Verify tường minh ở PR 1 trên Chrome và Firefox; phương án lùi (`data-[highlighted]` ring) đã ghi sẵn.                              |
| `tailwind-merge` âm thầm giữ cả `focus-ring` lẫn `focus-ring-inset`             | Không bao giờ truyền cả hai vào một element. Script `check:focus` ở PR 4 cũng có thể assert việc này.                               |
| Storybook không đổi gì sau khi sửa `global.css`                                 | `dist/index.css` chưa được build lại — chạy `pnpm build` trong `packages/ui`.                                                       |
| Consumer khác cũng đang tắt outline toàn cục như `apps/web`                     | Ghi cảnh báo vào `ACCESSIBILITY.md` ở PR 0 để đây là thứ đọc được từ phía library.                                                  |

---

## 11. Định nghĩa hoàn thành

- Mọi node focus được trong `packages/ui` đều vẽ chỉ báo khi `:focus-visible`, verify được trong
  Storybook.
- Idiom 3, 4 và 5 trong mục 5 của bản audit biến mất; chỉ còn idiom outline và idiom border của
  field, và cả hai đều đọc `--itui-focus-ring-width`.
- Mọi ring và outline trong library có đúng **một** width — `1px`, luôn lấy từ
  `--itui-focus-ring-width`; không component, variant hay story nào tự đặt width riêng.
- Không chỉ báo nào bị tổ tiên clip trong bất kỳ kịch bản nào ở mục 7.
- `ACCESSIBILITY.md` và `TOKENS.md` mô tả đúng những gì code đang làm, và có cảnh báo về việc tắt
  outline toàn cục ở phía consumer.
- `pnpm check:focus` tồn tại, pass, và đã gắn vào `prebuild`.
- Bảng ở mục 7 của bản audit có kết quả ghi nhận cho từng dòng.
- C1 đã được bàn giao thành ticket riêng cho người sở hữu `apps/web` (nằm ngoài kế hoạch này).
