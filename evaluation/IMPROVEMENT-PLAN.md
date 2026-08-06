# Kế hoạch cải thiện — `@echoit/itui.css`

Tổng hợp từ `DX-REPORT.md`, `DX-SCORES.json`, `FAILURES.md`, `RECOMMENDATIONS.md`
(evaluation 2026-08-05, bản npm `1.0.15`, điểm 8.4/10 — `GOOD DX`).

Mỗi issue dưới đây đã được **đối chiếu lại với source hiện tại trong repo**, không chỉ chép lại
báo cáo. Chỗ nào source mâu thuẫn với báo cáo, mình ghi rõ và đề nghị bỏ qua recommendation đó.

---

## 0. Ghi chú kiểm chứng

Repo đang ở `version: 1.0.15` — cùng bản mà evaluation đã test, nên mọi failure còn mở đều tái
hiện được trên source.

| Claim của evaluation | Kiểm chứng trong source | Kết luận |
| --- | --- | --- |
| `Tag`/`Chip` truyền `onKeyDown` không gate, không có `"use client"` | `tag/Tag.tsx:155`, `chip/Chip.tsx:203` — `onKeyDown={handleKeyDown}` ngay dưới dòng `onClick={isInteractive ? … : undefined}`; cả hai file mở đầu bằng `import`, không có directive | ✅ Đúng |
| `Pagination` truyền `onClick` không điều kiện | `pagination/Pagination.tsx:113` `onClick={onClick}` trong `CellButton`, không directive | ✅ Đúng |
| `SelectTrigger` triệt tiêu focus indicator | `select/Select.tsx:69` — `focus-visible:ring-0 focus-visible:outline-none` | ✅ Đúng |
| `SelectTrigger` không nối `label`/`error` với AT | `select/Select.tsx:91-125` — `<label>` không `htmlFor`, Trigger không `id`, không `aria-invalid`, không `aria-describedby` | ✅ Đúng |
| Chỉ 2/5 nhóm trùng có `@deprecated` | Toàn `src/` chỉ có 2: `input/Input.tsx:17`, `popover/Popover.tsx:25` | ✅ Đúng |
| Docs ghi "2.0" trên package 1.0.15 | `README.md:331`, `popover/Popover.tsx:19,25` | ✅ Đúng |
| `Toggle` không có prop `label` | `toggle/Toggle.tsx` — `ToggleProps extends ComponentPropsWithoutRef<RadixSwitch.Root>`, chỉ thêm `size` | ✅ Đúng |
| `Dialog` thiếu `aria-modal` | Không có chuỗi `aria-modal` nào trong `dialog/` | ✅ Đúng (đúng như eval, và eval tự xếp là "nit") |
| **`colors`/`radius`/`shadow`/`spacing`/`typography` là "token showcase"** | **Sai.** Cả 5 đều là component thật: `forwardRef` + `data-slot` + `asChild` + `cn(className)`, ví dụ `radius/Radius.tsx:98-115` chỉ áp một class radius lên `div`/`Slot`. Module còn export token map thật (`COLOR_HEX`, `RADIUS_PX`, `SPACING_PX`, `TYPOGRAPHY_SPEC`) | ❌ **Bác bỏ** — xem I-18 |
| `check:rsc` "đã có nhưng không bắt được lỗi" | Nặng hơn thế: `scripts/check-rsc.ts:16` trỏ vào `fixtures/next-app`, **thư mục `fixtures/` không tồn tại** trong repo và không bị gitignore → script không chạy được | ⚠️ **Nặng hơn báo cáo** — xem I-2 |

Một phát hiện bổ sung quan trọng: `scripts/check-client-boundary.ts:24-26` **tự khai báo lỗ hổng
của chính nó**:

> `Known gap: passing a locally-defined handler into a client primitive (the dialog.tsx case) is
> not detectable this way. The Next.js fixture in CI covers it.`

Lỗ hổng đó chính là I-1. Và "the Next.js fixture in CI" — thứ được giao nhiệm vụ bù lỗ hổng — là
thư mục không tồn tại. Đây là nguyên nhân gốc thật sự, sâu hơn "ba dòng code quên gate".

---

## 1. Bảng tổng hợp issue (đã khử trùng lặp)

22 mục rời rạc trong 4 file gộp lại còn **19 issue**. Cột "Nguồn" cho thấy mục nào là cùng một
vấn đề được kể lại ở nhiều nơi.

**I-22 không đến từ evaluation** — đây là yêu cầu nội bộ thêm ngày 2026-08-06, giữ chung bảng để
có một chỗ duy nhất theo dõi công việc.

| ID | Issue | Nguồn (đã gộp) | Loại | Ảnh hưởng | Effort | Breaking | Ưu tiên |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **I-1** | `Tag`/`Chip`/`Pagination` fail RSC build | F-15, R-15, Top10#1, S15, blocker, F-01 tail, R-01 tail | Next.js/SSR + Component Impl | **Critical** | Small | Không | **P0** |
| **I-2** | Gate lẽ ra bắt được I-1 đang mù + mất fixture | R-15 acceptance test, §18.8 | Component Impl (tooling) | **Critical** | Medium | Không | **P0** |
| **I-3** | `SelectTrigger` không có focus indicator | F-16, R-16.1, Top10#2, S12 | Accessibility | **Critical** | Small | Không | **P0** |
| **I-4** | `SelectTrigger` `label`/`error` vô hình với AT | F-17, R-16.2-3, Top10#3, §9, S04 | Accessibility + API Design | **High** | Small | Không | **P0** |
| **I-5** | Không có contract a11y dùng chung cho field | R-16 "broader point" | API Design | Medium | Medium | Không | P1 |
| **I-6a** | Docs ghi "2.0" trên package 1.0.15 | F-18, R-17, Top10#4, §10 | Documentation | **High** | Small | Không | **P0** |
| **I-6b** | Breaking rename đi trong patch release | F-18, R-17, §18.5 | API Design (release policy) | **High** | Small–Medium | Đã xảy ra | P1 |
| **I-7** | Lỗi TS khi migrate `Popover` không chỉ ra `PopoverPanel` | F-18 secondary, R-17 tail, §11 | TypeScript | Medium | Small | Không | P1 |
| **I-8** | 3/5 nhóm trùng thiếu `@deprecated` | F-22, R-18, Top10#6, §9, R-11 tail | TypeScript + Documentation | Medium | Small | Soft¹ | P1 |
| **I-9** | Lỗi composition của `Tab` gọi sai tên export | F-19, R-19, Top10#7, S07, S13 | Component Impl (error UX) | Medium | Medium² | Không | P1 |
| **I-10** | Không có tài liệu Next.js / RSC | F-22, R-20, Top10#5, §10, §14 | Documentation | **High** | Small | Không | P1 |
| **I-11** | 17.36 MB icons cài cho mọi consumer | F-20, R-21, Top10#9, S02, S16 | Performance | Medium | **Large** | Có³ | P2 |
| **I-12** | Subpath import → render không style, im lặng | F-21, Top10#10, S03, S13 | Documentation | Low | — | — | **Bỏ⁴** |
| **I-13** | Nhiều prop description trống trong `API.md` | F-22, R-22, Top10#8 | Documentation | Medium | Medium | Không | P2 |
| **I-14** | Không có tài liệu accessibility | F-22, R-23, §10 | Documentation + A11y | Medium | Medium | Không | P2 |
| **I-15** | `Toggle` không có prop `label` | F-22, R-23, §13 | Missing Feature + A11y | Medium | Small | Không⁵ | P2 |
| **I-16** | Lỗi `require()` không nói package là ESM-only | F-22, R-24, S13 | Documentation + Packaging | Low | Small | Không | P2 |
| **I-17** | `API.md`/`TOKENS.md` không nằm trong tarball | F-22, §10 | Documentation | Low | Small | Không | P2 |
| **I-18** | "Token showcase export như component" | R-25, R-14 tail, §9 | API Design | — | — | — | **Bỏ⁶** |
| **I-19** | `Dialog` thiếu `aria-modal` | F-22, §13, S05 | Accessibility | Low | Small | Không | P3 |
| **I-20** | Không có docs site / không search được | F-22, §10, F-13 tail | Documentation | Medium | **Large** | Không | P3 |
| **I-21** | `Checkbox.label` vs `Radio` children | §9 | API Design | Low | — | — | **Bỏ⁷** |
| **I-22** | Icon trong `/components` không đồng nhất weight (inline SVG + `Fill`) | Yêu cầu nội bộ 2026-08-06 | Design Consistency | Medium | Medium | Không⁸ | P2 |

¹ Không vỡ compile, nhưng consumer bật `eslint-plugin-deprecation` ở mức `error` sẽ đỏ CI.
² R-19 đề xuất cách sửa **không thực hiện được** — xem chi tiết I-9.
³ Chỉ breaking nếu bỏ subpath `./icons`; có đường đi non-breaking.
⁴ ⁶ ⁷ Đề nghị không làm — lý do ở §4.
⁸ Không breaking về API/compile, nhưng là thay đổi **thị giác** trên nhiều component — 3 chỗ mất
nghĩa nếu đổi máy móc, phải chốt trước (xem I-22).

---

## 2. Chi tiết từng issue

### I-1 — `Tag`, `Chip`, `Pagination` fail Next.js Server Component build

- **Mô tả.** Render `<Tag>Enterprise</Tag>` trong một Server Component làm `next build` fail:
  `Error: Event handlers cannot be passed to Client Component props`. Fail cả khi consumer không
  truyền handler nào.
