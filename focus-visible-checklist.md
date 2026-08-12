# Focus Visible — Checklist theo dõi

Checklist thực thi cho [implementation-plan.md](implementation-plan.md); mã task (`C2`, `H4`, `M9`, …)
giữ nguyên của [focus-visible-audit.md](focus-visible-audit.md), nên ba tài liệu đọc song song được.

- Cập nhật lần cuối: 2026-08-12
- **Đang ở: cả 5 PR đã code + QA + gate + commit xong.** Năm commit xếp chồng trong `packages/ui`:
  `893d8d0f` (PR 0, `feat/focus-ring-tokens`) → `45c75ff4` (PR 1, `feat/focus-visible-indicators`) →
  `42434913` (PR 2, `feat/focus-ring-inset-clipped`) → `635d9df2` (PR 3, `feat/focus-ring-1px`) →
  `605dbf77` (PR 4, `feat/focus-ring-guard`). Story `Table` của PR 2 đã commit ở **repo cha**:
  `52ddb938` trên nhánh riêng `feat/focus-ring-table-story` off `dev`.
  **Còn lại đúng ba việc, không cái nào là code trong `packages/ui`:**
  1. Trên remote mới có **hai** nhánh — `feat/focus-ring-tokens` và `feat/focus-ring-guard`. Ba nhánh
     giữa (`feat/focus-visible-indicators`, `feat/focus-ring-inset-clipped`, `feat/focus-ring-1px`)
     vẫn chỉ có ở máy, nên nếu muốn 5 PR review xếp chồng thì phải push cả ba rồi mới mở PR; còn
     không thì PR của `feat/focus-ring-guard` sẽ gộp cả 4 commit.
  2. Mở PR cho từng nhánh (máy không có `gh` CLI nên không tự mở được).
  3. Bàn giao `C1` và `H10-nav` thành ticket riêng — cả hai nằm ngoài phạm vi kế hoạch.
- Phạm vi: chỉ `packages/ui` + story trong `apps/storybook`. Không đụng `apps/web`.

## Cách dùng qua từng prompt