- **Nguyên nhân.** Ba file không có banner `"use client"` *và* truyền function vào DOM prop vô
  điều kiện. Guard đã tồn tại nhưng áp thiếu chỗ: `tag/Tag.tsx:154` gate `onClick` theo
  `isInteractive`, nhưng dòng ngay dưới `tag/Tag.tsx:155` là `onKeyDown={handleKeyDown}` trần.
  `Chip` y hệt (`chip/Chip.tsx:202-203`). `Pagination` truyền `onClick` trên mọi nút trang
  (`pagination/Pagination.tsx:113`) — vốn dĩ interactive nên không gate được.
- **Ảnh hưởng tới developer.** Đây là blocker duy nhất còn lại của cả package. Đau ở chỗ README
  mở đầu phần component bằng *"Use `Tag` or `Chip` for a status or tier label"* — lời khuyên đúng,
  nhưng dẫn thẳng App Router user vào build failure, mà không dòng docs nào nhắc tới
  `"use client"`.
- **Component.** `Tag`, `Chip`, `Pagination`.
- **Hướng giải quyết.** Hai component đầu: gate handler thay vì dán banner —
  `onKeyDown={isInteractive ? handleKeyDown : undefined}` — để `<Tag>` trang trí vẫn
  server-renderable. `Pagination` thì thêm `"use client"`, vì nút phân trang interactive theo
  định nghĩa, không có trạng thái "tĩnh" để bảo toàn.
- **Đổi public API?** Không.
- **Breaking?** Không.
- **Độ khó.** Small (3 dòng).
- **Ưu tiên.** **P0.**

### I-2 — Cổng kiểm tra lẽ ra bắt được I-1 đang mù, và fixture của nó không tồn tại

- **Mô tả.** `package.json` quảng cáo `check:client` và `check:rsc`. Cả hai đều xanh (hoặc không
  chạy) trên một bản build fail ở 3 component.
- **Nguyên nhân.** Hai tầng:
  1. `check-client-boundary.ts` chỉ có 2 rule — R1: dùng React API không tồn tại dưới điều kiện
     `react-server`; R2: import dep client-only không tự khai báo directive. `Tag.tsx` chỉ dùng
     `forwardRef` (hợp lệ dưới `react-server`) và không import dep client nào → **lọt cả hai
     rule**. Chính file script ghi rõ ở dòng 24-26: *"Known gap: passing a locally-defined handler
     into a client primitive is not detectable this way. The Next.js fixture in CI covers it."*
  2. Fixture đó không tồn tại. `check-rsc.ts:16` trỏ `fixtures/next-app`; trong repo không có thư
     mục `fixtures/`, và nó không nằm trong `.gitignore`. Ngoài ra `check:rsc` không nằm trong
     `prebuild` (chỉ có `check:client && check:barrels && check:classes`).
- **Ảnh hưởng tới developer.** Sửa I-1 mà không sửa I-2 thì lỗi sẽ quay lại ở component tiếp
  theo. Đây đúng là kết luận của chính report: *"a process gap rather than a design gap"*.
- **Component.** Toàn bộ (hạ tầng CI).
- **Hướng giải quyết.** Thêm **rule R3** vào `check-client-boundary.ts`: file không có directive
  mà truyền một identifier kiểu function (hoặc arrow literal) vào prop DOM `on*` **không nằm
  trong biểu thức điều kiện** → vi phạm. Song song, khôi phục `fixtures/next-app` và mở rộng nó
  render **mọi export** thay vì một mẫu, đúng như R-15 yêu cầu; đưa `check:rsc` vào CI.
- **Đổi public API?** Không.
- **Breaking?** Không.
- **Độ khó.** Medium — R3 cần parse nhẹ, không thể grep thuần (chính script đã giải thích tại sao).
- **Ưu tiên.** **P0** — đi kèm I-1 trong cùng một PR, nếu không thì I-1 chỉ là vá tạm.

### I-3 — `SelectTrigger` không có focus indicator (WCAG 2.1 SC 2.4.7)

- **Mô tả.** Tab vào trigger: computed style không đổi một pixel. `:focus-visible` match `true`
  nhưng `outline: none`, `box-shadow` trong suốt, border giữ nguyên `rgb(237,237,237)`.
- **Nguyên nhân.** `select/Select.tsx:69` khai báo tường minh
  `focus-visible:ring-0 focus-visible:outline-none`. Thứ duy nhất gần với focus là
  `data-[state=open]:border-brand` — chỉ áp khi menu **mở**, không phải khi trigger được focus.
- **Ảnh hưởng tới developer.** Vi phạm WCAG trên một control form phổ biến, trong thư viện quảng
  cáo "🦾 Accessible by default". User bàn phím mất dấu vị trí ở mỗi select.
- **Component.** `SelectTrigger`.
- **Hướng giải quyết — và đây là chỗ cần cẩn thận về tính nhất quán.** R-16 gợi ý copy `Button`
  (`focus-visible:outline-2 outline-brand`) hoặc `Checkbox` (`ring-2 ring-brand ring-offset-1`).
  Nhưng thư viện đang có **ba** idiom focus khác nhau:

  | Nhóm | Idiom | Nguồn |
  | --- | --- | --- |
  | Field (Input family) | `focus-within:border-ring` | `input/InputFieldShell.tsx:112` |
  | Button | `focus-visible:outline-2 outline-offset-2 outline-brand` | `button/Button.tsx:179` |
  | Checkbox / Toggle | `peer-focus-visible:ring-2 ring-brand ring-offset-1` | `checkbox/Checkbox.tsx:139` |

  `SelectTrigger` là một **field** đứng cạnh `InputText` trong form, nên copy `Button` sẽ tạo ra
  hai field cạnh nhau focus theo hai kiểu khác nhau — sửa a11y bằng cách phá consistency thị giác.
  Đề xuất: dùng idiom field, `focus-visible:border-ring` (thay `ring-0/outline-none`), khớp
  `InputFieldShell` và khớp state "focused" trong Figma. Điều này đủ để đóng SC 2.4.7.
  *Ghi chú tách bạch:* border 1px đổi màu là chỉ báo yếu theo WCAG 2.2 SC 2.4.11 (Focus
  Appearance) — nhưng đó là điểm yếu của **cả nhóm field**, kể cả `InputText` vốn đã PASS
  evaluation. Nếu muốn nâng, nâng cho cả nhóm ở một issue riêng, đừng làm lệch mình `Select`.
- **Đổi public API?** Không — chỉ đổi class.
- **Breaking?** Không (thay đổi thị giác).
- **Độ khó.** Small.
- **Ưu tiên.** **P0.**

### I-4 — `label` và `error` của `SelectTrigger` vô hình với assistive technology

- **Mô tả.** `<label>` không có `for`, trigger không có `id`, không `aria-labelledby`, không
  `aria-invalid`, không `aria-describedby`. Accessible name của combobox rơi về **placeholder**.
  Message lỗi đỏ hiển thị nhưng không được đọc cho ai.
- **Nguyên nhân.** Đợt a11y của release này được làm **theo từng component** chứ không theo một
  contract chung. `InputText` được wire đầy đủ (`input/InputText.tsx:70-84`: `id ?? useId()`,
  `aria-invalid`, `aria-describedby` trỏ tới `inputMessageId(inputId)`); `SelectTrigger` phơi ra
  hai prop trông y hệt (`label`, `error`) mà không nối gì.
- **Ảnh hưởng tới developer.** Đây vừa là lỗi a11y vừa là lỗi **nhất quán API**: hai component
  field cạnh nhau, cùng tên prop, cùng giao diện, hành vi ngầm khác nhau. Developer không có lý
  do gì để nghi ngờ.
- **Component.** `SelectTrigger` (chuẩn tham chiếu: `InputText` + `InputFieldShell`).
- **Hướng giải quyết.** Bê nguyên contract của `InputText`: `const id = props.id ?? useId()`,
  `<label htmlFor={id}>`, và khi có `error` thì `aria-invalid="true"` +
  `aria-describedby={inputMessageId(id)}` trỏ tới `<p>` message (message đã có `role="alert"`).
  Bắt buộc dùng `props.id ?? useId()` chứ không phải `useId()` thuần — nếu không sẽ đè `id` do
  consumer truyền, và đó *sẽ* là breaking.
- **Đổi public API?** Không đổi signature. Có thêm attribute vào DOM output.
- **Breaking?** Không, với điều kiện tôn trọng `id` của consumer như trên.
- **Độ khó.** Small.
- **Ưu tiên.** **P0** — cùng file với I-3, ship chung.

### I-5 — Không có contract a11y dùng chung cho field

- **Mô tả.** Không có cơ chế nào đảm bảo field **tiếp theo** được wire đúng. I-4 là hệ quả trực
  tiếp.
- **Nguyên nhân.** Logic label/error/message sống trong `InputFieldShell`, nhưng `InputFieldShell`
  cố tình không export ra barrel (nó là building block nội bộ của nhóm input), nên `Select` không
  có đường dùng lại — và đã tự viết lại markup label/message của riêng nó.
- **Ảnh hưởng tới developer.** ~~Gián tiếp: mỗi field mới là một cơ hội tái phạm I-4.~~
  **Trực tiếp hơn thế** (audit khi triển khai, 2026-08-06): I-4 đã tái phạm sẵn ở **4 field khác**
  — `InputTextarea`, `InputTag`, `InputFileUpload` render message mà control không trỏ tới, và
  `InputTextFormatting` không có `id` nào cả. Message lỗi hiện trên màn hình, không ai đọc được.
  Xem bảng trong checklist §6.
- **Component.** `InputText`, `InputFieldShell`, `SelectTrigger`, mọi field tương lai.
- **Hướng giải quyết.** Tách một hook nội bộ `useFieldA11y({ id, label, error, helperText })` trả
  về `{ fieldId, messageId, fieldProps, labelProps, messageProps }`, đặt cạnh `InputFieldShell`
  (không export ra barrel). `InputFieldShell` và `SelectTrigger` cùng tiêu thụ nó.
  **Kiểm tra nhất quán:** đây là refactor nội bộ, không thêm khái niệm nào vào public API, nên
  không có rủi ro lệch chuẩn với phần còn lại của thư viện.
- **Đổi public API?** Không.
- **Breaking?** Không.
- **Độ khó.** Medium.
- **Ưu tiên.** P1 — làm **sau** I-3/I-4 chứ không thay thế chúng. Blocker phải được vá trong vài
  giờ; refactor thì không nên nằm trên đường tới hạn.

### I-6a — Documentation ghi "2.0" trên một package phát hành 1.0.15

- **Mô tả.** README và `API.md` mô tả việc đổi tên `Popover` là *"Renamed in `2.0`"* và
  *"This alias is removed in the next minor"*, trên package `1.0.15`. Người đọc không biết mình
  đang đọc docs của version nào.
- **Nguyên nhân.** Docs được viết theo *ý định* release chứ không theo version thực tế được
  publish. Tái hiện: `README.md:331`, `popover/Popover.tsx:19` và `:25` (JSDoc này chảy thẳng vào
  `API.md` vì `API.md` được generate từ source).
- **Ảnh hưởng tới developer.** Làm hỏng độ tin cậy của toàn bộ docs — nếu số version trong docs
  sai thì câu nào khác cũng đáng nghi.
- **Component.** `Popover` (+ README, `API.md` sinh lại).
- **Hướng giải quyết.** Sửa mọi mention "2.0" thành version thực tế mang thay đổi (`1.0.15`), và
  thêm mục ngắn "Migrating from 1.0.14": `<Popover className>` → `<PopoverPanel className>`. Sửa
  JSDoc trong source rồi chạy `pnpm docs:api`, đừng sửa tay `API.md`.
- **Đổi public API?** Không.
- **Breaking?** Không.
- **Độ khó.** Small.
- **Ưu tiên.** **P0** — rẻ nhất trong nhóm P0 và đi cùng chuyến 1.0.16.

### I-6b — Breaking rename đi trong một patch release

- **Mô tả.** `Popover` là panel ở `1.0.14`, là Radix root ở `1.0.15`. Mọi code `1.x` có
  `<Popover className="…">` ngừng compile khi `npm update`.
- **Nguyên nhân.** Bản thân việc đổi tên là **đúng** — nó đóng đúng complaint số 1 về naming của
  report trước và làm root nhất quán với `Dialog`/`Tabs`/`Tooltip`. Vấn đề nằm ở kênh phát hành:
  patch là loại upgrade mà consumer tin chắc không bao giờ vỡ compile.
- **Ảnh hưởng tới developer.** Mất niềm tin vào `^1.0.x` — hệ quả nặng hơn chính cái rename.
- **Component.** `Popover`.
- **Hướng giải quyết.** Đây là **quyết định của người, không phải của mình** — hai nhánh, cả hai
  đều hợp lệ:
  - *Giữ rename:* re-tag `1.1.0` để tín hiệu semver khớp thay đổi, cộng với I-6a.
  - *Hoãn sang major:* `1.0.16` trả `Popover` về panel, giữ `PopoverRoot` là root cho nhánh `1.x`,
    dời rename vào `2.0.0`.

  Khuyến nghị: **giữ rename + re-tag `1.1.0`**. `1.0.15` đã ra ngoài rồi; rollback lại lần nữa là
  breaking change **thứ hai** cho những ai đã nâng — tổng thiệt hại lớn hơn.
- **Đổi public API?** Không thêm (đã xảy ra).
- **Breaking?** Đã breaking; lựa chọn ở đây là *thừa nhận* hay *đảo ngược*.
- **Độ khó.** Small (re-tag) hoặc Medium (revert).
- **Ưu tiên.** P1 (quyết định) — nhưng phải chốt **trước khi** ship 1.0.16 vì nó quyết định số
  version trên nhãn.

### I-7 — Lỗi TypeScript khi migrate `Popover` không nêu cách sửa

- **Mô tả.** Consumer `1.x` nhận `TS2322: Type '{ children: Element[]; className: string; }' is
  not assignable to type 'IntrinsicAttributes & PopoverProps'` — biết `className` không hợp lệ,
  không biết element mình cần giờ tên `PopoverPanel`.
- **Nguyên nhân.** Kiểu mới đơn giản là không có `className`, nên compiler chỉ báo được triệu
  chứng.
- **Ảnh hưởng tới developer.** Mỗi người migrate phải tự đi tìm README. README có giải thích;
  compiler thì không.
- **Component.** `Popover`.
- **Hướng giải quyết.** Thêm vào `PopoverProps` một field `className?: never` kèm JSDoc
  `@deprecated className moved to PopoverPanel`. Hover/quick-info sẽ hiện câu đó ngay tại chỗ lỗi.
  **Kiểm tra nhất quán:** `className?: never` là idiom **mới** trong thư viện này — chưa component
  nào dùng. Cái giá là một quy ước lạ; cái được là thông điệp migrate đúng chỗ. Vì nó chỉ áp cho
  một cửa migrate duy nhất và sẽ biến mất khi bỏ alias, mình đánh giá là chấp nhận được — nhưng
  **không** nên nhân rộng idiom này sang component khác.
- **Đổi public API?** Có, nhưng chỉ theo hướng làm rõ một thứ vốn đã không hợp lệ.
- **Breaking?** Không — code đang fail vẫn fail, chỉ khác message.
- **Độ khó.** Small.
- **Ưu tiên.** P1.

### I-8 — Ba trong năm nhóm component trùng không có `@deprecated` trong types

- **Mô tả.** Bảng "Picking between similar names" trong README là phần prose tốt nhất của bộ
  docs, nhưng developer làm việc bằng autocomplete không thấy gì. Chỉ `PopoverRoot` và `Input`
  mang `@deprecated`.
- **Nguyên nhân.** Guidance được viết ở tầng docs, không được đẩy xuống tầng types.
- **Ảnh hưởng tới developer.** Ai gõ `Tabs` và chọn cái đầu tiên autocomplete gợi ý sẽ nhận một
  component "paints itself with raw `slate-*` classes, so it ignores your theme and your dark
  mode" — nguyên văn README — mà không có cảnh báo nào.
- **Component.** `Tabs`/`TabsList`/`TabsTrigger`/`TabsContent`, `Navigation`; và nhóm
  `Dialog`/`Modal`/`Popup`/`BottomSheet`, `Toast`/`Snackbar`.
- **Hướng giải quyết.** `@deprecated` cho `Tabs` family và `Navigation` (chúng thực sự bị thay
  thế). Với hai nhóm còn lại **không** dùng `@deprecated` — chúng là bốn thiết kế khác nhau, không
  phải bốn phiên bản; dùng `@see` một dòng trỏ tới bảng README là đúng ngữ nghĩa hơn.
  Cùng lúc, `API.md` sẽ tự cập nhật vì được generate từ JSDoc.
- **Đổi public API?** Không (chỉ JSDoc).
- **Breaking?** Về compile: không. **Soft breaking:** consumer bật `eslint-plugin-deprecation` ở
  mức `error` sẽ đỏ CI khi nâng. Nên ghi vào release note.
- **Độ khó.** Small.
- **Ưu tiên.** P1.

### I-9 — Lỗi composition của `Tab` gọi tên export không tồn tại

- **Mô tả.** `<TabTrigger>` mồ côi ném `` `TabsTrigger` must be used within `Tabs` `` — không tên
  nào là thứ developer đã gõ, cũng không phải thứ README bảo dùng. Tệ hơn: `Tabs` **là** một
  export thật của thư viện — cái legacy mà README bảo tránh — nên message đọc như lời khuyên
  chuyển sang nhóm deprecated.
- **Nguyên nhân.** Message do Radix phát ra từ context scope nội bộ của nó. `tab/Tab.tsx` bọc
  `RadixTabs.Root/List/Trigger` trực tiếp và chỉ giữ một context của riêng mình
  (`TabTypeContext`, dòng 82) cho việc tô style — không có guard nào chạy trước Radix.
- **Ảnh hưởng tới developer.** Ba nhóm anh em đều đã đúng
  (`` `SelectItem` must be used within `Select` ``), làm cái sai này càng nổi.
- **Component.** `Tab`, `TabList`, `TabTrigger`, `TabContent`.
- **Hướng giải quyết.** ⚠️ **R-19 đề xuất "pass the wrapper's own display names into the Radix
  context factory" — cách này không tồn tại.** `createContextScope` của Radix không nhận tên hiển
  thị từ ngoài; chuỗi lỗi là nội bộ của Radix. Cách khả thi: thêm một context nhỏ do thư viện sở
  hữu (`TabRootContext`) do `Tab` cung cấp, và cho `TabList`/`TabTrigger`/`TabContent` throw
  trước với đúng tên của thư viện. Đây chính là pattern `Select` đang dùng và đã cho message đúng.