1. Mở prompt mới → đọc dòng **Đang ở** phía trên, làm tiếp mục chưa tick.
2. Chỉ tick `[x]` khi đã **verify**, không tick lúc vừa viết xong code.
3. Kết thúc prompt → cập nhật dòng **Đang ở**, ghi một dòng vào [Nhật ký](#nhật-ký) cuối file.

Hai cái bẫy lặp lại ở mọi PR đụng `src/styles/global.css`:

- `dist/index.css` phải build lại (`pnpm --filter @echoit/itui.css build`), nếu không Storybook render
  utility mới thành class rỗng và cả PR trông như không làm gì.
- Không bao giờ truyền cả `focus-ring` lẫn `focus-ring-inset` vào cùng một element —
  `tailwind-merge` không biết hai utility này nên sẽ giữ cả hai.

Thêm hai cái bẫy của **khâu QA**, phát hiện ở PR 2:

- `transition-colors` transition cả `outline-color`. Đọc computed style ngay sau `Tab` sẽ bắt được
  ring đang nội suy từ `currentColor` sang brand — ra những màu như `rgb(15,15,15)` hay `rgb(10,61,84)`
  (đúng là `#0f0f0f → #009ce0` ở t≈0.33) và trông y như lỗi token. Đợi > 150ms rồi mới đo.
- Clip là hiệu ứng lúc **vẽ**: bị cắt thì computed style vẫn báo `outline: 1px solid …` như thường.
  Muốn biết có bị cắt hay không phải so hình học ring với padding-box của tổ tiên, hoặc nhìn pixel.

---

## 0. Quyết định chặn — chốt trước khi code

- [x] **D1** — width ring: đã chốt `1px`. Không cần design sign-off.
- [x] **D2** — **giữ `#009ce0`**, không làm đậm. Ghi nhận khoảng hở SC 1.4.11 trong `ACCESSIBILITY.md`
      (2.82:1 trên nền `#f5f5f5`). Mục `3.3 / M12` của PR 3 vì thế thành no-op.
- [x] **D3** — **có, forward `disabled`**. Đã grep: `SelectTrigger` chỉ có một consumer,
      [controled-select.tsx:55](../../apps/web/components/ui/controled-select.tsx#L55), và nó không
      truyền `disabled` → không ai đang dựa vào việc tab được vào trigger disabled.
- [x] **D4** — **document trước, tái cấu trúc sau**. Đã grep: không usage nào truyền đồng thời
      `onClick` và `onClose` — mỗi chỗ chỉ dùng một (`ChipCheckLabel`/`TagLabel` dùng `onClick`;
      `ChipAvatarLabelClose`/`TagLabelClose`/[InputTag.tsx:151](src/components/input/InputTag.tsx#L151)
      dùng `onClose`). `apps/web` không dùng `Chip`/`Tag` của itui.
- [ ] **C1** — mở ticket riêng cho người sở hữu `apps/web` (`*:focus { outline: none !important }` tại
      [globals.css:443](../../apps/web/app/globals.css#L443)). Ngoài phạm vi, nhưng phải bàn giao.
- [ ] Đã nói rõ với stakeholder: cả 5 PR **không tạo khác biệt nào trong `apps/web`** cho tới khi C1 xong.
- [ ] **H10-nav** — mở ticket riêng: trong panel của `InputDropdown`, `Tab` không bao giờ rời khỏi
      radio nên row `InputDropdownSub` không phải tab stop, và `ArrowRight`/`ArrowLeft` mà chính
      component đăng ký ([InputDropdown.tsx:131-141](src/components/input/InputDropdown.tsx#L131-L141))
      không ai với tới được. Lỗi có sẵn, phát hiện khi QA PR 1, nằm ngoài phạm vi "chỉ thêm".

---

## 1. PR 0 — Token và utility inset (không đổi giao diện)

- [x] `0.1` Thêm 3 token vào `:root` [src/styles/global.css:66](src/styles/global.css#L66):
      `--itui-focus-ring-color`, `--itui-focus-ring-offset`, `--itui-focus-ring-offset-inset`
- [x] `0.1` Giữ nguyên `--itui-focus-ring-width: 0.5px` ở PR này (cố ý — đổi ở PR 3), kèm comment giải thích
- [x] `0.2` Viết lại `@utility focus-ring` đọc token [src/styles/global.css:691](src/styles/global.css#L691)
- [x] `0.2` Thêm `@utility focus-ring-inset`
- [x] `0.3` `TOKENS.md`: bổ sung 3 token mới — thành mục `### Focus ring` cuối §9, ghi cả 4 token,
      vì `--itui-focus-ring-width` trước nay chưa từng có mặt trong `TOKENS.md`
- [x] `0.3` `ACCESSIBILITY.md`: thêm dòng `focus-ring-inset` vào bảng focus-indicator
- [x] `0.3` `ACCESSIBILITY.md`: bỏ khẳng định "không có gì clip nó" ở dòng "inside a surface"
- [x] `0.3` `ACCESSIBILITY.md`: thêm cảnh báo consumer tắt outline toàn cục sẽ vô hiệu hoá mọi chỉ báo (C1)
- [x] `0.3` **Không** sửa tay, **không** prettier `API.md` (generator sở hữu file này)
- [x] `0.4` Mô tả PR ghi rõ 2 cái bẫy: `tailwind-merge` và `dist` build — cả hai nằm trong body commit
      `893d8d0f` và trong bản mô tả PR ở scratchpad `pr0-body.md`
- [x] **Verify:** build xong, `Button` khi focus trong Storybook trông **y hệt** trước đó —
      tab vào `02-atomic-button-primary--label`, computed style ra `1px solid rgb(0, 156, 224)`
      offset `2px`, đúng các giá trị mà utility cũ hard-code (token width vẫn `0.5px`, Chrome làm
      tròn khi báo computed). `focus-ring-inset` chưa có chỗ dùng nên Tailwind chưa sinh rule trong
      Storybook; compile thẳng `dist/index.css` với hai candidate thì nó ra `outline-offset: var(--itui-focus-ring-offset-inset)`
- [x] [Gate](#gate-chạy-trong-packagesui-trước-mỗi-pr) xanh — chạy lại trên nhánh sau khi commit:
      `check:client` · `check:barrels` · `check:classes` · `build` đều pass. `check:docs` đỏ vì nợ
      `RatingStar` có sẵn; commit này không đụng `.tsx` nào nên không thể là nguyên nhân

---

## 2. PR 1 — Bổ sung indicator còn thiếu (chỉ thêm)

- [x] `C2` [dialog/dialog.tsx:122](src/components/dialog/dialog.tsx#L122) —
      `focus:outline-hidden` → `focus-visible:focus-ring`. Chốt 2026-08-12: **giữ** ring lúc dialog
      mở, kể cả mở bằng chuột — đó là focus khởi tạo của modal, không phải click vào nút
- [x] `C3` [calendar/WheelPicker.tsx:145-151](src/components/calendar/WheelPicker.tsx#L145-L151) —
      thêm `focus-visible:focus-ring` cho container `role="listbox"` **và viết lại comment sai phía trên
      `outline-none`**
- [x] `C4` [overflow-menu/OverflowMenu.tsx:190-194](src/components/overflow-menu/OverflowMenu.tsx#L190-L194) —
      giữ `data-[highlighted]:bg-muted`, thêm `focus-visible:focus-ring`
- [x] `H12` [dropdown-menu/dropdown-menu.tsx:107](src/components/dropdown-menu/dropdown-menu.tsx#L107) —
      giữ `focus:bg-accent`, thêm `focus-visible:focus-ring`
- [x] `M1` [select/Select.tsx:253](src/components/select/Select.tsx#L253) —
      giữ `focus:bg-secondary`, thêm `focus-visible:focus-ring`
- [x] **Chốt 2026-08-12 cho cả `C4`/`H12`/`M1`** — **giữ `focus-visible`**, không lùi về
      `data-[highlighted]`. Chấp nhận ring chạy theo con trỏ trên Chrome, và chấp nhận hành vi ở
      browser khác còn tuỳ heuristic của browser đó
- [x] `H6` [list/List.tsx:137-145](src/components/list/List.tsx#L137-L145) — thêm vào `rowClassName`
- [x] `H7` [sidebar/Sidebar.tsx:195](src/components/sidebar/Sidebar.tsx#L195) +
      [SidebarGroup.tsx:68](src/components/sidebar/SidebarGroup.tsx#L68) — cả hai row button
- [x] `H8` [popover/PopoverPanel.tsx:216](src/components/popover/PopoverPanel.tsx#L216) —
      **ưu tiên cao nhất** (roving tabindex với `asMenuItem`)
- [x] `H9` [InputSearch.tsx:103](src/components/input/InputSearch.tsx#L103) +
      [InputDate.tsx:196](src/components/input/InputDate.tsx#L196) —
      dùng bản **inset**: `focus-visible:focus-ring-inset`
- [ ] `H10` [input/InputDropdown.tsx:158](src/components/input/InputDropdown.tsx#L158) — thêm vào `cn()` row button.
      Code đã viết nhưng **không verify được**: row không phải tab stop (xem QA bên dưới). **Giữ
      class lại** — nó vô hại và sẽ đúng ngay khi row nhận được focus; lỗi tab stop tách thành
      `H10-nav` ở mục 0
- [x] `H11` [rating/Rating.tsx:172-182](src/components/rating/Rating.tsx#L172-L182) —
      chuyển `has-[:focus-visible]:focus-ring` xuống từng `<label>` nửa sao + `rounded-sm`
- [x] `M2` [src/styles/global.css:709-713](src/styles/global.css#L709-L713) —
      thêm `[data-sidebar-item]:focus-within` cạnh `:hover`
- [x] `M5` [breadcrumb/Breadcrumb.tsx:158-163](src/components/breadcrumb/Breadcrumb.tsx#L158-L163) — thêm cho link
- [x] **Verify (mọi dòng):** tab tới → có ring; click chuột → không ring — đã lái từng mục trên
      Chrome, kết quả ở bảng dưới. Ngoại lệ duy nhất là `H10`, không lái được bằng bàn phím
- [ ] **Verify (C4 / H12 / M1) trên Firefox — nợ, cố ý.** Chốt 2026-08-12: bỏ qua. Máy không có
      Firefox và puppeteer trong repo chỉ tải Chrome; hướng xử lý đã chốt bằng kết quả Chrome nên
      chạy Firefox cũng không đổi quyết định. Ai cài được Firefox thì chạy lại `probe` hover của ba
      mục này
- [x] [Gate](#gate-chạy-trong-packagesui-trước-mỗi-pr) xanh — `check:client` · `check:barrels` ·
      `check:classes` · `build` pass. `check:docs` vẫn đỏ đúng một dòng `RatingStar` có sẵn ở HEAD:
      chạy `pnpm docs:api` trên working tree này ra đúng một dòng đổi, không liên quan PR 1

### Kết quả QA PR 1 (Chrome 2026-08-12)

Chạy trên `storybook-static` + puppeteer, mỗi mục hai lần tải trang: một lần chỉ bàn phím, một lần
chỉ chuột. **Phải tải lại trang giữa hai lần** — Chrome giữ `:focus-visible` trên element đang focus
sẵn, nên đo chuột trên cùng trang vừa tab vào sẽ ra dương tính giả. Selector cũng phải bó trong
`#storybook-root`: Storybook chèn sẵn vài `button`/`a` 0×0 mà `Tab` và `click` chạm phải trước.

Ring đúng đọc ra `outline: 1px solid rgb(0, 156, 224)` (Chrome làm tròn token `0.5px`), offset `2px`
với bản thường và `-2px` với bản inset.

| Mục   | Bàn phím               | Chuột                        | Kết luận                                |
| ----- | ---------------------- | ---------------------------- | --------------------------------------- |
| `C3`  | ring @ `2px`           | không ring                   | pass                                    |
| `H6`  | ring @ `2px`           | không ring                   | pass                                    |
| `H7`  | ring @ `2px` (cả hai)  | không ring                   | pass                                    |
| `H8`  | ring @ `2px`           | không ring                   | pass                                    |
| `H9`  | ring @ `-2px` (cả hai) | không ring                   | pass — đúng bản inset                   |
| `H11` | ring @ `2px` trên nửa  | không ring                   | pass — bọc `<label>`, không bọc cả sao  |
| `M2`  | tooltip `none → flex`  | —                            | pass                                    |
| `M5`  | ring @ `2px`           | không ring                   | pass                                    |
| `C2`  | ring @ `2px`           | **ring khi mở bằng chuột**   | Radix autofocus nút close lúc mở dialog |
| `C4`  | ring @ `2px`           | **ring khi hover**           | ring chạy theo con trỏ                  |
| `H12` | ring @ `2px`           | **ring khi hover**           | ring chạy theo con trỏ                  |
| `M1`  | ring @ `2px`           | **ring ngay khi mở + hover** | Radix focus item đang chọn lúc mở       |
| `H10` | —                      | không ring                   | row không nhận được focus bàn phím      |

Ba chi tiết đáng ghi lại:

- `C4`/`H12`/`M1` — Radix `.focus()` item khi con trỏ đi qua, và heuristic của Chrome vẫn coi đó là
  `:focus-visible`. Đây đúng là rủi ro mục 5 bản kế hoạch đã lường trước. Phương án lùi
  (`data-[highlighted]:focus-ring`) **không xoá được ring khi hover** — nó chỉ làm hành vi đó giống
  nhau ở mọi browser thay vì phụ thuộc heuristic. Muốn hover sạch thì phải bỏ ring ở ba họ này.
- `C2` — nút close có ring ngay khi dialog mở, kể cả mở bằng chuột, vì Radix focus nó theo script.
  Đây không phải "click vào nút thì có ring"; là focus khởi tạo của dialog.
- `H10` — trong panel của `InputDropdown`, `Tab` không bao giờ rời khỏi radio: hai row category
  (`InputDropdownSub`) không phải tab stop, nên `ArrowRight`/`ArrowLeft` mà chính component đăng ký
  cũng không ai với tới được. Lỗi keyboard-nav có sẵn, nằm ngoài phạm vi "chỉ thêm" của PR 1.

Story QA tạm: `apps/storybook/src/zz-focus-qa/FocusQa.stories.tsx` (Sidebar, Dialog, DropdownMenu,
Select không có node Figma nên không có story). **Đã xoá hẳn trước khi commit PR 1** (bạn chốt
2026-08-12). PR 3 phải làm lại QA của PR 1 ở `1px` nên sẽ cần viết lại harness này từ đầu.

---

## 3. PR 2 — Ring bị tổ tiên clip (chỉ thêm)

- [x] `H3` [accordion/Accordion.tsx:154](src/components/accordion/Accordion.tsx#L154) —
      `focus-ring` → `focus-ring-inset`. **Không gỡ `overflow-hidden`** của `AccordionItem`
- [x] `H4` [lnb/Lnb.tsx:102](src/components/lnb/Lnb.tsx#L102) —
      `ROW_BASE`: `focus-ring` → `focus-ring-inset` (sửa một chỗ, xử lý cả hai điểm clip)
- [x] `H4b` [lnb/Lnb.tsx:275](src/components/lnb/Lnb.tsx#L275) — **mục mới, QA tìm ra**: `LnbToggle`
      không dùng `ROW_BASE` nên H4 không chạm tới, mà nó nằm đúng góc trên-phải của `LnbHeader` đang
      scroll → ring bị cắt 3px hai cạnh. Chuyển sang inset, nút có `p-2` nên thừa chỗ
- [x] `H5` [lnb/Lnb.tsx:487](src/components/lnb/Lnb.tsx#L487) — chỉ **verify**, dùng chung `ROW_BASE`
- [x] `M6` [carousel/Carousel.tsx:229](src/components/carousel/Carousel.tsx#L229) —
      không sửa component. **Không có story cho `Carousel`** (không có node Figma) nên document ở
      hai chỗ khác: comment ngay cạnh `overflow-hidden`, và một đoạn trong `ACCESSIBILITY.md`
- [x] `M7` [scroll/Scroll.tsx:155](src/components/scroll/Scroll.tsx#L155) — document, không tái cấu trúc
      Radix root. Cũng không có story; document giống `M6`
- [x] `M8` [table/Table.tsx:111](src/components/table/Table.tsx#L111) — verify xong, **không sửa
      component**: frame clip cả hai trục thật, nhưng `px-3 py-2` của `TableCell` đã đủ chỗ — control
      gần rìa nhất còn cách 11px. Chỉ sửa story (xem dưới)
- [x] `M9` [Calendar.tsx:181](src/components/calendar/Calendar.tsx#L181) +
      [DatePicker.tsx:256](src/components/calendar/DatePicker.tsx#L256) — verify xong, **không cần
      `pb-5`, không cần đổi footer**. Card đúng là `px-5 pt-5` không có padding dưới, nhưng hàng ngày
      cuối vẫn kết thúc trên padding-box 12px; nút của `DateFooter` cách rìa 16px
- [x] **Story** [Table.stories.tsx:206](../../apps/storybook/src/04-data-display/table/Table.stories.tsx#L206) —
      nút xoá viết tay trong cell không có class ring nào, rơi về ring mặc định của Chrome. Thêm
      `focus-visible:focus-ring` để ví dụ của DS làm đúng điều `ACCESSIBILITY.md` vừa yêu cầu
- [x] **Verify:** accordion cả ba variant · `Lnb` bản scroll + group đang mở · hàng ngày cuối của
      calendar ở cả 1 tháng lẫn `w-calendar-xl` — bảng kết quả bên dưới
- [x] **Không** dùng `z-index` để "sửa" bất kỳ mục nào ở đây — không có lỗi stacking trong library
- [x] [Gate](#gate-chạy-trong-packagesui-trước-mỗi-pr) xanh — `check:client` · `check:barrels` ·
      `check:classes` · `build` pass. `check:docs` vẫn đỏ đúng một dòng `RatingStar` có sẵn: chạy
      `pnpm docs:api` trên tree này ra đúng dòng đó, PR 2 không tạo drift mới

### Kết quả QA PR 2 (Chrome 2026-08-12)

Đo hai đường, vì mỗi đường một mình đều không đủ. Clip là hiệu ứng lúc **vẽ**, nên ring bị cắt vẫn
báo `outline: 1px solid rgb(0, 156, 224)` y như bình thường — phải so hình học (box nở ra bằng offset

- width) với padding-box của từng tổ tiên có `overflow != visible`. Quét tĩnh chạy trên **mọi** node
  focus được của story, kể cả node `Tab` không tới; đường thứ hai đi `Tab` để xem browser vẽ thật.

| Mục         | Ring sau khi sửa | Bị cắt | Ghi chú                                      |
| ----------- | ---------------- | ------ | -------------------------------------------- |
| `H3`        | brand @ `-2px`   | không  | cả ba variant `filled`/`line`/`outline`      |
| `H4`        | brand @ `-2px`   | không  | 12/13 node của story dùng inset              |
| `H4b`       | brand @ `-2px`   | không  | trước khi sửa: cắt 3px cạnh trên + phải      |
| `H5`        | brand @ `-2px`   | không  | dùng chung `ROW_BASE`                        |
| `M8`        | brand @ `2px`    | không  | control gần rìa nhất còn 11px, xa nhất 347px |
| `M9` PC     | brand @ `2px`    | không  | còn 12px dưới hàng ngày cuối                 |
| `M9` `xl`   | brand @ `2px`    | không  | 69 node focus được, không node nào sát rìa   |
| `M9` footer | brand @ `2px`    | không  | nút cách padding-box 16px cả dưới lẫn phải   |

---

## 4. PR 3 — Width `1px` + gộp họ field (ĐỔI GIAO DIỆN — ship riêng)

~~Chặn bởi D2 và D3~~ — cả hai đã chốt 2026-08-12, PR 3 không còn bị chặn.

- [x] `3.1 / H13` [src/styles/global.css:60-73](src/styles/global.css#L60-L73) —
      `--itui-focus-ring-width: 0.5px` → `1px`
- [x] `3.1` Viết lại comment của token: `1px` là width **duy nhất**, consumer cần 2px thì tự set.
      Sửa luôn hai chỗ khác nói theo giá trị cũ: cảnh báo "hairline" trong comment của `@utility`,
      và "~3px at the shipped values" (ở `1px` thì đúng bằng 3px)
- [x] `3.1` Grep width viết tay còn sót — **không còn cái nào là chỉ báo focus**. Hai kết quả duy
      nhất đều không tính: `ring-2` của `Slider` là hover (M3), và `ring-1 ring-offset-1` ở
      [Stepper.tsx:208](src/components/stepper/Stepper.tsx#L208) là vòng trang trí của step `current`.
      Sweep sau đó đo được **718/718 ring đúng `1px`**, nên không có width viết tay nào lọt lưới
- [x] `3.2 / H1 / M10` [input/InputFieldShell.tsx:121-152](src/components/input/InputFieldShell.tsx#L121-L152) —
      thêm `has-[:focus-visible]:focus-ring` **ngoài** ternary trạng thái
- [x] `3.2` **Không** đổi độ dày border của field (shell `h-12` + `border-box` sẽ giật khi focus)
- [x] `3.2 / H2` [select/Select.tsx:77-104](src/components/select/Select.tsx#L77-L104) —
      đưa `focus-visible:focus-ring` lên `triggerBase`, giữ `focus-visible:border-ring` trong `default`
- [x] `3.2 / D3` `SelectTrigger`: forward `disabled` xuống button bên dưới (trigger thôi là tab stop).
      Verify: sau hai trigger enabled, `Tab` rời hẳn story — trigger disabled không còn là tab stop
- [x] **Chốt 2026-08-12 — field có ring cả khi bấm chuột, và giữ nguyên.** QA đo: click vào `<input>`
      thì `:focus-visible` = **true**, click vào `Button` thì **false**. Đây là spec, không phải lỗi
      CSS của ta: browser luôn vẽ chỉ báo cho control nhập văn bản, bất kể chuột hay bàn phím, và
      `:focus-visible` chính là cơ chế nên không có cách CSS nào tách hai ca. Giữ vì đó là thứ duy
      nhất làm field **lỗi** có phản hồi khi focus. `SelectTrigger` là ngoại lệ trong họ —
      `<button role="combobox">` nên click không ra ring (đã đo). Đã ghi vào `ACCESSIBILITY.md`
- [x] `3.3 / M12` Theo D2 — **no-op**: đã chốt giữ `#009ce0`, không đổi `--itui-focus-ring-color`
- [x] `3.4` `ACCESSIBILITY.md` — đổi nhãn snippet `2px` thành lựa chọn WCAG 2.2 của
      consumer, không phải "the pre-1.1 look"
- [x] `3.4` `ACCESSIBILITY.md` — viết lại mục known-limitation "0.5px hairline", và thay mục
      "Field focus is a 1px border" (không còn đúng) bằng khoảng hở SC 1.4.11 mà D2 yêu cầu ghi nhận
- [x] `3.4` `ACCESSIBILITY.md` — bảng focus-indicator: một width duy nhất cho cả hai idiom. Bỏ
      `InputGroup` khỏi hàng **Fields** (nó vẫn là ring `3px` box-shadow của shadcn — xem M11) và
      xoá mục known-gap "`SelectTrigger` nhận `disabled` mà không forward", D3 vừa sửa xong
- [x] `3.4` `TOKENS.md` — bảng token: `0.5px` → `1px`, viết lại chú thích "sub-pixel và cố ý"
- [x] **Verify:** làm lại toàn bộ QA của PR 1 + PR 2 ở `1px`, cộng `InputText` lỗi, `Select` lỗi,
      `Slider` vừa hover vừa focus — bảng kết quả bên dưới
- [x] **Verify:** DPR 1 **và** DPR 2 trên Chrome — hai lần chạy ra **số liệu giống hệt nhau**, đúng
      điều mong đợi khi bỏ giá trị sub-pixel
- [ ] **Verify trên Firefox — nợ, cố ý.** Chốt 2026-08-12: bỏ qua, giống PR 1. Máy chỉ có chromium
      của playwright, Firefox phải tải thêm ~90MB. Rủi ro thấp hơn PR 1 vì `1px` không còn phụ thuộc
      cách browser làm tròn sub-pixel — mà chính Firefox là browser trước nay snap `0.5px` thành `1px`,
      nên nó là browser **ít** đổi nhất sau PR này. Ai chạy được thì chạy lại `focus-qa.mjs`
- [x] Đo lại contrast (tự tính lại, không chép số cũ): `#009ce0`/`#ffffff` **3.07:1** ·
      `#009ce0`/`#f5f5f5` **2.82:1** · `#009ce0`/`#ededed` **2.63:1** · `#008ecc`/`#f5f5f5` **3.36:1**.
      Số `3.6:1` ghi trong bản kế hoạch là **sai chỗ** — 3.66:1 là `#008ecc` trên **trắng**, không
      phải trên `#f5f5f5`. Khoảng hở SC 1.4.11 đã ghi vào known-gaps của `ACCESSIBILITY.md`
- [x] [Gate](#gate-chạy-trong-packagesui-trước-mỗi-pr) xanh — `check:client` · `check:barrels` ·
      `check:classes` · `build` pass. `check:docs` vẫn đỏ đúng một dòng `RatingStar` có sẵn: chạy
      `pnpm docs:api` trên tree này ra đúng dòng đó, PR 3 không tạo drift mới

### Kết quả QA PR 3 (Chrome 2026-08-12)

Harness viết lại từ đầu (bản của PR 1 đã xoá). Lần này không nhắm vào từng mục nữa mà **quét `Tab`
qua toàn bộ story**, vì "mọi node focus được đều có ring `1px` và không bị cắt" chính là điều PR 3
phải chứng minh. Mỗi lần dừng ghi lại: computed outline, hình học ring so với padding-box của mọi tổ
tiên `overflow != visible`, và — quan trọng — **node nào thật sự vẽ ring**, vì nhiều họ uỷ quyền chỉ
báo sang element khác (`peer-`, `has-`, `group-`) nên đo đúng node đang focus sẽ báo nhầm là "không
có chỉ báo".

| Chỉ số                      | DPR 1          | DPR 2          |
| --------------------------- | -------------- | -------------- |
| Story quét / lần dừng focus | 429 / 871      | 429 / 871      |
| Tự vẽ ring                  | 718            | 718            |
| Được vẽ hộ (uỷ quyền)       | 118            | 118            |
| **Ring sai width**          | **0**          | **0**          |
| **Bị tổ tiên cắt**          | **0**          | **0**          |
| Offset ghi nhận             | `2px` · `-2px` | `2px` · `-2px` |

Kịch bản không quét được bằng `Tab` (panel, hover, chuột) chạy riêng:

| Ca                                 | Kết quả                                                        |
| ---------------------------------- | -------------------------------------------------------------- |
| `Select` trigger default / lỗi     | ring `1px` @ `2px`; viền vẫn đỏ ở bản lỗi — hai thứ chồng nhau |
| `Select` trigger disabled          | không còn là tab stop (D3)                                     |
| `Select` item lúc mở (`M1`)        | ring `1px` @ `2px`                                             |
| `Select` trigger click chuột       | **không ring** (`:focus-visible` = false)                      |
| Field default / lỗi (`H1`/`M10`)   | shell (`320x48`) vẽ ring, `<input>` bên trong không            |
| Field disabled                     | không còn là tab stop                                          |
| Field click chuột                  | **có ring** — `:focus-visible` = true, xem mục chốt ở trên     |
| `Dialog` lúc mở + stop kế (`C2`)   | ring `1px` @ `2px` cả hai                                      |
| `DropdownMenu` row 1 và 2 (`H12`)  | ring `1px` @ `2px`                                             |
| `Sidebar` row / group / sub (`H7`) | ring `1px` @ `2px` cả ba                                       |
| `Slider` thumb chỉ focus           | ring `1px` @ `2px`, không box-shadow                           |
| `Slider` thumb focus **+** hover   | ring `1px` @ `2px` **+** box-shadow `#e6f5fc` spread `2px`     |
| `Button` click chuột (đối chứng)   | **không ring** — chứng tỏ ca chuột không bị hỏng nói chung     |

Ba điều đáng ghi lại:

- **`M3` nhẹ hơn tưởng.** Đo ra hai vòng của `Slider` **kề nhau chứ không đè nhau**: box-shadow hover
  chiếm 0→2px tính từ border-box, outline nằm ở 2→3px. Nên `outline-offset: 4px` mà mục M3 đề xuất là
  chuyện thẩm mỹ, không phải sửa lỗi.
- **35 node không có ring nào**, nhưng phần lớn là code demo trong story (nút `asChild` của
  Foundation, lưới icon, nút Close viết tay trong `Backdrop`), không phải component. `OverflowMenuContent`
  cũng nằm trong nhóm này và **đúng như vậy**: nó là panel Radix `tabIndex=-1`, vẽ ring quanh cả menu
  mới là sai. Chỉ hai chỗ là component thật — tách thành `M13`/`M14` ở mục 5.
- Harness quét tĩnh ghim `transition-duration: 0s` trước khi đo để khỏi dính bẫy `transition-colors`;
  các kịch bản thì **không** ghim, mà đợi 350ms — đo đúng thứ browser vẽ thật.

---

## 5. PR 4 — Polish + hàng rào chống regression

- [x] `M3` [slider/Slider.tsx:71-73](src/components/slider/Slider.tsx#L71-L73) — **no-op có chủ đích,
      chỉ document.** Chốt 2026-08-12 sau khi đo lại: hai vòng **kề nhau chứ không đè** — box-shadow
      hover chiếm 0→2px từ border-box, outline nằm 2→3px. Tiền đề "trùng khít" của bản kế hoạch sai,
      nên `outline-offset: 4px` là thẩm mỹ chứ không phải sửa lỗi. Số đo đã ghi vào comment
- [x] `M4 / L1` [chip/Chip.tsx:180](src/components/chip/Chip.tsx#L180) +
      [tag/Tag.tsx:137](src/components/tag/Tag.tsx#L137) — `focus-visible:focus-ring` giờ gắn vào
      `isInteractive`, cùng cờ với `tabIndex`. Ràng buộc `onClick` + `onClose` document ở comment và
      ở mục mới `Chip and Tag: one interaction each` của `ACCESSIBILITY.md`
- [x] `M11` [input-group/InputGroup.tsx:124](src/components/input-group/InputGroup.tsx#L124) —
      **document, không sửa.** Đã kiểm: reset `focus-visible:ring-0` **không** huỷ ring của PR 3 vì
      nó là `ring` (box-shadow) còn ring của ta là `outline`; và nó rơi sai element — `className` của
      `InputGroupInput` đi tới wrapper ngoài của `InputFieldShell` chứ không tới box. `InputGroup` có
      0 consumer nên không có composition nào để verify bản sửa. Ghi vào comment + `ACCESSIBILITY.md`
- [x] `L2` [tabs/tabs.tsx:60](src/components/tabs/tabs.tsx#L60) — **đã xong từ trước kế hoạch**
      (commit `dead114b`, trước PR 0): focus class đã đi qua `focus-ring` và mọi part đã có
      `@deprecated`. Chỉ verify lại, không sửa gì
- [x] `L4` [modal.tsx:106](src/components/modals/modal.tsx#L106) +
      [Popup.tsx:130](src/components/popup/Popup.tsx#L130) +
      [BottomSheet.tsx:219](src/components/bottom-sheet/BottomSheet.tsx#L219) —
      `focus:outline-none` → `focus-visible:outline-none`
- [x] `L5` [table/Table.tsx:150-167](src/components/table/Table.tsx#L150-L167) — **document, không
      sửa.** Chốt 2026-08-12: `role="button"` trên `<tr>` là ARIA sai (xoá row khỏi cấu trúc bảng với
      screen reader), và tự thêm `tabIndex` sẽ biến mọi row của mọi bảng đang có thành tab stop. Ghi
      công thức opt-in (kèm **inset** ring, vì khung `Table` là `overflow-x-auto`) vào comment và vào
      mục `What you have to supply` của `ACCESSIBILITY.md`
- [x] `M13` **mục mới, QA PR 3 tìm ra** — `<select>` tháng/năm trong caption của `DatePicker` (do
      react-day-picker dựng, 6 lần dừng focus ở hai story `dropdown-caption` và
      `range-picker-with-dropdown`) không có chỉ báo nào của mình. Nặng hơn "rơi về ring mặc định":
      `<select>` là `opacity-0`, nên ring mặc định của browser cũng vô hình theo. Ring vì thế đặt lên
      `dropdown_root` bằng `has-[:focus-visible]:focus-ring` — nó là box mà nhãn nhìn thấy được chiếm
- [x] `M14` **mục mới, QA PR 3 tìm ra** — `ScrollAreaViewport`
      ([Scroll.tsx:168](src/components/scroll/Scroll.tsx#L168)) là tab stop (Radix đặt `tabIndex=0`
      để cuộn được bằng bàn phím, 7 lần dừng focus) nhưng không vẽ gì. Đã dùng bản **inset**:
      `ScrollAreaRoot` là `overflow-hidden` nên ring hướng ra sẽ bị cắt. Khác `M7` — `M7` nói về nội
      dung của consumer bị cắt, `M14` là chính viewport không có chỉ báo
- [x] Viết `scripts/check-focus.ts` (lấy `scripts/check-class-merge.ts` làm khuôn) — 20/20 self-test
- [x] Thêm script `check:focus` vào `package.json` và gắn vào `prebuild` cạnh `check:client`,
      `check:barrels`, `check:classes`
- [x] `check:focus` cũng assert không element nào có cả `focus-ring` lẫn `focus-ring-inset` (R2)
- [x] **`check:focus` tìm ra 5 node thiếu chỉ báo mà không đợt QA nào thấy** — xem bảng bên dưới.
      Bốn cái không có story nên đã verify bằng story QA tạm, xoá trước khi commit
- [x] [Gate](#gate-chạy-trong-packagesui-trước-mỗi-pr) xanh — `check:client` · `check:barrels` ·
      `check:classes` · **`check:focus`** · `build` pass. `check:docs` vẫn đỏ đúng một dòng
      `RatingStar` có sẵn: chạy `pnpm docs:api` trên tree này ra đúng dòng đó rồi `git restore`, nên
      PR 4 không tạo drift mới — cố ý **không** sửa JSDoc nào, mọi thứ document đi vào comment và
      `ACCESSIBILITY.md`

### Kết quả QA PR 4 (Chrome 2026-08-12)

`storybook-static` + playwright, đợi 400ms sau mỗi lần focus (bẫy `transition-colors`) và so hình
học ring với padding-box của mọi tổ tiên `overflow != visible`.

| Mục                                | Kết quả                                                         |
| ---------------------------------- | --------------------------------------------------------------- |
| `M13` `dropdown-caption`           | `1px` @ `2px` trên `dropdown_root` (span 73×24), cách clip 19px |
| `M13` `range-picker-with-dropdown` | `1px` @ `2px`, cách clip 19px                                   |
| `M14` `scroll--default` / `--both` | `1px` @ **`-2px`**, không bị cắt                                |
| `M4` chip/tag trang trí            | 1 root: 0 tab stop, **0 class ring**                            |
| `M4` chip/tag tương tác            | 4 root: 4 tab stop, 4 có class ring → `1px` @ `2px`             |
| `L4` `Modal` / `BottomSheet`       | box `outline: none`, focus vào **trong**, không phải chính box  |
| `M3` Slider hover+focus            | outline `1px` @ `2px` **và** box-shadow `#e6f5fc` spread `2px`  |

Năm node `check:focus` tìm ra — không đợt QA nào của PR 1–3 thấy, vì bốn cái không có story:

| Node                                             | Trước      | Sau           |
| ------------------------------------------------ | ---------- | ------------- |
| `DropdownMenuSubTrigger`                         | không ring | `1px` @ `2px` |
| `DropdownMenuCheckboxItem`                       | không ring | `1px` @ `2px` |
| `DropdownMenuRadioItem`                          | không ring | `1px` @ `2px` |
| `resource-modal` nút xoá tag                     | không ring | `1px` @ `2px` |
| `InputTextFormatting` row của popover block-type | không ring | `1px` @ `2px` |

Ba node bị `check:focus` gắn cờ nhưng **đúng là không nên vẽ**, đã opt-out bằng comment `focus-ok:`
kèm lý do: `RadixAccordion.Item` (vỏ section, `AccordionTrigger` bên trong mới là tab stop),
`ScrollAreaPrimitive.Thumb` (tay kéo chuột, `ScrollAreaViewport` mới là đường bàn phím) và
`RadixSwitch.Thumb` (`pointer-events-none`, `Root` vẽ ring cho cả track).

Ba nhóm false positive đã sửa **trong script**, không phải trong component — đáng ghi vì chúng là lý
do một bản grep không làm được việc này:

- **Comment cũng chứa tên utility.** Comment của `PopoverPanel` dặn "pass `focus-visible:focus-ring-inset`
  ở đây" và bị đọc thành node mang cả hai ring. Script phải strip comment trước khi đo.
- **Nửa số chuỗi class không nằm ở module scope.** `Button` dựng `const classes = cn(buttonVariants(…))`
  ngay trong thân component; `InputText` thì để `InputFieldShell` — một file khác — vẽ hộ.
- **Radix part có hai loại.** Cái ta style (`DropdownMenuItem`) phải có ring; cái ta chỉ re-export
  (`DialogTrigger`, `PopoverClose`) thì control là của consumer qua `asChild`. Phân biệt bằng việc
  chuỗi class có literal của ta hay không.

---

## Gate (chạy trong `packages/ui` trước mỗi PR)

```
pnpm check:client
pnpm check:barrels
pnpm check:classes
pnpm check:docs
pnpm build
```

Hiện trạng đã biết, **không phải regression**: `pnpm test` chạy `vitest` trên 0 file test, và
`check:rsc` không chạy được trong môi trường này.

`check:docs` **đang đỏ từ trước PR 0** và không liên quan tới kế hoạch này: JSDoc của `RatingStar`
trong source đã đổi thành _"a grey solid"_ nhưng `API.md` vẫn ghi _"an outline"_ — đúng một dòng lệch,
đã commit ở HEAD. Sửa bằng `pnpm docs:api` trong một commit riêng; **không** gộp vào PR nào của kế
hoạch này, vì PR focus-visible không đụng tới public surface.

QA chạy trong **Storybook**, không phải `apps/web` (xem C1). Không mở server thứ hai, đợi popper portal
render xong rồi mới assert, restart nếu story index có vẻ cũ.

---

## Định nghĩa hoàn thành

- [x] Mọi node focus được trong `packages/ui` vẽ chỉ báo khi `:focus-visible`, verify trong Storybook
      — 718/718 ở sweep PR 3, cộng 5 node nữa `check:focus` tìm ra và PR 4 verify. Ba node cố ý không
      vẽ đã opt-out kèm lý do
- [x] Idiom 3, 4, 5 (mục 5 bản audit) biến mất; chỉ còn idiom outline và idiom border của field.
      Ngoại lệ duy nhất là `InputGroup` (ring `3px` shadcn, 0 consumer) — đã ghi vào `ACCESSIBILITY.md`
      là chưa-áp-dụng chứ không phải idiom thứ hai
- [x] Mọi ring/outline có đúng **một** width `1px`, luôn từ `--itui-focus-ring-width`
- [x] Không chỉ báo nào bị tổ tiên clip trong mọi kịch bản ở mục 7 bản audit
- [x] `ACCESSIBILITY.md` + `TOKENS.md` mô tả đúng code, có cảnh báo tắt outline toàn cục
- [x] `pnpm check:focus` tồn tại, pass, đã gắn vào `prebuild`
- [x] Bảng mục 7 bản audit có kết quả ghi nhận cho từng dòng — nằm ở bốn bảng QA của tài liệu này
- [ ] C1 đã bàn giao thành ticket riêng cho `apps/web`
- [ ] `H10-nav` đã bàn giao thành ticket riêng

---

## Nhật ký

| Ngày       | PR  | Làm gì                                                                                 | Kết quả                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ---------- | --- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 2026-08-12 | 0   | 3 token + `focus-ring` đọc token + `focus-ring-inset` + `TOKENS.md`/`ACCESSIBILITY.md` | Xong, đã verify trong Storybook: `Button` focus không đổi (`1px solid rgb(0,156,224)` @ `2px`). Còn mở PR. `check:docs` đỏ do drift `RatingStar` có sẵn ở HEAD.                                                                                                                                                                                                                                                                                                                                                                                                                            |
| 2026-08-12 | 0   | Chốt D2/D3/D4 bằng grep consumer; commit + push PR 0                                   | Commit `893d8d0f` trên `feat/focus-ring-tokens`, đã push. Gate chạy lại: 4/5 pass, `check:docs` vẫn đỏ vì nợ cũ. Chỉ còn bạn bấm mở PR. Máy không có `gh` CLI nên không tự mở được.                                                                                                                                                                                                                                                                                                                                                                                                        |
| 2026-08-12 | 1   | QA Chrome toàn bộ 13 mục PR 1 trên `storybook-static` + puppeteer                      | 8 mục pass và đã tick. `C4`/`H12`/`M1` vẽ ring khi hover, `C2` vẽ ring khi dialog mở bằng chuột, `H10` không verify được vì row không phải tab stop. Firefox chưa chạy (máy không có). Chưa commit gì.                                                                                                                                                                                                                                                                                                                                                                                     |
| 2026-08-12 | 1   | Chốt 3 quyết định sau QA; chạy nốt gate                                                | Giữ `focus-visible` cho `C4`/`H12`/`M1`, giữ ring `C2`, bỏ verify Firefox → **không sửa thêm dòng code nào**. 12/13 mục đã tick, `H10` tách thành `H10-nav`. Gate 4/5 pass, `check:docs` đỏ đúng một dòng `RatingStar` có sẵn. Còn xoá story QA tạm rồi commit.                                                                                                                                                                                                                                                                                                                            |
| 2026-08-12 | 1   | Xoá story QA tạm; commit PR 1                                                          | Commit `45c75ff4` trên `feat/focus-visible-indicators`, xếp chồng trên PR 0. Gộp luôn một dòng lạc ở `Checkbox` (`border-transparent` → `border-brand`, render y hệt) theo ý bạn. Chưa push, chưa mở PR.                                                                                                                                                                                                                                                                                                                                                                                   |
| 2026-08-12 | 2   | Code H3/H4/H5, document M6/M7, QA đo clip toàn bộ story của 7 mục                      | `M8`/`M9` verify ra **không cần sửa code** — số đo trong bảng QA PR 2. QA lòi ra `H4b` (`LnbToggle` bị cắt 3px) và một nút không có ring trong story `Table`; cả hai đã sửa theo ý bạn. Cũng lòi ra bẫy `transition-colors` transition cả `outline-color`.                                                                                                                                                                                                                                                                                                                                 |
| 2026-08-12 | 2   | Commit PR 2                                                                            | Commit `42434913` trên `feat/focus-ring-inset-clipped`. Gate 4/5 pass, `check:docs` vẫn đúng một dòng `RatingStar` có sẵn. Sửa story `Table` nằm ở repo cha nên **chưa commit**, còn đợi bạn chọn nhánh.                                                                                                                                                                                                                                                                                                                                                                                   |
| 2026-08-12 | 2   | Commit story `Table` ở repo cha                                                        | Bạn chốt nhánh riêng: `52ddb938` trên `feat/focus-ring-table-story` off `dev`, đúng một file. Hook pre-commit prettier cả repo như thường lệ nhưng lần này không đổi nội dung file nào (chỉ CRLF), đã `git restore`.                                                                                                                                                                                                                                                                                                                                                                       |
| 2026-08-12 | 3   | Code 3.1→3.4: width `1px`, gộp họ field, forward `disabled`, viết lại 2 tài liệu       | Grep width viết tay: không còn chỗ nào là chỉ báo focus. Phát sinh ngoài kế hoạch: `InputGroup` phải bỏ khỏi hàng **Fields** của `ACCESSIBILITY.md` (nó vẫn là ring `3px` shadcn, không có consumer/story/docs), và khoảng hở SC 1.4.11 mà D2 dặn ghi thì trước nay chưa hề có trong tài liệu — nay đã thêm.                                                                                                                                                                                                                                                                               |
| 2026-08-12 | 3   | QA: harness mới quét `Tab` toàn bộ story, DPR 1 + DPR 2 + kịch bản panel/hover/chuột   | **718/718 ring đúng `1px`, 0 bị cắt, hai DPR giống hệt nhau.** Lòi ra ba thứ: field có ring cả khi bấm chuột (là spec, bạn chốt giữ), `M3` của Slider chỉ là thẩm mỹ vì hai vòng kề chứ không đè nhau, và hai node thật sự thiếu chỉ báo → `M13`/`M14` cho PR 4. Số contrast `3.6:1` trong bản kế hoạch là chép sai chỗ, đã tính lại.                                                                                                                                                                                                                                                      |
| 2026-08-12 | 4   | Toàn bộ mục 5: polish + `scripts/check-focus.ts` + QA + gate                           | Bạn chốt `M3`/`M11`/`L5` đều **document-only**, nên PR 4 chỉ đổi code ở `M4`/`L1`/`L4`/`M13`/`M14`. `L2` hoá ra đã xong từ commit `dead114b` trước cả PR 0. `check:focus` (20/20 self-test) tìm thêm **5 node thiếu chỉ báo** — 3 part của `dropdown-menu` legacy mà `H12` bỏ sót, nút xoá tag của `resource-modal`, và row popover của `InputTextFormatting`; bốn cái đầu không có story nên đã verify bằng story QA tạm rồi xoá. `M13` nặng hơn ghi nhận cũ: `<select>` là `opacity-0` nên ring mặc định của browser cũng vô hình. Cố ý không sửa JSDoc nào để `API.md` không lệch thêm. |
| 2026-08-12 | 4   | Commit + push PR 4                                                                     | Commit `605dbf77` trên nhánh mới `feat/focus-ring-guard`, xếp chồng trên PR 3, **đã push**. Hook pre-commit không đổi file nào lần này. Remote giờ có 2/5 nhánh: PR 0 và PR 4; ba nhánh giữa vẫn local. Kế hoạch hết phần code — còn mở PR và hai ticket bàn giao `C1`/`H10-nav`.                                                                                                                                                                                                                                                                                                          |