- **Đổi public API?** Không.
- **Breaking?** Không.
- **Độ khó.** Medium (không phải Small như R-19 ước lượng, vì phải tự dựng guard chứ không cấu
  hình được Radix).
- **Ưu tiên.** P1.

### I-10 — Không có một dòng tài liệu nào về Next.js / Server Components

- **Mô tả.** Phần Requirements của README nói về React, Tailwind, `@types/react`, Node, ESM.
  Không nhắc App Router, `"use client"`, hay component nào là client-only.
- **Nguyên nhân.** Phần kỹ thuật **đã làm rồi** — 35 file mang banner, `package.json` có
  `check:client`/`check:rsc` — nhưng không ai viết lại kết quả đó ra docs.
- **Ảnh hưởng tới developer.** Build failure đầu tiên của một Next.js user là một message về
  "Client Component props" không có bất kỳ đường dẫn nào tới nguyên nhân. Đây là nửa
  "discoverability" của I-1 và nó vẫn cần thiết **kể cả sau khi** I-1 được vá.
- **Component.** README (áp dụng toàn thư viện).
- **Hướng giải quyết.** Thêm section "Next.js / React Server Components" theo đúng bản nháp
  R-20: component nào tự mang boundary, load stylesheet ở `app/globals.css` thế nào, và
  component interactive dùng trong file `"use client"` của bạn là bình thường. Sau khi I-1 xong,
  section này đúng tuyệt đối, không cần bảng ngoại lệ nào để bảo trì.
- **Đổi public API?** Không.
- **Breaking?** Không.
- **Độ khó.** Small.
- **Ưu tiên.** P1.

### I-11 — 17.36 MB icons được cài cho mọi consumer

- **Mô tả.** `dist/icons` chiếm 97% package (8,208 file). Dự án không import icon nào vẫn tải và
  lưu đủ 17.36 MB, và mọi CI cache đều gánh.
- **Nguyên nhân.** Thiết kế **đúng** (subpath riêng, ngoài barrel, không xuất hiện trong bundle
  `Button`-only) — nhưng đúng ở tầng bundle, không ở tầng install.
- **Ảnh hưởng tới developer.** Install và CI cache chậm; không ảnh hưởng bundle production.
  Evaluation xếp là "PASS with penalty", không phải failure.
- **Component.** Toàn bộ package.
- **Hướng giải quyết.** Publish `@echoit/itui.icons`, giữ `./icons` re-export nó dưới dạng
  optional peer trong ít nhất một minor để không ai vỡ import. Kỳ vọng: 17.85 MB → ~500 kB.
- **Đổi public API?** Có — `./icons` đổi từ nội dung sang alias.
- **Breaking?** Có nếu bỏ `./icons`; **không** nếu giữ alias một minor rồi mới bỏ ở major.
- **Độ khó.** **Large** — cần repo/pipeline publish mới, versioning song song, cập nhật docs.
- **Ưu tiên.** P2.

### I-13 — Nhiều prop description trống trong `API.md`

- **Mô tả.** Một tỉ lệ lớn dòng đọc `—` ở cột Description, kể cả trên component dùng nhiều nhất:
  `Button.variant`, `Button.size`, `TableRow.selected`.
- **Nguyên nhân.** `API.md` được generate từ source, nên chỗ trống là **thiếu JSDoc**, không phải
  lỗi generator.
- **Ảnh hưởng tới developer.** Reference trả lời "giá trị nào hợp lệ" nhưng không trả lời "khi
  nào thì dùng `alternative` thay vì `secondary`".
- **Component.** Ưu tiên `Button`, `Table`, `Card`, `Dialog`, nhóm `Input`.
- **Hướng giải quyết.** Viết JSDoc trong source theo đúng chuẩn mà chính repo đã đạt ở vài chỗ —
  `PopoverItem.asMenuItem`, `SelectTrigger.placeholder`, `InputText.boxClassName` đều giải thích
  *khi nào nên với tay tới prop này*. Nâng top-20 component lên mức đó.
- **Đổi public API?** Không.
- **Breaking?** Không.
- **Độ khó.** Medium (khối lượng, không phải độ phức tạp).
- **Ưu tiên.** P2.

### I-14 — Không có tài liệu accessibility (gồm cả yêu cầu `TooltipProvider`)

- **Mô tả.** Không có bảng phím tắt, không có ghi chú ARIA, không có tuyên bố component nào quản
  lý focus. Kèm theo: `Tooltip` bắt buộc có `TooltipProvider` tổ tiên còn `Popover`/`Dialog` thì
  không — chưa được viết ở đâu ngoài runtime error.
- **Nguyên nhân.** Hành vi a11y mới đủ tốt để đáng quảng cáo từ release này; docs chưa theo kịp.
- **Ảnh hưởng tới developer.** Không biết phần nào thư viện lo, phần nào mình phải tự lo.
- **Component.** Toàn thư viện; hai mục "load-bearing": `Toggle` (chưa có `label`, xem I-15) và
  `Tooltip`/`TooltipProvider`.
- **Hướng giải quyết.** Mỗi component: element nào nhận focus, mô hình bàn phím, ARIA nào component
  sở hữu vs ARIA nào consumer phải cấp.
- **Đổi public API?** Không.
- **Breaking?** Không.
- **Độ khó.** Medium.
- **Ưu tiên.** P2.

### I-15 — `Toggle` không có prop `label`

- **Mô tả.** Gắn nhãn cho `Toggle` bắt buộc phải tự viết `aria-label`, khác `Checkbox` (có
  `label`) và `Radio` (dùng children).
- **Nguyên nhân.** `ToggleProps` chỉ mở rộng `ComponentPropsWithoutRef<RadixSwitch.Root>` và thêm
  `size`.
- **Ảnh hưởng tới developer.** Dễ quên → switch không nhãn, và không có gì nhắc.
- **Component.** `Toggle`.
- **Hướng giải quyết.** Thêm `label?: ReactNode`, wire y hệt `Checkbox`.
  **Kiểm tra nhất quán:** `Checkbox` (`checkbox/Checkbox.tsx:49`) đã có đúng
  `label?: ReactNode` và bọc bằng `<label>`; `InputText` cũng có `label`. Thêm vào `Toggle` là
  **kéo về chuẩn**, không tạo chuẩn mới. ✓
  Cảnh báo triển khai: chỉ bọc wrapper `<label>` **khi có** prop `label`, để DOM của người đang
  style `Toggle` qua `className` không đổi.
- **Đổi public API?** Có — additive.
- **Breaking?** Không, với điều kiện wrapper là opt-in như trên.
- **Độ khó.** Small.
- **Ưu tiên.** P2.

### I-16 — Lỗi `require()` không nói package là ESM-only

- **Mô tả.** `require('@echoit/itui.css')` → `ERR_PACKAGE_PATH_NOT_EXPORTED: No "exports" main
  defined`, đọc như lỗi đóng gói. Thực ra package **có** định nghĩa `.`, chỉ dưới điều kiện
  `import`.
- **Nguyên nhân.** ESM-only là cố ý và có ghi trong README; runtime thì không nói.
- **Ảnh hưởng tới developer.** Consumer CJS đi tìm bug đóng gói không tồn tại.
- **Component.** `package.json` (`exports`).
- **Hướng giải quyết.** Stub CJS nhỏ dưới điều kiện `require`, throw
  `'@echoit/itui.css is ESM-only. Use `import`, or `await import()` from CommonJS.'`
- **Đổi public API?** Có — thêm một điều kiện export.
- **Breaking?** Không (đường này hiện đang throw sẵn).
- **Độ khó.** Small.
- **Ưu tiên.** P2.

### I-17 — `API.md` / `TOKENS.md` không có trong tarball

- **Mô tả.** `files: ["dist"]` nên consumer offline chỉ có types.
- **Nguyên nhân.** Tối ưu kích thước tarball; README có nói rõ.
- **Ảnh hưởng tới developer.** Không đọc được reference khi không có mạng / air-gapped.
- **Hướng giải quyết.** Thêm `API.md`, `TOKENS.md` vào `files` — vài trăm kB so với 17.85 MB hiện
  tại, chi phí gần như bằng 0.
- **Đổi public API?** Không. **Breaking?** Không. **Độ khó.** Small. **Ưu tiên.** P2.

### I-19 — `Dialog` không set `aria-modal`

- **Mô tả.** Sibling nền được `aria-hidden` thay vì dialog mang `aria-modal`.
- **Nguyên nhân.** Hành vi mặc định của Radix; `aria-hidden` đạt kết quả thực dụng tương đương.
- **Ảnh hưởng tới developer.** Gần như không. Chính evaluation gọi đây là "nit rather than a
  defect" và vẫn cho S05 điểm 9.
- **Hướng giải quyết.** Kiểm chứng lại trên bản mới trước; nếu vẫn thiếu thì thêm
  `aria-modal="true"` vào `DialogContent` — một dòng.
- **Đổi public API?** Không. **Breaking?** Không. **Độ khó.** Small. **Ưu tiên.** P3.

### I-20 — Không có docs site có thể search

- **Mô tả.** `itui.echoit.co.kr` vẫn fail DNS. Reference là một file Markdown 2,743 dòng trên
  GitHub, không search được. Storybook chỉ chạy được khi clone repo.
- **Nguyên nhân.** Chưa có hạ tầng hosting.
- **Ảnh hưởng tới developer.** Đây là khoảng cách lớn nhất còn lại so với MUI, theo đúng §15 của
  report.
- **Hướng giải quyết.** Deploy Storybook (đã có sẵn trong `apps/storybook`) — rẻ hơn nhiều so với
  dựng docs site riêng, và giải quyết luôn mục "Storybook chỉ reachable qua clone".
- **Đổi public API?** Không. **Breaking?** Không. **Độ khó.** Large. **Ưu tiên.** P3.

### I-22 — Đưa mọi icon trong `src/components` về bộ ITUI weight `Regular`

- **Mô tả.** Mục tiêu: mọi component trong `src/components` dùng icon từ `src/icons/ITUI` ở weight
  **Regular**, thay cho hai nguồn lệch chuẩn đang tồn tại — SVG tự vẽ inline, và các biến thể
  `Fill`.
- **Hiện trạng (đếm trên source).** 25 file đã import icon từ `icons/ITUI`, và **đa số đã dùng
  Regular** (`CaretDownRegularIcon` 16 chỗ, `CaretRightRegularIcon` 15, `XRegularIcon` 8,
  `CheckRegularIcon` 8…). Phần lệch chuẩn còn lại gồm hai nhóm: **8 file** dùng biến thể `Fill`,
  và **9 file** tự vẽ inline SVG cho icon. Không file nào dùng `Light`/`Thin`/`Duotone`. Mọi icon
  đích nêu dưới đây đều đã có file `*RegularIcon.tsx` trong repo.

**Nhóm A — đổi biến thể `Fill` → `Regular`**

| File | Icon hiện tại | Icon đích |
| --- | --- | --- |
| `dropdown-menu/dropdown-menu.tsx:133` | `CircleFillIcon` | ⚠️ xem "Ngoại lệ" |
| `input/InputFileUpload.tsx:181` | `CheckCircleFillIcon` | `CheckCircleRegularIcon` |
| `input/InputFileUpload.tsx:238` | `WarningFillIcon` | `WarningRegularIcon` |
| `input/InputSearch.tsx:101` | `XCircleFillIcon` | `XCircleRegularIcon` |
| `lnb/Lnb.tsx:493` | `UserFillIcon` | `UserRegularIcon` |
| `modals/resource-modal.tsx:285` | `FolderFillIcon` | `FolderRegularIcon` |
| `progress/Progress.tsx:167,170` | `CheckCircleFillIcon`, `XCircleFillIcon` | `CheckCircleRegularIcon`, `XCircleRegularIcon` |
| `rating/Rating.tsx:85,97` | `StarFillIcon` ×2 | ⚠️ xem "Ngoại lệ" |
| `scroll/Scroll.tsx:39,101-106` | `CaretUp/Down/Left/RightFillIcon` | ⚠️ **ngoại lệ 4** — xem dưới |

**Nhóm B — thay SVG tự vẽ bằng icon ITUI Regular**

| File | Component nội bộ | Icon đích |
| --- | --- | --- |
| `accordion/Accordion.tsx:110` | `ChevronIcon` | `CaretDownRegularIcon` (đúng idiom `Select`/`InputDropdown`) |
| `avatar/Avatar.tsx:122` | `AvatarPlaceholder` | ⚠️ **ngoại lệ 5** — xem dưới |
| `card/CardTemplates.tsx:25` | `ImagePlaceholder` | `ImageRegularIcon` |
| `card/CardTemplates.tsx:41` | `CheckIcon` | `CheckRegularIcon` |
| `checkbox/Checkbox.tsx:73` | `CheckIcon` | `CheckRegularIcon` |
| `chip/Chip.tsx:129` | `XIcon` | `XRegularIcon` |
| `pagination/Pagination.tsx:67` | `CaretIcon` (có prop `double`) | `CaretLeft/RightRegularIcon` + `CaretDoubleLeft/RightRegularIcon` |
| `pagination/Pagination.tsx:84` | `EllipsisIcon` | `DotsThreeRegularIcon` |
| `popup/Popup.tsx:53` | `XIcon` | `XRegularIcon` |
| `popup/Popup.tsx:61` | `ImagePlaceholder` | `ImageRegularIcon` |
| `tag/Tag.tsx:90` | `XIcon` | `XRegularIcon` |
| `empty/Empty.tsx:40,65` | `PackageOpenIcon`, `SearchRemoveIcon` | ⚠️ xem "Ngoại lệ" |

- **Ngoại lệ — chốt trước khi code, đổi máy móc sẽ hỏng ý nghĩa.**
  1. **`Rating`** (`rating/Rating.tsx:85,97`) — `StarFillIcon` được dùng **hai lần chồng nhau**:
     một ngôi sao nền màu `icon-neutral-disabled` và một bản clip theo `w-1/2`/`w-full` cho phần
     đã chấm. Đổi cả hai sang Regular thì sao đầy và sao rỗng thành **giống hệt nhau** — mất
     hoàn toàn thông tin của component. Nếu vẫn muốn Regular, phải đổi mô hình: nền
     `StarRegularIcon`, phần fill giữ `StarFillIcon`.
  2. **`DropdownMenuRadioItem`** (`dropdown-menu/dropdown-menu.tsx:133`) — `CircleFillIcon` ở
     `size-2` chính là **chấm tròn đánh dấu mục đang chọn**. Regular là vòng tròn rỗng 8px,
     gần như vô hình và mất nghĩa "selected". Đề nghị **giữ `Fill`**. (Ghi chú: `dropdown-menu`
     nằm trong nhóm legacy dùng raw `slate-*` — cân nhắc có đáng đụng vào không.)
  3. **`Empty`** (`empty/Empty.tsx:40,65`) — hai SVG này là **illustration 60×60 lấy thẳng từ
     Figma** (`package-open` node 28183:1007, `search-remove` node 28183:1010), vẽ bằng stroke
     `#9E9E9E` width 2. Bộ ITUI **không có** `package-open` lẫn `search-remove`; thay bằng
     `PackageRegularIcon`/`MagnifyingGlassMinusRegularIcon` là đổi sang glyph khác và lệch Figma.
     Đề nghị **giữ nguyên**, hoặc xin asset mới từ design.
  4. **`Scroll`** (`scroll/Scroll.tsx`) — token comment của chính file ghi: *"Figma's exported
     vector is the Phosphor **Fill** caret — a solid 11×6 triangle in a 16×16 box — which is
     exactly `CaretUpFillIcon`'s path at half scale"*. Đây là asset Figma chứ không phải một lựa
     chọn weight; đổi sang Regular là lệch design. Đề nghị **giữ `Fill`**. *(Phát hiện khi triển
     khai 2026-08-06 — hai bảng trên dựng bằng grep `Fill`/`<svg>` nên không tách được "icon chọn
     theo weight" khỏi "artwork export từ Figma".)*
  5. **`Avatar`** (`avatar/Avatar.tsx`) — `AvatarPlaceholder` là **mask geometry export từ Figma**,
     re-express trong hộp 72×72 của chính avatar: đầu + vai, mép dưới vai nằm ở y=78.5 tức ngoài
     hình tròn, nên bị bo tròn cắt phẳng. `UserRegularIcon` là glyph khác và mất hiệu ứng cắt đó.
     Đề nghị **giữ nguyên**.
  6. **Không phải icon, không nằm trong phạm vi:** `bubble/Bubble.tsx:32` (`BubbleTail` — hình
     trang trí đuôi bong bóng) và `progress/Progress.tsx:236` (vòng tròn SVG của progress ring).
- **Lưu ý triển khai.**
  - Icon ITUI là **path `fill`**, không phải stroke — mọi class màu dạng `text-*` sẽ **không ăn**
    nếu thiếu `[&_path]:fill-current`. Repo đã có tiền lệ đúng ở `rating/Rating.tsx:97` và
    `dropdown-menu.tsx:133`; theo đúng pattern đó.
  - SVG inline hiện tại vẽ bằng `stroke` width 1.5–2 và scale theo `className`; icon ITUI mặc định
    **32px**, nên chỗ nào thay cũng phải set class kích thước tường minh (`size-*`/`h-icon-*`).
    Đây là thay đổi thị giác thật sự → **bắt buộc QA trên Storybook**, không chỉ nhìn diff.
  - Import theo **đường dẫn từng file** (`../../icons/ITUI/<folder>/<Name>RegularIcon`) như các
    component hiện có, không import từ barrel `icons/index.ts`. Tên folder không phải lúc nào cũng
    kebab hoá tên icon: `XCircle*` nằm ở **`icons/ITUI/xcircle`**, không phải `x-circle`.
  - Icon ITUI **không** có `aria-hidden` sẵn, còn mọi SVG inline đang bị thay **đều có**. Thiếu nó
    là phơi icon trang trí ra cho screen reader — phải thêm tay ở từng chỗ thay.
- **Kiểm tra nhất quán.** Regular đã là weight áp đảo trong thư viện (hơn 90 lượt dùng so với
  ~30 lượt `Fill`), nên đây là **kéo phần còn lại về chuẩn sẵn có**, không dựng chuẩn mới. ✓
  Ba ngoại lệ ở trên là chỗ `Fill` mang **ngữ nghĩa** (đầy/rỗng, đã chọn) chứ không phải chỗ chọn
  weight tuỳ tiện.
- **Đổi public API?** Không.
- **Breaking?** Không về compile. Có thay đổi thị giác trên ~17 component → ghi vào release note.
- **Độ khó.** Medium (khối lượng + QA thị giác, không phải độ phức tạp).
- **Ưu tiên.** P2.

---

## 3. Kiểm tra nhất quán cho mọi thay đổi API được đề xuất

Theo đúng yêu cầu: trước khi đề xuất đổi API, đối chiếu với phần còn lại của thư viện.

| Đề xuất | Tiền lệ trong thư viện | Kết luận |
| --- | --- | --- |
| I-4: `id ?? useId()` + `aria-*` cho `SelectTrigger` | `InputText` đã làm đúng như vậy | ✅ **Tăng** nhất quán |
| I-3: focus `border-ring` cho `SelectTrigger` | Nhóm field dùng `focus-within:border-ring`; Button/Checkbox dùng idiom khác | ✅ Chọn idiom **field** — copy Button sẽ làm hai field cạnh nhau focus khác kiểu |
| I-15: `label` cho `Toggle` | `Checkbox.label?: ReactNode` | ✅ **Tăng** nhất quán |
| I-9: guard context riêng cho `Tab` | `Select`/`Popover`/`Tooltip` đều cho message đúng tên | ✅ **Tăng** nhất quán |
| I-8: `@deprecated` cho `Tabs`/`Navigation` | `Input`, `PopoverRoot` đã có | ✅ **Tăng** nhất quán |
| I-8: `@see` (không `@deprecated`) cho nhóm Dialog/Modal/Popup/BottomSheet | — | ✅ Đúng ngữ nghĩa: bốn thiết kế, không phải bốn phiên bản |
| I-7: `className?: never` trên `PopoverProps` | **Không có tiền lệ** | ⚠️ Idiom mới — chấp nhận cho **một** cửa migrate, không nhân rộng |
| I-16: điều kiện `require` throw | — | ✅ Không đụng bề mặt ESM |
| I-11: `./icons` thành alias | — | ⚠️ Breaking nếu bỏ ngay; giữ alias ≥1 minor |

---

## 4. Recommendation đề nghị **không** thực hiện

### ❌ R-25 / R-14 — "Ngừng export token showcase như component"

**Bác bỏ: tiền đề sai.** Report mô tả `colors`, `radius`, `shadow`, `spacing`, `typography`, `grid`
là "token showcase / Storybook aid". Đọc source thì không phải:

- `radius/Radius.tsx:98-115` — `forwardRef`, `asChild` qua `Slot`, `data-slot="radius"`,
  `cn(radiusClass[radius], className)`. Đây là một primitive áp token, đúng shape với phần còn
  lại của thư viện.
- `Colors`, `Shadow`, `Spacing` cùng dạng; `Typography` là component text thật sự (`TypographyVariant`,
  `TypographyWeight`); `Grid`/`GridItem` là layout thật.
- Các module này còn export **token map thật** mà consumer có thể cần: `COLOR_HEX`, `RADIUS_PX`,
  `SHADOW_OFFSET`, `SPACING_PX`, `TYPOGRAPHY_SPEC`, `typographyClass`.

Gỡ chúng khỏi entry chính sẽ **xoá component và API hợp lệ** để chữa một vấn đề không tồn tại.
Nhiều khả năng evaluator kết luận từ tên section trong `API.md` chứ không đọc file. Ứng viên duy
nhất đáng bàn là `GridOverlay` (overlay debug lưới) — và nó quá nhỏ để đáng một breaking change.

**Đề xuất thay thế (đúng theo nguyên tắc "docs trước, API sau"):** thêm một câu JSDoc cho mỗi
component này nói rõ nó là primitive áp token. Chi phí vài phút, xoá đúng cái hiểu nhầm đã sinh ra
recommendation này, và không breaking ai.

### ❌ F-21 / Top10#10 — Thay đổi code cho đường subpath import không style

Đây là **chính xác trường hợp mà docs thắng API**. Đường documented (`import` từ barrel) đã không
thể fail: `dist/index.js` mở đầu bằng `import './index.css'`. Chỉ còn subpath, và subpath tồn tại
để đánh đổi lấy 22 module dev thay vì 1,511 — bơm CSS vào đó sẽ **phá chính lý do nó tồn tại**.
README đã cảnh báo bằng callout ⚠️ kèm cách sửa. Evaluation cũng tự hạ nó xuống P2 và gọi là
"a documented trade-off, not a trap". **Không đổi code. Giữ nguyên docs.**

### ❌ §9 — Thống nhất `Checkbox.label` với `Radio` children

`Radio` là radio-group item của Radix, nhận nhãn qua children — đó là idiom chuẩn của Radix và
evaluation cũng đã tự xếp "Unchanged, minor". Ép hai component về một kiểu là breaking change trên
một trong hai, đổi lấy lợi ích thẩm mỹ. **Xử lý bằng docs** trong bảng a11y ở I-14.

### ⚠️ R-19 — Cách sửa được đề xuất không khả thi

Giữ **mục tiêu** (message phải gọi đúng `TabTrigger`/`Tab`), bỏ **phương pháp** ("pass display
names into the Radix context factory" — API đó không tồn tại). Xem I-9 để biết cách làm được.

---

## 5. Roadmap

### Phase 1 — Critical fixes → `1.0.16` (hoặc `1.1.0`, xem I-6b)

Phải xong trước bản release kế tiếp. Ước lượng: **1 ngày**.

| # | Issue | Loại | Effort | Breaking |
| --- | --- | --- | --- | --- |
| 1 | I-1 — gate `onKeyDown` ở `Tag`/`Chip`, `"use client"` cho `Pagination` | SSR | S | Không |
| 2 | I-2 — rule R3 cho `check:client` + khôi phục `fixtures/next-app`, đưa `check:rsc` vào CI | Tooling | M | Không |
| 3 | I-3 — focus indicator cho `SelectTrigger` theo idiom field | A11y | S | Không |
| 4 | I-4 — wire `label`/`error` của `SelectTrigger` (`id ?? useId()`) | A11y | S | Không |
| 5 | I-6a — sửa mọi mention "2.0" + note migrate `Popover` | Docs | S | Không |

**Cổng ra:** `next build` xanh với **mọi** export trong RSC; `Select` có accessible name = `label`,
có `aria-invalid` khi `error`, và style focus khác style unfocused; không còn chuỗi "2.0" nào
trong README/`API.md`.

### Phase 2 — DX improvements → `1.1.0`

| # | Issue | Loại | Effort |
| --- | --- | --- | --- |
| 6 | I-10 — section "Next.js / React Server Components" trong README | Docs | S |
| 7 | I-8 — `@deprecated` cho `Tabs` family + `Navigation`; `@see` cho hai nhóm còn lại | TS/Docs | S |
| 8 | I-9 — guard context riêng cho `Tab` để message gọi đúng tên | Error UX | M |
| 9 | I-7 — `className?: never` + JSDoc trỏ `PopoverPanel` | TS | S |
| 10 | I-16 — CJS stub throw thông báo ESM-only | Packaging | S |

### Phase 3 — API consistency → `1.1.0` / `1.2.0`

| # | Issue | Loại | Effort |
| --- | --- | --- | --- |
| 11 | I-5 — tách `useFieldA11y`, cho `InputFieldShell` + `SelectTrigger` cùng dùng | API Design | M |
| 12 | I-15 — `label?: ReactNode` cho `Toggle` theo chuẩn `Checkbox` | Missing Feature | S |
| 13 | I-6b — chốt chính sách semver cho rename `Popover` (re-tag `1.1.0`) | Release | S |
| 14 | I-22 — đưa icon trong `/components` về ITUI `Regular` (trừ 3 ngoại lệ đã nêu) | Design Consistency | M |

### Phase 4 — Documentation → `1.2.0`

| # | Issue | Loại | Effort |
| --- | --- | --- | --- |
| 15 | I-17 — thêm `API.md`/`TOKENS.md` vào `files` | Docs | S |
| 16 | I-13 — điền JSDoc cho top-20 component (`Button`, `Table`, `Card`, `Dialog`, `Input`) | Docs | M |
| 17 | I-14 — trang a11y: focus, bàn phím, ARIA ai sở hữu; gồm `TooltipProvider` và `Checkbox` vs `Radio` | Docs | M |
| 18 | JSDoc một dòng cho `Radius`/`Colors`/`Shadow`/`Spacing`/`Typography` (thay cho R-25) | Docs | S |

### Phase 5 — Nice to have

| # | Issue | Loại | Effort |
| --- | --- | --- | --- |
| 19 | I-11 — tách `@echoit/itui.icons`, `./icons` giữ alias ≥1 minor | Performance | L |
| 20 | I-20 — deploy Storybook làm reference search được | Docs | L |
| 21 | I-19 — kiểm lại rồi thêm `aria-modal` cho `DialogContent` | A11y | S |

---

## 6. Implementation Roadmap — checklist theo đúng thứ tự thực hiện

### Phase 1 — trước `1.1.0` ✅ **xong 2026-08-06**

- [x] **Chốt I-6b trước tiên** — **quyết định: giữ rename, phát hành `1.1.0`.** `package.json`
      đã bump `1.0.15` → `1.1.0`; docs ghi rõ rename landing ở `1.0.15` còn `1.1.0` là bản
      phát tín hiệu semver đúng. Không đụng code `Popover`.
- [x] `tag/Tag.tsx:155` → `onKeyDown={isInteractive ? handleKeyDown : undefined}`
- [x] `chip/Chip.tsx:203` → tương tự
- [x] `pagination/Pagination.tsx` → thêm banner `"use client"` (nút phân trang luôn interactive)
- [x] Thêm rule R3 vào `scripts/check-client-boundary.ts` — dựng trên TS AST, không grep. Miễn
      trừ **chỉ khi** guard dựa trên prop handler (`onClick`/`onClose`…), thứ Server Component
      không thể truyền; guard kiểu `showEdges &&` vẫn bị bắt. `??`/`||` không được coi là guard.
- [x] Xác nhận R3 **fail** trên đúng ba file trước khi vá (`Tag` 1 site, `Chip` 1, `Pagination` 5),
      **pass** sau khi vá; thêm `pnpm check:client --self-test` (7 case) và đưa vào CI
- [x] Khôi phục `fixtures/` — **bị xoá nhầm ở commit `02248351`** (mất cả `next-app` *và*
      `vite-app`, nên job `bundle-size` cũng hỏng theo). Thêm route `/all` render **mọi** export
- [x] `check:rsc` **vốn đã có** trong CI (`ci.yml`, job `rsc-fixture`) — chỉ thiếu fixture
- [x] `select/Select.tsx:69` → `focus-visible:border-ring`, bỏ luôn cặp `data-[state=closed]:*`
      thừa (nó chỉ lặp lại màu base và làm mờ luật nào thắng lúc focus)
- [x] `select/Select.tsx` → `id ?? useId()`, `<label htmlFor>`, `aria-invalid`,
      `aria-describedby` trỏ `inputMessageId()` (dùng chung hàm với `InputText`, không chép lại)
- [x] Verify trên output thật của fixture: `<label id="X-label" for="X">` + trigger
      `aria-labelledby="X-label"` / `aria-invalid="true"` / `aria-describedby="X-message"`;
      CSS sinh ra `.focus-visible\:border-ring:focus-visible{border-color:var(--ring)}` (#009ce0,
      specificity 0,2,0) thắng `.border-input` (#ededed, 0,1,0) → focused ≠ unfocused
- [x] Sửa `README.md:331` + `popover/Popover.tsx` — bỏ "2.0", thêm block "Migrating from 1.0.14"
      kèm diff `<Popover className>` → `<PopoverPanel className>`
- [x] `pnpm docs:api` (490 exports, 56 module) — `check:docs` xanh
- [x] Chạy đủ gate: `check:client` (+self-test), `check:barrels`, `check:classes` (+self-test),
      `check:docs`, `check:rsc`, `check:bundle` — **tất cả xanh**. Còn lại: release do người quyết

**Phát hiện thêm khi làm (chưa xử lý, không thuộc Phase 1):**

- `SelectTrigger` destructure `disabled` nhưng **không** forward xuống `SelectPrimitive.Trigger`:
  trigger disabled chỉ mất `pointer-events`, vẫn focus được bằng bàn phím và vẫn mở được menu.
- `pnpm test` không có file test nào (`vitest` exit 1). CI không chạy nó nên không đỏ.
- `aria-labelledby` phải thêm ngoài `htmlFor`: Radix render trigger là `<button role="combobox">`,
  mà combobox không lấy tên từ nội dung và `<label for>` không được mọi AT tính cho `<button>`.

### Phase 2 — `1.1.0` ✅ **xong 2026-08-06**

- [x] Thêm section "Next.js / React Server Components" vào README — đặt giữa Quick Start và
      Components. Bản nháp R-20 giữ phần khung, viết thêm hai mục "cái này **không** làm hộ bạn"
      (file của bạn vẫn cần `"use client"` khi tự viết handler; subpath import vẫn không kèm CSS)
      và một câu ghi rõ boundary là **build gate** (`check:client` + `check:rsc`), không phải quy ước
- [x] `@deprecated` cho `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` — mỗi cái trỏ đúng sang
      `Tab`/`TabList`/`TabTrigger`/`TabContent`, kèm block comment lý do (raw `slate-*`)
- [x] `@deprecated` cho `Navigation` V1 — export thực tế là `TopNavigation` /
      `BottomNavigation` / `BottomNavigationItem` (không có export tên `Navigation`), trỏ sang
      bộ `*V2`. **Đã chốt với user: vẫn deprecate**, dù `apps/web/screen/main/main-layout.tsx`
      đang dùng `TopNavigation` → sẽ hiện gạch ngang trong monorepo này
- [x] `@see` cho `Dialog`/`Modal`/`Popup`/`BottomSheet` và `Toast`/`Snackbar` — mỗi cái một câu
      mô tả "nó là cái gì" + `@see` trỏ bảng README. Generator của `API.md` **nuốt tag `@see`**,
      chỉ lấy phần mô tả, nên phần mô tả phải tự đứng được (đã viết theo hướng đó); `@see` vẫn
      hiện khi hover trong IDE
- [x] Thêm `TabRootContext` do `Tab` cấp; `TabList`/`TabTrigger`/`TabContent` gọi
      `useTabRootGuard(<tên>)` và throw trước Radix. Verify bằng `renderToStaticMarkup`:
      ba component mồ côi ném đúng `` `TabList|TabTrigger|TabContent` must be used within `Tab` ``,
      cây lồng đúng vẫn render bình thường
- [x] Thêm `PopoverProps` (trước đây `Popover` nhận thẳng type của Radix — **và Radix cũng đặt
      tên type đó là `PopoverProps`**, chính là cái tên trong thông báo lỗi ở I-7) với
      `className?: never` + JSDoc. Phải có **câu mô tả** ngoài tag `@deprecated`, nếu không cột
      Description trong `API.md` ra `—`. Export thêm `PopoverProps` ở barrel `popover/index.ts`
- [x] Thêm điều kiện `require` trong `exports` cho **cả ba** entry (`.`, `./icons`, `./*`) trỏ
      `dist/require-error.cjs`; stub nguồn ở `src/require-error.cjs`, copy bằng script mới
      `build:cjs`. Cập nhật gạch đầu dòng ESM-only trong README Requirements
- [x] Verify resolution thật qua junction vào `node_modules/@echoit/itui.css`: cả ba đường
      `require()` ra đúng message, `import('@echoit/itui.css/button')` vẫn OK
- [x] `pnpm docs:api` (491 exports, 56 module) + chạy đủ gate: `check:client` (+self-test),
      `check:barrels`, `check:classes`, `check:docs`, `check:rsc` (871.2 kB / budget 976.6 kB),
      `check:bundle` — **tất cả xanh**. Còn lại: release do người quyết

**Bẫy gặp khi làm (ghi lại để Phase sau khỏi vấp):**

- `cpy src/require-error.cjs dist` **giữ nguyên đường dẫn** → ra `dist/src/require-error.cjs`.
  Phải thêm cờ `--flat`. (`build:css` sẵn có cũng dính lỗi này, nhưng nó không nằm trong chuỗi
  `build` nên chưa lộ.)
- Node **chấp nhận** target không có `*` dưới key pattern `"./*"`, nên một stub dùng chung cho
  mọi subpath là hợp lệ — đã kiểm chứng bằng `require('@echoit/itui.css/button')`.

**Release note cho `1.1.0` — soft breaking, cần dán vào GitHub release** (repo không có
`CHANGELOG.md`):

> `Tabs` / `TabsList` / `TabsTrigger` / `TabsContent` và `TopNavigation` /
> `BottomNavigation` / `BottomNavigationItem` giờ mang `@deprecated`. Không có gì bị xoá và
> compile không đổi — nhưng consumer bật `eslint-plugin-deprecation` (hoặc
> `@typescript-eslint/no-deprecated`) ở mức `error` sẽ thấy CI đỏ khi nâng. Bản thay thế:
> `Tab` / `TabList` / `TabTrigger` / `TabContent` và `TopNavigationV2` / `BottomNavigationV2` /
> `BottomNavigationItemV2`.

**Phát hiện thêm khi làm (chưa xử lý, không thuộc Phase 2):**

- `src/components/tabs/tabs.tsx` không có `"use client"` và vẫn lọt mọi gate — nó chỉ dùng
  `forwardRef`. Đúng luật, nhưng khác `Tab` (có directive); nếu sau này nhóm legacy bị bỏ thì
  không cần đụng, còn nếu giữ thì nên đồng bộ.
- IDE cảnh báo `suggestCanonicalClasses` ở `dialog.tsx:78`, `modal.tsx:111`, `popup.tsx:127-128`,
  `BottomSheet.tsx:236` (dạng `sm:max-w-[480px]` → `sm:max-w-120`). Có sẵn từ trước, không phải
  do Phase 2, và không gate nào bắt.

### Phase 3 — `1.1.0` / `1.2.0` ✅ **xong 2026-08-06**

- [x] Tách `useFieldA11y({ id, label, error, helperText, disabled, nameFromLabelId })` cạnh
      `InputFieldShell` (không export ra barrel)
- [x] ~~Chuyển `InputFieldShell` sang dùng hook~~ — **không làm, có lý do.** Shell không sở hữu
      control lẫn `id` nào; bắt nó gọi một hook sinh `useId()` mà nó không gắn được vào đâu thì
      `messageId` sẽ trỏ tới một control không tồn tại. Hook thuộc **phía control** — đúng chỗ
      4/6 field đang sai. Shell chỉ nhận thêm một prop `labelId?` (xem dưới), markup không đổi.
- [x] **Phạm vi rộng hơn plan gốc — audit cả 6 field cho thấy I-4 không chỉ xảy ra ở `Select`:**

      | Field | `id ?? useId()` | `<label htmlFor>` | `aria-invalid` | `aria-describedby` |
      | --- | --- | --- | --- | --- |
      | `InputText` | ✅ | ✅ | ✅ | ✅ |
      | `SelectTrigger` (Phase 1) | ✅ | ✅ + `labelledby` | ✅ | ✅ |
      | `InputTextarea` | ✅ | ✅ | ✅ | ❌ |
      | `InputTag` | ✅ | ✅ | ❌ | ❌ |
      | `InputFileUpload` | ✅ | ✅ | ✅ | ❌ |
      | `InputTextFormatting` | ❌ không có `id` | ❌ | ❌ | ❌ |

      Shell **có** render `<p>` message ở cả bốn, nhưng control không trỏ tới → message lỗi hiện
      trên màn hình mà không được đọc. Nên I-5 không phải "refactor nội bộ, DOM không đổi" như
      plan mô tả: nó **đổi DOM của 4 component** — và đó chính là phần sửa.
- [x] `InputText` + `SelectTrigger` sang hook — verify bằng `renderToStaticMarkup`: **không đổi
      một attribute nào** (kể cả `aria-describedby="own-hint t3-message"` khi consumer tự truyền
      hint, và `disabled` vẫn nuốt error)
- [x] `InputTextarea` / `InputTag` / `InputFileUpload` sang hook → có `aria-invalid` +
      `aria-describedby` trỏ đúng `<id>-message`
- [x] `InputTextFormatting`: thêm prop `id?`, `nameFromLabelId: true` vì Lexical render editor là
      `contenteditable` — `<label for>` chỉ bind được với labelable element, nên tên phải đến từ
      `aria-labelledby`. Thay `aria-label={label}` bằng `aria-labelledby` trỏ chính `<label>`
- [x] `InputFieldShell` nhận thêm `labelId?` để field nào cần `aria-labelledby` cũng dùng được,
      không phải tự dựng markup như `Select` đã phải làm
- [x] Thêm `label?: ReactNode` cho `Toggle`, wrapper `<label>` **chỉ khi** có `label`;
      typography/màu disabled mượn từ `Checkbox` (Figma không mock switch có nhãn — đã ghi vào
      token comment). Radix render switch là `<button>`, vốn labelable, nên `<label>` bọc vừa đặt
      tên vừa làm hit target
- [x] `Toggle` không có `label` giữ nguyên DOM cũ (early-return trước wrapper) → `className` vẫn
      rơi đúng element cũ
- [x] I-6b — thêm mục **Versioning** vào README: bảng patch/minor/major + hai hệ quả đã cắn
      package này (rename không đi patch; `@deprecated` là minor vì làm đỏ CI của consumer bật
      `no-deprecated` ở mức `error`)
- [x] `pnpm docs:api` (491 exports) + gate: `check:client`, `check:barrels`, `check:classes`,
      `check:docs`, `check:rsc` (871.2 kB / 976.6 kB), `check:bundle` — **tất cả xanh**

**I-22 — icon về weight `Regular`** ✅ **xong 2026-08-06**

- [x] **Ba ngoại lệ đã chốt** (user, 2026-08-06 — "theo đề xuất trong plan"): `Rating` đổi mô hình
      (nền `StarRegularIcon`, lớp fill giữ `StarFillIcon`); `DropdownMenuRadioItem` **giữ**
      `CircleFillIcon`; `Empty` **giữ nguyên** 2 illustration 60×60
- [x] **Ba ngoại lệ *bổ sung*, phát hiện khi đọc source — plan gốc xếp nhầm vào nhóm A/B.**
      Plan dựng hai nhóm bằng cách grep `Fill` và `<svg>`, nên không phân biệt được "icon chọn
      theo weight" với "artwork export từ Figma". Áp cùng nguyên tắc user đã chốt (Fill mang
      **ngữ nghĩa** hoặc **do Figma quy định** thì giữ):
      - `scroll/Scroll.tsx` — token comment ghi thẳng: *"Figma's exported vector is the Phosphor
        **Fill** caret … which is exactly `CaretUpFillIcon`'s path at half scale"*. Fill ở đây là
        asset Figma, không phải lựa chọn tuỳ tiện → **giữ nguyên**
      - `avatar/Avatar.tsx` — `AvatarPlaceholder` là **mask geometry export từ Figma**, viewBox 72
        full-bleed, vai tràn ra ngoài để bo tròn cắt phẳng. `UserRegularIcon` là glyph khác hẳn và
        mất hiệu ứng cắt → **giữ nguyên**
      - `progress/Progress.tsx` — Figma chỉ định **glyph** (`CheckCircle`/`XCircle` cho linear,
        `Check`/`X` cho circular) chứ **không** chỉ định weight → **đổi được**, đã đổi
- [x] Nhóm A — `Fill` → `Regular`: `InputFileUpload` (`CheckCircle`, `Warning`), `InputSearch`
      (`XCircle`), `Lnb` (`User`), `resource-modal` (`Folder`), `Progress`
      (`CheckCircle`, `XCircle`)
- [x] Nhóm B — SVG inline → ITUI Regular: `Accordion` (`CaretDown`), `CardTemplates`
      (`Image`, `Check`), `Checkbox` (`Check`), `Chip` (`X`), `Pagination`
      (`CaretLeft/Right` + `CaretDoubleLeft/Right`, `DotsThree`), `Popup` (`X`, `Image`),
      `Tag` (`X`), `Rating` (nền `StarRegular`); đã xoá hết hàm icon nội bộ
- [x] `Pagination.Chevron` bỏ luôn `-scale-x-100` + path thứ hai có điều kiện — bộ caret ITUI đã
      có sẵn cả hai hướng lẫn hai bản đơn/đôi, không cần tự dựng lại
- [x] Mỗi chỗ thay: `[&_path]:fill-current` + class kích thước tường minh. **`aria-hidden="true"`
      cũng phải thêm tay** — mọi SVG inline cũ đều có sẵn, icon ITUI thì **không**, nên bỏ qua sẽ
      phơi icon trang trí ra cho screen reader
- [x] **Không** đụng `bubble/Bubble.tsx` và `progress/Progress.tsx:236` — không phải icon
- [x] Import theo đường dẫn từng folder, không qua barrel `icons/index.ts`
- [x] QA Storybook 19 ảnh chụp thật (`Rating` 0→5 nửa sao, `Pagination` many-pages, `Chip` 24 ô
      state×size, `Checkbox` checked, `Progress` statuses, `UploadField` items+error,
      `InputSearch` filled, `Popup` mở, `Card` image+pricing, `Toggle` labelled, `Accordion`)
- [x] Gate xanh; phần "thay đổi thị giác" cho release note ở dưới

**Ghi chú thị giác cho release note `1.2.0`:**

> Icon trong 13 component chuyển từ SVG tự vẽ / biến thể `Fill` sang bộ ITUI weight `Regular`.
> Không đổi API, không đổi compile — nhưng nét icon **mảnh hơn** ở: `Accordion`, `Card`,
> `Checkbox`, `Chip`, `InputFileUpload`, `InputSearch`, `Lnb`, `Pagination`, `Popup`, `Progress`
> (chỉ biến thể linear), `Rating` (sao rỗng giờ là **viền** thay vì sao xám đặc), `resource-modal`,
> `Tag`. `Scroll`, `Avatar`, `Empty` và chấm "đã chọn" của `DropdownMenu` giữ nguyên.
>
> Hai chỗ đổi cả **màu**, không chỉ nét: nút xoá của `InputSearch` từ `#101010` về
> `text-neutral-muted` (nay ăn `fill-current` như mọi slot icon khác), và sao rỗng của `Rating`
> nhạt hơn mock Figma — Figma vẽ sao rỗng là sao xám **đặc**, đây là deviation có chủ ý để phân
> biệt đầy/rỗng khi cả hai đã cùng weight.

### Phase 4 — `1.2.0`

- [ ] Thêm `API.md`, `TOKENS.md` vào `files` trong `package.json`
- [ ] Viết JSDoc "khi nào dùng" cho `Button`, `Table`, `Card`, `Dialog`, nhóm `Input` — lấy
      `PopoverItem.asMenuItem` làm chuẩn chất lượng
- [ ] Mở rộng sang top-20 component
- [ ] Viết trang accessibility: focus, bàn phím, ARIA ai sở hữu; gồm `TooltipProvider` và
      `Checkbox.label` vs `Radio` children
- [ ] JSDoc một dòng cho `Radius`/`Colors`/`Shadow`/`Spacing`/`Typography` nói rõ chúng là
      primitive áp token (thay cho R-25)
- [ ] `pnpm docs:api`

### Phase 5

- [ ] Tách `@echoit/itui.icons`; `./icons` re-export nó ≥1 minor trước khi bỏ
- [ ] Deploy `apps/storybook` làm reference public
- [ ] Kiểm lại `aria-modal` trên `DialogContent`; thêm nếu vẫn thiếu

---

## 7. Những gì **không** được đụng vào

Trích từ §"What not to change" của RECOMMENDATIONS, giữ nguyên vì mọi mục đều đã được kiểm chứng
lại trong source:

- Bề mặt TypeScript — union type có tên, chẩn đoán mức `Did you mean 'label'?`.
- `API.md` là artifact **generate + CI-check**. Giữ `check:docs` trong CI; đừng bao giờ sửa tay.
- Bảng "Picking between similar names" trong README và cảnh báo `Badge` cắt `"Enterprise"` → `"erp"`.
- Kiến trúc token, và phần prose giải thích vì sao `--primary`/`--radius` trông như no-op.
- `dist/index.js` tự import CSS của chính nó — một dòng đã xoá defect tệ nhất của `1.0.14`.
- Per-component entry + barrel ở trên: output production giống hệt nhau từng byte.
- `fieldClassName`/`boxClassName` của `Input` và compound shape của `Card`/`Sidebar`/`Table`/`Dialog`.
