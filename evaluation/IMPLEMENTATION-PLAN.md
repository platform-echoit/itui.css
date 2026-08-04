# Implementation Plan — `@echoit/itui.css`

Tổng hợp từ `DX-REPORT.md`, `FAILURES.md`, `RECOMMENDATIONS.md`, `DX-SCORES.json`
và **verify trực tiếp trong source** tại commit `4bd31fb1` (branch `main`).

| | |
| --- | --- |
| Điểm hiện tại | **4.4 / 10** — `NOT READY` |
| Mục tiêu | **8.8 / 10** — `GOOD DX` sau 4 milestone |
| Bản đánh giá | npm `1.0.14` · repo local `1.0.10` (xem I-22) → đã bump `1.0.15`, **chưa publish** |
| Lập plan | 2026-07-29 |

---

## 0. Đính chính report

4 điểm trong evaluation có root cause sai hoặc lệch. Đã verify trong source — những
đính chính này **đổi hẳn effort estimate**, đọc trước khi ước lượng.

| Report nói | Thực tế | Hệ quả |
| --- | --- | --- |
| "Không có `files` field → 98 MB" | [`package.json`](../package.json) **có** `files: ["dist"]` | Thủ phạm thật là `sourcemap: true` + 7.913 file icon → I-10 |
| "`tailwind-merge` không được áp dụng" | `cn()` trong [`src/lib/utils.ts`](../src/lib/utils.ts) **đã** dùng `twMerge` | Chỉ **3/49** module không gọi `cn()`: `button`, `file-type`, `toast` → I-08 rẻ hơn nhiều |
| "dist không có `\"use client\"`" | Đúng (`grep -c` → 0) nhưng **root cause ngược lại**: chỉ 25 file có directive, còn **17 module bắt buộc** đang thiếu; đồng thời bundle inline deps xoá luôn directive của Radix | preserve-directives **không đủ** → I-01 chuyển sang `bundle: false`, và I-02 thành hệ quả miễn phí |
| "Dialog bị override focus ở đâu đó" | Tìm thấy chính xác: [`dialog.tsx:73-76`](../src/components/dialog/dialog.tsx#L73-L76) | I-04 là fix **1 dòng** |
| "`@source` là no-op, build có/không nó ra CSS byte-identical" | **Sai.** Đo trong fixture Vite: xoá `@source` → CSS consumer **99,8 kB → 7,34 kB**, mất toàn bộ utility class | I-03 **đảo chiều**: giữ `@source`, chỉ thu hẹp phạm vi. Xoá theo plan cũ là gây đúng cái lỗi I-03 đang dẹp |

Phát hiện thêm: phần lớn chuỗi tiếng Hàn **đã là prop có default**
(`clearLabel = '검색어 지우기'`), nên i18n rẻ hơn report ước tính — xem I-09.

### 0.1 Đính chính vòng 2 (2026-07-30, lúc làm M1)

3 điểm nữa lệch, phát hiện khi verify từng file trước khi sửa:

| Bản plan này nói | Thực tế | Hệ quả |
| --- | --- | --- |
| I-08 gồm 3 module: `button`, `file-type`, `toast` | `file-type` **không ghép className** — [`FileType.tsx:152`](../src/components/file-type/FileType.tsx#L152) và [`FileIcon.tsx:134`](../src/components/file-type/FileIcon.tsx#L134) forward thẳng `className` xuống icon. Không có gì để merge | I-08 chỉ còn **2 module**. Cùng loại false positive như §0: kết luận "thiếu `cn()`" suy từ `grep cn(`, mà vắng `cn()` ≠ có lỗi |
| Bug của `toast` là "nối class thay vì merge" | Khác: [`Toast.tsx:14`](../src/components/toast/Toast.tsx#L14) hardcode `className="toaster group"` **trước** `{...props}`, nên consumer truyền `className` là **xoá** `toaster group` chứ không phải thua nó | Fix vẫn là `cn()`, nhưng phải destructure `className` — nếu chỉ bọc `cn()` quanh literal thì bug còn nguyên |
| I-04 gồm cả `aria-modal = null` | `aria-modal` **không phải** do ta ghi đè: `@radix-ui/react-dialog` không hề emit nó (`grep -c aria-modal dist/index.mjs` → **0**). Radix dùng `aria-hidden` trên nội dung ngoài thay cho `aria-modal` | Bỏ `preventDefault` fix được focus trap (đã QA pass) nhưng **không** làm `aria-modal` xuất hiện. Đây là gap upstream, tách khỏi I-04 |

### 0.2 Đính chính vòng 3 (2026-07-30, lúc làm I-13 + I-23)

| Bản plan này nói | Thực tế | Hệ quả |
| --- | --- | --- |
| I-23 ảnh hưởng **4** component: `Button`, `Avatar`, `Popover`, `Sidebar` | Chỉ **2**. [`Popover.tsx:172`](../src/components/popover/Popover.tsx#L172) dùng `hover:bg-muted active:bg-secondary`, [`Sidebar.tsx:185-186`](../src/components/sidebar/Sidebar.tsx#L185-L186) dùng `bg-sidebar-accent` / `bg-secondary` — `bg-surface-hover` ở 2 file đó chỉ nằm trong **comment** | Lại đúng loại false positive của §0 và §0.1: kết luận suy từ grep, mà grep không phân biệt code với comment. Và may là chúng **không** dùng: 2 token mới là `@theme` hex phẳng nên **không theo dark mode**, còn cặp `@theme inline` kia thì có |
| I-13: `Button loading` nên set native `disabled` | Native `disabled` **gỡ button khỏi tab order**. User bấm Enter submit xong là mất focus, screen reader nhảy về `<body>` và không bao giờ nghe `aria-busy` | Đã chốt `aria-disabled` + `preventDefault` (WAI-ARIA APG cho trạng thái busy). Chặn đủ 3 đường: chuột, Enter/Space, implicit form submit. Giữ nguyên giao diện — native `disabled` còn kéo theo `disabled:bg-secondary` làm primary button loading chuyển sang xám |
| I-13: `PopoverItem` nên có `role="menu"` | `role="menu"` là **hợp đồng**, không phải nhãn: screen reader sẽ ngừng expose item qua Tab và giao điều hướng cho phím mũi tên | Thêm role trần sẽ **lùi** so với `role="dialog"` hiện tại. Đã dựng [`PopoverMenu.tsx`](../src/components/popover/PopoverMenu.tsx) kèm roving tabindex + Arrow/Home/End; role và điều hướng đi cùng nhau, không tách |

### 0.3 Đính chính vòng 4 (2026-07-30, lúc làm I-11 + I-09a)

| Bản plan này nói | Thực tế | Hệ quả |
| --- | --- | --- |
| I-11: "2 thư viện icon → chọn một" | Không phải 2 thư viện cạnh tranh nhau: `@phosphor-icons/react` chỉ được dùng ở **1 file / 2 icon** ([`Select.tsx`](../src/components/select/Select.tsx)), và trong 4 file dùng `lucide-react` thì **5/13 tên import là code chết** — [`Popover.tsx`](../src/components/popover/Popover.tsx) import `ChevronRight` mà dùng `CaretRight` của ITUI, [`resource-modal.tsx`](../src/components/modals/resource-modal.tsx) import 8 dùng 4 | User chốt **bỏ cả hai**, dùng icon ITUI có sẵn. Tổng cộng chỉ 11 call-site thật. Lại đúng loại false positive của §0–§0.2: "2 thư viện trong `dependencies`" đo bằng manifest, không đo bằng call-site |
| I-11: `tailwindcss` **và** `@tailwindcss/vite` → `peerDependencies` + `devDependencies` | `@tailwindcss/vite` **không được file nào trong package dùng** — [`tsup.config.ts:27`](../tsup.config.ts#L27) để `@import "tailwindcss"` external cho consumer resolve, nên nó không phải cả runtime lẫn build-time dep. Đưa vào peer còn **sai hướng**: consumer Next dùng `@tailwindcss/postcss`, ép họ cài plugin của Vite | Chỉ `tailwindcss` thành peer (bắt buộc, `^4`); `@tailwindcss/vite` **gỡ hẳn**, để README hướng dẫn theo bundler. Verified `dist/index.css` không đổi: `@import "tailwindcss"` vẫn được giữ nguyên, không bị inline |
| I-09a gồm **12** default ở ~8 file | **17** default ở **10** file. 5 cái plan không xếp đúng chỗ: `title` của [`Empty.tsx`](../src/components/empty/Empty.tsx#L70) và fallback `title ?? '메뉴'` của [`BottomSheet.tsx`](../src/components/bottom-sheet/BottomSheet.tsx) bị xếp nhầm sang I-09b (chúng **là** default của prop đã tồn tại); `placeholder` + `linkPromptLabel` của [`InputTextFormatting.tsx`](../src/components/input/InputTextFormatting.tsx#L456) và `dontShowAgainLabel` của [`Popup.tsx`](../src/components/popup/Popup.tsx#L83) **không có trong plan** | Grep `= '<Hàn>'` bắt hết trong 1 lần; danh sách chép tay của report bỏ sót 40% |
| Bảng A2: 9 file cần directive vì dep không tự khai báo | Sau khi bỏ umbrella, **cả 8** package `@radix-ui/react-*` mới đều ship `"use client"` ở dòng 1 (verified từng file `.mjs`) | Điều kiện (ii) của A2 giờ đã thoả → 8 file đó **có thể gỡ** `'use client'` để server-renderable trở lại. **Chưa làm** — xem "Việc còn mở" ở §3.3, vì cần mở rộng fixture chứ không chỉ chạy guard |

Ghi chú về I-15: plan nói "sync 2 entry sai". Thực tế **cả 8 dòng** bảng
Primary/Secondary/Muted/Accent còn giá trị `oklch(...)` của shadcn, trong khi source đã là hex
(`--primary: #009ce0`). Đồng thời `--radius` là no-op **thật** (`rounded-base` được dùng **0
lần**), còn `--primary` thì **không** — nó tới được 12 module dùng `bg-primary`, chỉ là `Button`
trong ví dụ README không nằm trong số đó.

### 0.4 Đính chính vòng 5 (2026-07-30, lúc làm I-06)

| Bản plan này nói | Thực tế | Hệ quả |
| --- | --- | --- |
| README document 17 component, barrel export **49 module** → "~70% API không tài liệu" | **56 module / 482 export** không tính icon (6.613 icon nữa). Con số thật là **~96%** không tài liệu, không phải 70% | Đếm bằng `checker.getExportsOfModule` chứ không đếm dòng barrel. 49 là số dòng `export *`, mà một dòng như `./components/input` chứa 15 export |
| Generate bảng props **từ `.d.ts`** ("dữ liệu đã có sẵn") | `.d.ts` **không có default value** — `tsc` giữ destructuring pattern nhưng bỏ initializer, nên `dist` không trả lời được "default variant là gì" | Script chạy trên **`src`**, không phải `dist`. Lợi thêm: regenerate docs **không cần build** |
| I-06 là "API không có tài liệu" | Nặng hơn: có tài liệu **sai**. `### Scrollbar` trong README import một export **không tồn tại** (thật là `ScrollArea` / `ScrollAreaScrollbar`) → copy-paste không compile. Cùng loại F-14 nhưng tệ hơn, vì `Badge` ít nhất có thật | Xoá section đó, viết lại theo API thật |
| I-06 chỉ ảnh hưởng 32 component không được document | 4/17 bảng **đã document cũng sai**: `Button` 5 variant (thật 7) và 3 size (thật 4) · `DialogContent.hideHeaderBorder` ghi `false` (thật `true`) · `FileTypeLogo` liệt kê 37 giá trị (thật 38, thiếu `folder`) · `Scrollbar` không tồn tại | Đây là lý do chốt **gỡ hẳn** bảng hand-written thay vì cập nhật chúng: cập nhật xong là bắt đầu rot lại từ hôm sau |

### 0.5 Đính chính vòng 6 (2026-08-03, lúc đóng A2)

| Bản plan này nói | Thực tế | Hệ quả |
| --- | --- | --- |
| I-09b/c còn TODO ở M3 | **(b) đã xong** trong working tree: `Spinner label='Loading'` · `InputTextFormattingLabels` (18 nhãn, một bag thay vì 18 prop) · `ResourceModalLabels` · `invalidTypeMessage`/`maxSizeMessage` của `InputFileUpload` · `Empty title` · `BottomSheet title`. Grep `\p{Hangul}` trên `src` giờ **chỉ** còn hit trong comment/JSDoc | I-09 chuyển sang **DONE (a+b)**. Chỉ (c) `ITUIProvider locale` còn mở, và nó vốn là *tuỳ chọn* |
| Vài chỗ ghi **482** export (§0.4, §3.6, checklist M3) | **483** (`pnpm check:docs`) | Số nhỏ nhưng là đúng lý do phải có `--check`: plan chép tay lệch, CI thì không |
| "8 file A2 **có thể** gỡ directive" (§3.3) | Gỡ được **8/9** — `Popup` phải giữ, đúng như ghi chú A3 của chính plan đã cảnh báo | Xem §3.4. Payoff lớn hơn dự kiến rất nhiều: client JS của fixture **1.359.225 → 845.026 byte (−38%)** |
| Payoff của việc gỡ directive = "component server-renderable trở lại" | Đó chỉ là phần nhỏ. Phần lớn 514 kB tiết kiệm được **không phải** code của 8 component — mà là **cả thư viện** (Lexical + date-fns + toast + input) thôi bị kéo vào client bundle | Lộ ra **I-27** (§3.5): thủ phạm là `export *` ở barrel module, không phải directive. Gỡ directive chỉ *tình cờ* dập được 2 trong 6 đường dẫn tới lỗi đó |

### 0.6 Đính chính vòng 7 (2026-08-03, lúc làm I-27)

| Bản plan này nói | Thực tế | Hệ quả |
| --- | --- | --- |
| §3.5: **một** barrel `export *` chứa client module là đủ để rò cả thư viện. Bằng chứng: đổi mỗi `lnb` từ named sang `export *` → 846.819 B ↦ 1.347.221 B | **Sai — và sai vì cùng một lỗi phương pháp mà §0–§0.4 đã vấp 5 lần.** Bảng `lnb`/`avatar` tự nhận là "test một biến", nhưng ở **cả hai** nhánh thì 6 barrel kia vẫn đang `export *`; thứ được đổi chỉ là *biến thứ hai*. Đo lại có kiểm soát, 5 phép đo: `select` `export *` một mình (và `Select` **được render**) → **849,2 kB, không rò**; 5 barrel kia `export *` còn `select` named → **849,2 kB, không rò**; cả 6 → **1305,2 kB, rò** | Điều kiện thật là một **cặp**: cần (i) một client module **được render** đi qua `export *`, **cộng** (ii) ít nhất một barrel `export *` khác cũng chứa client module. Thiếu vế nào cũng không rò |
| Suy ra từ đó: mỗi barrel trong 6 cái đóng góp một phần của 467 kB | Không cộng dồn. `select`+`modals` → **1305,2 kB**; `select`+`calendar` → **1305,2 kB**, byte-identical. 4 barrel còn lại đóng góp **0 byte** | Độ lớn **hằng số** vì thứ rò là *cả thư viện*, không phải dep của riêng barrel đó. Nên "barrel nào" không quan trọng — "có đủ hai hay không" mới quan trọng |
| Blast radius: `select` rộng nhất vì hay dùng | Vẫn đúng, nhưng lý do khác: `select` nguy hiểm vì nó là loại **được render** (vế i), chứ không vì nó nặng | Cả 6 vẫn phải đổi: fixture chỉ render client module của **2/6** barrel, nên 4 cái kia im lặng ở đây mà vẫn rò với consumer render `Calendar` / `Tab` / `PopoverMenu` / `Grid` |

⚠️ **Bài học phương pháp, lần thứ 6:** mọi kết luận sai trong tài liệu này đều cùng một hình dạng —
*suy từ một phép đo mà nền chưa được giữ cố định* (grep không phân biệt comment với code §0.2 ·
manifest không phải call-site §0.3 · danh sách chép tay bỏ sót 40% §0.3 · và lần này, "một biến"
mà nền có 6 biến). Con số 1.359.225 → 845.026 B của §3.4 **không** bị ảnh hưởng — nó đo đúng thứ nó
nói — nhưng lời giải thích gán cho nó thì phải đọc kèm mục này.

Ba phát hiện phụ, không phải đính chính:

- **`TxtIcon` lệch chuẩn cả bộ.** 36 icon còn lại trong [`src/icons/file-type/`](../src/icons/file-type/)
  nhận `{ className?: string }`, riêng `TxtIcon` nhận `React.SVGAttributes<SVGSVGElement>`. Generator
  gom 36 cái kia thành 1 mục và để `TxtIcon` riêng — output **đúng**, nhưng cái lệch trong source thì vẫn còn
- **Module `snackbar` export cả `snackbar` (hàm) và `Snackbar` (component).** GitHub lowercase heading
  nên 2 cái ra cùng anchor; generator phải claim anchor theo đúng thứ tự ghi heading để khớp với
  `#snackbar-1` mà GitHub sinh ra. Cả tài liệu chỉ có đúng 1 chỗ như vậy
- **Không có name collision nào giữa 56 module** (verified) — nên mọi export đều thật sự tới được
  từ barrel, `export *` không âm thầm bỏ cái nào

### 0.7 Đính chính vòng 8 (2026-08-03, lúc chốt M1–M3 và bump `1.0.15`)

| Bản plan này nói | Thực tế | Hệ quả |
| --- | --- | --- |
| I-02 mục 3: tách `icons` khỏi barrel là breaking vì **8 file trong `apps/`** đang import icon qua barrel | **16 file / 37 named import** — `apps/web` **5**, `apps/storybook` **11**. Đo bằng cách dựng tập **6.604 tên export thật** của [`src/icons/ITUI/`](../src/icons/ITUI/) rồi đối chiếu từng named import, thay vì lọc theo hậu tố `Icon` | Con số 8 vừa **thừa** vừa **thiếu**: `FileIcon` / `FileTypeLogo` khớp hậu tố nhưng là component của module `file-type`, không phải icon; ngược lại toàn bộ 11 file `apps/storybook` bị bỏ sót. Lần thứ **7** của cùng một hình dạng lỗi (§0.6) — và lần này chính plan tự vấp lại sau khi đã viết cảnh báo |
| §3.5 acceptance: trạng thái đã sửa = **869.581 B** client JS | Build sạch hôm nay đo **849,2 kB**, khớp với §0.6 (`849,2 kB, không rò`) chứ không khớp §3.5 | Hai mục trong cùng tài liệu ghi **hai số khác nhau cho cùng một trạng thái**, lệch ~20 kB. Chưa truy được nguyên nhân (không giữ lại điều kiện đo của §3.5) — ghi nhận số đo lại được, **không** dựng lời giải thích cho khoảng lệch. Budget 976,6 kB của gate không bị ảnh hưởng |

Lần chạy lại đầy đủ khi chốt (build 3 stage + 5 gate, `dist` mới): `check:client` ✓ · `check:barrels` ✓
(56 barrel, 16 `export *`) · `check:docs` ✓ (483 export / 56 module) · `check:rsc` ✓ (849,2 kB / 7 chunk,
không module nào rò) · `check:bundle` ✓ (23,6 kB/Button; barrel 9.137 vs subpath 31 module transform).

### 0.8 Đính chính vòng 9 (2026-08-04, lúc tách `icons` khỏi barrel)

| Bản plan này nói | Thực tế | Hệ quả |
| --- | --- | --- |
| §I-02 mục 3 + M2: gỡ `export * from './icons/ITUI'` ở [`src/index.ts`](../src/index.ts) là thứ chặn 6.613 icon khỏi dev graph — "lý do thật để tách `icons`" | Gỡ xong, đo lại: **9.137 module, không nhích một byte**. Bucket theo nguồn cho biết **7.912** module vẫn là icon. Chúng vào bằng **đường khác**: 7 file component `import { … } from '../../icons/ITUI'`, mà barrel đó là 1.263 dòng `export *` | Dòng barrel gốc **không phải** đòn bẩy. Đổi 7 file sang import thẳng file khai báo: **9.137 → 1.517 (−83%)**, `bundle.js` **byte-identical** (217,93 kB). Đây là **I-29** |
| §0.7 đo được **18 file / 41 import** icon qua barrel trong `apps/` (số cũ 16/37) | Đúng 18/41, nhưng còn **2 spelling deep-import** mà không grep nào bắt: [`Icons.stories.tsx`](../../../apps/storybook/src/stories/Icons.stories.tsx) `import * as ITUIIcons from '…/icons/ITUI'` và [`folder-tree.tsx`](../../../apps/web/screen/main/my-drive/folder-tree.tsx) import 1 file lẻ | Cả hai chỉ chạy nhờ tsconfig `paths` / alias Vite trỏ vào `src`, **không** qua `exports`. Đã đưa về một spelling `@echoit/itui.css/icons` |
| — (không có trong plan) | `FolderColorLogo` và `FolderColorOpenLogo` **có file** trong [`icons/ITUI/file-type/`](../src/icons/ITUI/file-type/) nhưng **không** được `index.ts` của thư mục re-export | Nên `/icons` không với tới được, và đó là lý do `apps/web` phải deep-import. Đã thêm 2 dòng → **6.613 → 6.615 icon**. Cùng họ với lỗi "`FileTypeLogo` thiếu `folder`" mà §0.4 đã bắt |

⚠️ **Lần thứ 7 của cùng một hình dạng lỗi** (§0.6): kết luận "tách icons khỏi barrel sẽ giảm dev graph"
được suy từ bảng 15.407 → 9.137 của I-11, mà bảng đó **không** có nhánh nào tách icons để so. Lần này
phát hiện sớm vì đo **trước** khi ghi công, và đo bằng bucket theo nguồn chứ không chỉ tổng số.

### 0.9 Đính chính vòng 10 (2026-08-04, lúc làm I-14 + I-18 + I-21)

| Bản plan này nói | Thực tế | Hệ quả |
| --- | --- | --- |
| I-18: `colors` · `radius` · `shadow` · `spacing` · `typography` · `grid` là **token showcase export như component thật**, "nhiễu autocomplete, phình bundle" → gỡ khỏi public API | **Không cái nào là showcase.** [`Grid`](../src/components/grid/Grid.tsx) là layout responsive kiểu MUI (`size={{xs:12, md:6}}`, 12 track, 3 breakpoint); [`Typography`](../src/components/typography/Typography.tsx) là component text 10 variant kèm `typographyClass`/`TYPOGRAPHY_SPEC`; `Radius`/`Colors`/`Shadow`/`Spacing` là primitive `forwardRef` + `asChild` kèm map hằng số (`RADIUS_PX`, `COLOR_HEX`, `SPACING_PX`) — đúng thứ một hệ token-driven phải export. Chỉ `GridOverlay` là dev aid | **I-18 → `SKIP`.** Cả 2 Impact cũng đã bị chính tài liệu này bác từ trước: "phình bundle" — §I-02 đo barrel và subpath cho bundle **byte-identical**, §3.8 còn 1.517 module; "nhiễu autocomplete" có thật nhưng không đáng một breaking change. `git diff 4bd31fb1 HEAD` trên 6 thư mục: **byte-identical** (trừ `grid/index.ts` do I-27), nên đây là misread chứ không phải code đã đổi từ lúc đánh giá |
| I-21: `Select` placeholder "**phải truyền 2 lần**" (`SelectTrigger` + `SelectValue`) | Nặng hơn: [`Select.tsx:53,73`](../src/components/select/Select.tsx#L53) **khai** `placeholder`, **destructure** nó ra khỏi props rồi **không dùng vào đâu cả**. Nó là prop **chết** — cùng họ I-05, không phải bất tiện. Bằng chứng consumer đã tự vá: [`controled-select.tsx:62-68`](../../../apps/web/components/ui/controled-select.tsx#L62-L68) đọc `props.placeholder` rồi tự bơm xuống `SelectValue` | Fix không phải "cho `SelectTrigger` truyền xuống `SelectValue`" mà là **cho prop có nghĩa lần đầu tiên**. Truyền cả hai vẫn hợp lệ (children thắng), nên không breaking |
| I-14 chỉ nói về tên `PopoverRoot`, **không** nói ai đang dùng panel `Popover` | Panel được dùng ở **5 file `apps/web`** làm surface context-menu (`trash-screen` · `version-history-sidebar` · `bulk-context-menu` · `drive-blank-context-menu` · `file-context-menu`) + 1 story. Cả 5 đều truyền `className` | Đây mới là nhóm gặp breaking nguy hiểm nhất, chứ không phải người dùng `PopoverRoot` (đã có alias `@deprecated`). Xem cách chặn ở §4.1 |

⚠️ **Lần thứ 8 — và lần này chính lượt làm việc đang đọc bạn cũng vấp.** Câu đầu tiên tôi kết luận về
I-14 là *"`apps/web` không hề dùng panel `Popover`"*, suy từ một lần grep bị **cắt ở 60 dòng đầu**. Con
số thật là 5 file. Cùng hình dạng lỗi mà §0–§0.8 đã ghi 7 lần: *đọc kết quả một phép đo mà không kiểm
xem phép đo có đầy đủ không*. Bắt được vì bước sau đó (kiểm collision `Popover` trước khi rename) buộc
phải grep lại — tức là quy trình cứu, không phải trí nhớ.

---

## 1. Bảng theo dõi

Status: `TODO` · `WIP` · `DONE` · `SKIP`

| # | Issue | Loại | P | Breaking | M | Status |
| --- | --- | --- | --- | --- | --- | --- |
| I-01 | RSC build failure | Implementation | P0 | Không | M2 | **DONE** — fixture Next pass |
| I-02 | Tree-shaking chết | Implementation | P0 | Không | M2/M3 | **DONE** — 23,6 kB/Button; icons đã tách khỏi barrel |
| I-03 | README setup → UI trắng trơn | Documentation | P0 | Không | M1 | **DONE** — §1–2 viết lại |
| I-04 | Dialog không trap focus | Accessibility | P0 | Có (hành vi) | M1 | **DONE** — QA browser pass |
| I-05 | `TableRow disabled` vô tác dụng | Implementation | P0 | Có (hành vi) | M1 | **DONE** — 19/19 assertion |
| I-06 | Docs site chết, 70% API không tài liệu | Documentation | P0 | Không | M3 | **WIP** — API.md sinh tự động (483 export), còn docs site |
| I-07 | Ví dụ theming sai token | Documentation | P1 | Không | M1 | **DONE** |
| I-08 | `Button` không merge className | Implementation | P1 | Có (hành vi) | M1 | **DONE** — 12/12 assertion |
| I-09 | 41 chuỗi Hàn hardcode | Missing feature | P1 | Có (hiển thị) | M2/M3 | **DONE (a+b)** — 17 default + 4 nhóm prop hoá; (c) provider vẫn tuỳ chọn |
| I-10 | Package 98 MB | Implementation | P1 | Không | M1/M3 | **WIP** — 18,6 MB, còn icon |
| I-11 | Phân loại dependency sai | API | P1 | Có | M2 | **DONE** — 2 gate xanh, xem §0.3 |
| I-12 | `sonner` phantom dependency | API | P1 | Không | M1 | **DONE** — 4/4 assertion |
| I-13 | Thiếu ARIA ở form/table | Accessibility | P1 | Không | M2 | **DONE** — 41/41 assertion |
| I-14 | `PopoverRoot` lệch quy ước | API | P2 | Có | M4 | **DONE** — 10/10 assertion, 5 gate xanh |
| I-15 | TOKENS.md lỗi thời | Documentation | P2 | Không | M1 | **DONE** — 8 dòng, không phải 2 |
| I-16 | Class rác trên `<tr>` | Implementation | P2 | Không | M1 | **DONE** |
| I-17 | Component trùng lặp | API | P2 | Có | M4 | TODO |
| I-18 | Token showcase export như component | API | P2 | Có | M4 | **SKIP** — tiền đề sai, xem §0.9 |
| I-19 | Metadata README/npm sai | Documentation | P2 | Không | M1 | **DONE** |
| I-20 | Checkbox vs Select khác event model | API | P3 | Có | M4 | TODO |
| I-21 | `Select` placeholder truyền 2 lần | API | P3 | Không | M4 | **DONE** — prop chết, không phải bất tiện |
| I-22 | Version drift 1.0.10 ↔ 1.0.14 | Implementation | P3 | Không | M1 | **DONE** — tìm ra root cause |
| **I-23** | `--color-surface-hover/pressed` không tồn tại, 2 component dùng | Implementation | **P1** | Có (hiển thị) | M2 | **DONE** — 2 token, không phải 4 component |
| **I-24** | `dist` trên đĩa là bản build dở (thiếu `build:paths`) | Implementation | **P1** | Không | M2 | **DONE** — đã build đủ 3 stage |
| **I-25** | `build:dts` chết: `build-icon-types` giả định specifier có `.js` | Implementation | **P1** | Không | M2 | **DONE** — xem §3.2 |
| **I-26** | I-13 làm vỡ gate RSC của I-01 — `Button` gắn `onClick` vô điều kiện | Implementation | **P0** | Không | M2 | **DONE** — 15/15 assertion, xem §3.3 |
| **I-27** | Barrel `export *` chứa client module → consumer RSC nhận **cả thư viện** (+500 kB client JS) | Implementation | **P1** | Không | M3 | **DONE** — 6 barrel, −467 kB, xem §3.5 |
| **I-28** | `check:docs` so byte nên **luôn đỏ trên Windows** (CRLF) dù nội dung khớp | Implementation | P2 | Không | M3 | **DONE** — normalise EOL, xem §3.7 |
| **I-29** | 7 component import icon qua barrel ITUI → consumer transform **+7.912 module** mà bundle byte-identical | Implementation | **P1** | Không | M3 | **DONE** — 9.137 → 1.517, xem §3.8 |

---

## 2. P0 — Ship-blockers

### I-01 · Next.js App Router crash khi build

**Vấn đề** — Import package trong Server Component làm `next build` fail:
`TypeError: (0, y.createContext) is not a function`, exit 1.

#### Nguyên nhân — 3 lớp, không phải 1

Report (và bản plan đầu) chỉ thấy lớp 2. Verify lại trong source, có **3** lớp độc lập:

| # | Lớp | Bằng chứng (verified) | Hệ quả |
| --- | --- | --- | --- |
| 1 | **Source thiếu directive** | Guard script quét 142 module → **17 module bắt buộc** cần `"use client"` mà không có (Bảng A); 17 module khác bị grep thô báo oan, thực tế server-safe (Bảng B) | Build dù giữ directive vẫn crash: *không có gì để giữ* |
| 2 | Build xoá directive | `grep -c "use client" dist/index.js` → **0**. `bundle: true` + `splitting: false` gộp 142 module vào 1 file | Directive là **per-module**, không tồn tại được trong bundle 1 file |
| 3 | Inline deps xoá directive của dep | `@radix-ui/react-dialog/dist/index.mjs` dòng 1 là `"use client"`; sau khi inline vào `dist/index.js` thì mất | Đây là nguồn **trực tiếp** của `createContext is not a function` |

> **Kết luận đổi hướng fix:** `esbuild-plugin-preserve-directives` **một mình không fix
> được I-01** — lớp 1 và lớp 3 vẫn nguyên. `banner: { js: '"use client"' }` cũng không:
> nó đóng dấu client cho cả `Button` thuần, và vẫn là bundle 1 file nên I-02 không nhích
> một byte. Cả hai đều là giải pháp nửa vời → **đã loại**.

**Tiêu chí quyết định "module nào cần directive".** React `19.1.2` ở điều kiện
`react-server` chỉ export **21** API:

```
Children, Fragment, Profiler, StrictMode, Suspense, cache, captureOwnerStack,
cloneElement, createElement, createRef, forwardRef, isValidElement, lazy, memo,
use, useCallback, useDebugValue, useId, useMemo, version   (+1 internal)
```

→ `forwardRef` / `memo` / `useId` / `useMemo` / `useCallback` **không** bắt buộc client
(quan trọng: 61 file dùng `forwardRef`, đừng đánh dấu oan cả 61).
Bắt buộc client khi module dùng: `useState` · `useEffect` · `useRef` · `useContext` ·
`createContext` · `useReducer` · `useLayoutEffect` · `useSyncExternalStore` ·
`useImperativeHandle` · `useTransition`, **hoặc** truyền handler định nghĩa cục bộ vào một
client primitive (Radix/embla/sonner/Lexical/daypicker).

#### Bảng A — bắt buộc thêm `"use client"` (17 file)

> ✅ **Cả 17 file đã được thêm `'use client';`** — giữ bảng lại làm hồ sơ *vì sao* từng file
> cần, để lần review sau không ai gỡ ngược.
>
> Số liệu dưới đây do [`scripts/check-client-boundary.ts`](../scripts/check-client-boundary.ts)
> sinh ra (`pnpm check:client`) — **không** phải grep bằng mắt. Grep thô
> cho **3 false positive** mà guard loại đúng: `Sidebar.tsx` và `Lnb.tsx` chỉ *nhắc*
> `createContext / useContext` trong **comment**, `BaseDate.tsx` import
> `{ type Modifiers }` — **type-only, không có dep runtime**. Đó chính là lý do phải có
> guard thay vì audit một lần.

**A1 · Dùng React API không tồn tại ở `react-server` (7 file)** — crash chắc chắn, không
phụ thuộc build:

| File | API vi phạm |
| --- | --- |
| [`accordion/Accordion.tsx`](../src/components/accordion/Accordion.tsx) | `createContext`, `useContext` |
| [`bottom-sheet/BottomSheet.tsx`](../src/components/bottom-sheet/BottomSheet.tsx) | `useState`, `useEffect`, `useRef` |
| [`breadcrumb/Breadcrumb.tsx`](../src/components/breadcrumb/Breadcrumb.tsx) | `createContext`, `useContext` |
| [`carousel/Carousel.tsx`](../src/components/carousel/Carousel.tsx) | `useState`, `useEffect`, `createContext`, `useContext` |
| [`rating/Rating.tsx`](../src/components/rating/Rating.tsx) | `useState` |
| [`sidebar/SidebarGroup.tsx`](../src/components/sidebar/SidebarGroup.tsx) | `useState` |
| [`stepper/Stepper.tsx`](../src/components/stepper/Stepper.tsx) | `createContext`, `useContext` |

**A2 · Import dep client-only *không tự khai báo* boundary (9 file)** — verified:
`radix-ui@1.4.3` bản `.mjs` **không có** `"use client"` (nó `import * as X from
'@radix-ui/react-*'` rồi re-export namespace); `embla-carousel-react` cũng không:

[`avatar/Avatar.tsx`](../src/components/avatar/Avatar.tsx) ·
[`lnb/Lnb.tsx`](../src/components/lnb/Lnb.tsx) ·
[`modals/modal.tsx`](../src/components/modals/modal.tsx) ·
[`popup/Popup.tsx`](../src/components/popup/Popup.tsx) ·
[`progress/Progress.tsx`](../src/components/progress/Progress.tsx) ·
[`radio/Radio.tsx`](../src/components/radio/Radio.tsx) ·
[`scroll/Scroll.tsx`](../src/components/scroll/Scroll.tsx) ·
[`slider/Slider.tsx`](../src/components/slider/Slider.tsx) ·
[`toggle/Toggle.tsx`](../src/components/toggle/Toggle.tsx)

**2 cách clear**, guard chấp nhận cả hai: **(i)** thêm `"use client"`, hoặc **(ii)** đổi
sang package `@radix-ui/react-*` riêng lẻ theo **I-11** — package riêng **tự** ship directive
nên guard tự hết báo. Khuyến nghị (ii): I-11 dù sao cũng phải làm, và giữ được component
server-renderable.

**A3 · Truyền handler cục bộ vào client primitive (1 file)** — guard **không** phát hiện
được loại này (dep tự khai báo boundary nên R2 im lặng), fixture Next trong CI mới bắt:

| File | Lý do |
| --- | --- |
| [`dialog/dialog.tsx`](../src/components/dialog/dialog.tsx) | `onOpenAutoFocus={(e) => …}` ([`:73`](../src/components/dialog/dialog.tsx#L73)) → *"Functions cannot be passed directly to Client Components"*. Ghi chú: `Popup.tsx` cũng có handler cục bộ nhưng đã bị A2 bắt |

#### Bảng B — **KHÔNG** thêm directive, giữ server-safe (17 file)

**B1 · Chỉ import `@radix-ui/react-slot` (10 file).** Verified: `react-slot/dist/index.mjs`
**không có** `"use client"` và chỉ dùng `forwardRef` / `Children` / `cloneElement` /
`isValidElement` — toàn bộ nằm trong 21 API `react-server`. Đánh dấu client ở đây là **đóng
dấu oan**:

[`backdrop/`](../src/components/backdrop/Backdrop.tsx) ·
[`colors/`](../src/components/colors/Colors.tsx) ·
[`floating-button/`](../src/components/floating-button/FloatingButton.tsx) ·
[`gnb/`](../src/components/gnb/Gnb.tsx) ·
[`list/`](../src/components/list/List.tsx) ·
[`navigation-v2/`](../src/components/navigation-v2/NavigationV2.tsx) ·
[`radius/`](../src/components/radius/Radius.tsx) ·
[`shadow/`](../src/components/shadow/Shadow.tsx) ·
[`spacing/`](../src/components/spacing/Spacing.tsx) ·
[`typography/`](../src/components/typography/Typography.tsx)

**B2 · Import package Radix riêng lẻ, dep tự tạo boundary (5 file).** Verified dòng 1 bản
`.mjs` của `react-tooltip` / `react-tabs` / `react-popover` / `react-dropdown-menu` đều là
`"use client"`:

[`tooltip/tooltip.tsx`](../src/components/tooltip/tooltip.tsx) ·
[`tabs/tabs.tsx`](../src/components/tabs/tabs.tsx) ·
[`popover/PopoverRoot.tsx`](../src/components/popover/PopoverRoot.tsx) ·
[`dropdown-menu/dropdown-menu.tsx`](../src/components/dropdown-menu/dropdown-menu.tsx) ·
[`overflow-menu/OverflowMenu.tsx`](../src/components/overflow-menu/OverflowMenu.tsx)

**B3 · Grep thô báo oan (2 file)** — [`sidebar/Sidebar.tsx`](../src/components/sidebar/Sidebar.tsx#L50)
(comment "No createContext / useContext") · [`calendar/BaseDate.tsx`](../src/components/calendar/BaseDate.tsx)
(`import { type Modifiers }` — type-only).

Ghi chú: 5 file [`input/`](../src/components/input/) (`InputFieldShell`, `InputSearch`,
`InputV2`, `InputWithButton`, `InputGroup`) đang **có** directive mà không phát hiện lý do —
vô hại, giữ nguyên; chúng đều compose từ `Input.tsx` (đã là client).

**Impact** — Chặn kiến trúc React phổ biến nhất hiện nay. Dev chỉ thấy minified stack
trace, không có tài liệu nào nhắc `"use client"`. Kể cả `Button` thuần presentational
cũng không dùng được trong RSC.

**Loại** Implementation (build config + source) · **Priority** P0 · **Breaking** Không

#### Solution — 3 phần, làm đúng thứ tự

**(a) Guard tự động + sửa source.** ✅ **Guard đã viết xong:**
[`scripts/check-client-boundary.ts`](../scripts/check-client-boundary.ts). Hai rule, cả hai
suy ra từ dữ kiện thay vì danh sách chép tay:

- **R1** — module dùng React API không tồn tại ở điều kiện `react-server`. Named import được
  đọc từ chính câu `import`, `React.x` được đọc trên bản **đã strip comment**, PascalCase bị
  bỏ qua (đều là type), `import type` / `{ type X }` bị bỏ qua
- **R2** — module import dep client-only mà dep **không tự** ship `"use client"`. Việc dep có
  tự khai báo hay không được **đọc từ ESM entry của dep lúc chạy**, nên nâng version dep có
  thêm directive thì rule tự nới, và bỏ `radix-ui` umbrella theo I-11 thì báo động tự tắt

Self-test trên fixture: `useState` không directive → **fail** · có directive → pass ·
`forwardRef`/`memo`/`useId`/`useMemo` → pass (không đóng dấu oan 61 file dùng `forwardRef`) ·
`{ type Modifiers }` → pass · hook chỉ nằm trong comment → pass. Exit code 1 khi có vi phạm.

✅ **Đã xong nốt phần source:** 17 file Bảng A có `'use client';` (34 dòng thêm, không sửa gì
khác), Bảng B giữ nguyên, guard xanh. Wire vào [`package.json`](../package.json):
`check:client` + `prebuild` — verified pnpm `10.23.0` chạy `prebuild` tự động, không cần
`enable-pre-post-scripts`.

✅ **CI:** [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) — job `client-boundary`
chạy trên mọi PR và push `main`.

> **Job phải nằm ở repo này, không phải monorepo cha.** `packages/ui` là submodule
> (`platform-echoit/itui.css`); PR sửa component land ở đây, còn repo cha chỉ thấy **con trỏ
> submodule bị bump** — guard gắn vào [`deploy.yml`](../../../.github/workflows/deploy.yml)
> của cha sẽ không bao giờ thấy thay đổi thật. Thêm nữa `deploy.yml` là pipeline deploy app,
> nó **không** build `packages/ui`.

Job dùng `pnpm install --frozen-lockfile` — cần node_modules vì R2 phải resolve ESM entry của
từng dep. ⚠️ Lockfile riêng của submodule **không** được `pnpm i` ở workspace cha cập nhật,
nên khi đổi dependency phải refresh bằng `pnpm i --lockfile-only --ignore-workspace`, không thì
CI đỏ ở bước install. Verify hôm nay: khớp 32/32 dep, 0 specifier lệch.

**(b) Bỏ bundling, emit per-file** — ✅ **đã làm.** `bundle: false` trong
[`tsup.config.ts`](../tsup.config.ts), directive giữ nguyên đúng vị trí tác giả đặt, module
graph 1:1, **không cần plugin bên thứ 3, không cần `splitting`**.

Kết quả build thật (`pnpm build`, 65s):

| Đo | Trước | Sau |
| --- | --- | --- |
| npm packed (consumer tải về) | — | **4,6 MB** |
| npm unpacked | ~98 MB | **24,6 MB** |
| `dist/index.js` | 1 module **17,8 MB** | re-export thuần, **~2 KB** |
| `dist/index.cjs` + 2 sourcemap | ~59 MB | **không còn** |
| File trong dist | 16.129 | 24.163 (mirror 1:1 — xem §7) |
| `"use client"` trong dist | **0** | **42 file** (25 cũ + 17 mới), `Button.js` = 0 ✓ |

Trong 23,5 MB dist thì **icons chiếm 23,0 MB (98%)** — component chỉ 0,5 MB. `.d.ts.map`
còn 3,2 MB nữa mà consumer không dùng được (`declarationMap`), gộp vào I-10 xử lý.

So sánh 3 hướng đã cân:

| | `banner` | plugin + `splitting:true` | **`bundle: false`** |
| --- | --- | --- | --- |
| Fix được lớp 1 / 3 | ✗ / ✗ | ✗ / ✗ | ✗ (do (a) lo) / **✓** |
| Phụ thuộc plugin thứ 3 | Không | **Có** (suy luận directive theo *chunk*) | **Không** |
| Rủi ro chunking (§7) | Không | **Cao** | **Biến mất** |
| Directive của Radix | Mất | Mất | **Sống** |
| Fix luôn I-02 | Không | Một phần | **Có** |
| Khớp `.d.ts` | Không | Không | **Có** — `dist/components/dialog/dialog.d.ts` đã 1:1 sẵn |

Lý do mạnh nhất: [`tsconfig.components.json`](../tsconfig.components.json) **đã** emit
`.d.ts` bundleless 1:1 rồi (`dist/components/dialog/dialog.d.ts` tồn tại). JS đang là thứ
duy nhất lệch chuẩn — sửa xong thì JS / types / subpath export (I-02) tự khớp.

**(c) CJS — ✅ đã chốt: bỏ, ESM-only.** Lý do CJS bundleless không dùng được: nó emit
`require("../../lib/utils")` **không có extension** → trong package `"type": "module"`, Node
resolve ra `utils.js` (ESM) → `ERR_REQUIRE_ESM`. Hai hướng còn lại (CJS bundled 1 file · CJS
bundleless + rewrite) đều thêm hạ tầng cho một format mà **không consumer nào trong repo dùng**
(verified: 0 chỗ `require()`; `apps/storybook` alias thẳng vào `src`, `apps/web` dùng
`transpilePackages`).

Đã bỏ khỏi [`package.json`](../package.json): field `main`, và điều kiện `require` trong
`exports`. ⚠️ **Breaking với consumer npm bên ngoài đang `require()`** — không đo được từ trong
repo, nên phải ship kèm changelog rõ (hoặc dồn vào `2.0.0`).

#### 3 việc bắt buộc kèm theo — ✅ đã xử lý cả 3

| # | Việc | Kết quả thật |
| --- | --- | --- |
| 1 | `isolatedModules: true` trong [`tsconfig.json`](../tsconfig.json) | Bật rồi → **0 lỗi**, không phải sửa `import type` chỗ nào. ⚠️ **Không** dùng `verbatimModuleSyntax`: 6.607 file icon viết `import { SVGProps } from 'react'` (thiếu `type`) → TS1484 hàng loạt |
| 2 | Extension cho relative import | Thêm [`scripts/fix-esm-paths.ts`](../scripts/fix-esm-paths.ts) (`build:paths`, chạy sau `build:dts`): **16.337 specifier / 2.734 file**. Source giữ style extensionless như cũ. Script **tra filesystem** chứ không nối `.js` bừa — `./components/button` phải thành `./components/button/index.js`. Rewrite cả `.d.ts` (TS map `./x.js` → `./x.d.ts`, đúng dạng NodeNext cần). Idempotent: chạy lần 2 = 0 rewrite. Không resolve được specifier nào thì **exit 1** thay vì đoán |
| 3 | Entry CSS riêng | `tsup.config.ts` giờ là **array 2 config**: JS bundleless + CSS bundled (`entry: { index: 'src/styles/global.css' }` để giữ đúng path `dist/index.css`; `clean: false` kẻo xoá JS vừa emit). Diff với bản cũ: **chỉ mất đúng dòng `/*# sourceMappingURL=index.css.map */`** (do tắt sourcemap), phần CSS **byte-identical** |

**Kèm 1 thay đổi hành vi cần biết.** `dist/index.js` giờ giữ lại import CSS thật —
`fix-esm-paths` trỏ nó sang `./index.css` (trước esbuild ăn mất, và đó **là** root cause của
I-03). Nghĩa là `import '@echoit/itui.css'` trong `main.tsx` **giờ load style thật**. Hai hệ quả:

- Phải thêm `"./dist/index.js"` vào `sideEffects`, nếu không bundler coi barrel là
  side-effect-free và **drop luôn import CSS khi tree-shake** → dev có style, production build
  mất style. Đã thêm.
- Consumer **chưa cấu hình Tailwind v4** sẽ chuyển từ "UI không style, im lặng" sang **build
  error** ở `@import "tailwindcss"`. Ồn ào hơn nhưng đúng hơn — package vốn bắt buộc Tailwind
  (xem I-11).

#### Kiểm chứng bằng điều kiện `react-server` của Node

`node --conditions=react-server` làm `react` resolve sang bản server (không có `createContext`,
`useState`; **có** `forwardRef`). Import trực tiếp từng module trong `dist`:

| Module | Kỳ vọng | Thực tế |
| --- | --- | --- |
| `button`, `typography`, `list` (Bảng B1, dùng `Slot`) | load được | ✅ load, export đúng — **chứng minh B1 server-safe, không cần đóng dấu** |
| `Accordion`, `Rating`, `Stepper` (Bảng A1) | crash | ✅ crash đúng API thiếu (`createContext` / `useState`) |
| `tooltip` (Bảng B2) | load được | ❌ crash `useLayoutEffect` |

⚠️ **Case B2 là giới hạn của phép thử, không phải phản chứng.** Node **không** hiểu
`"use client"`, nên nó cứ evaluate luôn code của `@radix-ui/react-tooltip`; trong RSC thật thì
directive của dep tạo boundary và code đó không bao giờ chạy trên server (giống `next/link`).
Phép thử này chỉ kết luận được cho module mà **bản thân nó + dep không-client** đều server-safe.

✅ **Đã chốt bằng fixture Next:** cả 5 file B2 render được từ Server Component — xem Acceptance
test bên dưới. Giữ nguyên, **không** thêm directive cho chúng.

**Cái giá phải trả** — `bundle: false` ⇒ deps **không còn inline** vào dist. Nghe giống
`external` đã bị loại ở I-02, nhưng khác điểm cốt tử: deps **vẫn nằm nguyên trong
`dependencies`**, consumer `npm i` là có đủ, *không* phải cài tay như `peerDependencies`.
Lexical vẫn đi kèm package, chỉ là ở `node_modules` thay vì trong `dist/index.js`. Đổi lại:
fix lớp 3, fix luôn I-10 (98 MB).

**File** — [`tsup.config.ts`](../tsup.config.ts) · [`tsconfig.json`](../tsconfig.json) ·
[`package.json`](../package.json) · 17 file ở Bảng A ·
[`scripts/check-client-boundary.ts`](../scripts/check-client-boundary.ts) ·
[`scripts/fix-esm-paths.ts`](../scripts/fix-esm-paths.ts) ·
[`.github/workflows/ci.yml`](../.github/workflows/ci.yml)

#### Acceptance test — ✅ **I-01 đã qua gate**

Fixture: [`fixtures/next-app/`](../fixtures/next-app/) · runner
[`scripts/check-rsc.ts`](../scripts/check-rsc.ts) (`pnpm check:rsc`) · job CI `rsc-fixture`.

Fixture cài **tarball đã pack**, không phải workspace link — symlink sẽ resolve `react` từ
`packages/ui/node_modules` → 2 bản React, một lỗi chẳng liên quan gì đến thứ đang test. Tarball
còn kiểm luôn hợp đồng `files` / `exports` thật.

| # | Test | Kết quả |
| --- | --- | --- |
| 1 | Server Component (không directive) import **barrel** → `next build` | ✅ pass, prerender `/` thành static |
| 2 | **5 file B2** render từ Server Component | ✅ pass — **xác nhận B2 server-safe thật**, cái crash ở probe Node đúng là artifact |
| 3 | **Không** `transpilePackages` trong `next.config.ts` | ✅ package chạy như dependency thường (`apps/web` hiện vẫn cần flag này) |
| 4 | CSS tới được output dù fixture **không import CSS** ở đâu cả | ✅ `.next/static/chunks/*.css` (100 KB) có `--color-brand`, `--radius-lg`, `#009ce0` → **I-03 happy path thông** |
| 5 | Node ESM resolve subpath: `import('./dist/components/button/index.js')` | ✅ export `Button`; `cn('a','p-2','p-4')` → `'a p-4'` |
| 6 | `dist/index.css` byte-identical bản cũ | ✅ trừ dòng `sourceMappingURL` |

**Negative control — fixture có thật sự bắt lỗi không?** Xoá directive trong `dist/` rồi build lại:

| Xoá `"use client"` khỏi | Kết quả |
| --- | --- |
| `stepper/Stepper.js` — `createContext` ở **module scope** | ✗ fail đúng lỗi gốc I-01: `TypeError: (0 , g.createContext) is not a function` → *Failed to collect page data* |
| `rating/Rating.js` — `useState` trong **thân component** | ⚠️ **vẫn pass** |

⚠️ **Đây là giới hạn thật, phải biết:** client API ở module scope vỡ ngay lúc import; còn hook
chỉ vỡ khi component **render**, mà fixture chỉ *reference* phần lớn client component chứ không
render (prop shape của chúng không phải việc của fixture). ⇒ hai lớp check **bù nhau, không cái
nào đủ một mình**:

- `pnpm check:client` — static, bắt **mọi** client API thiếu directive, kể cả render-time
- `pnpm check:rsc` — integration, bắt vỡ boundary/packaging mà static không thấy

---

### I-02 · Tree-shaking không hoạt động — 1 Button = 229 kB gzip

**Vấn đề** — Import mỗi `Button` làm bundle tăng 190 kB → 974 kB (+229 kB gzip), kéo theo
Lexical, sonner, date-fns, calendar, carousel. README quảng cáo ngược lại.

**Nguyên nhân** — Cùng một root cause với I-01 lớp 2: `entry: ['src/index.ts']` +
`bundle: true` + `splitting: false` → `dist/index.js` là **một module 17 MB** re-export
toàn bộ. Bundler của consumer không có đường nào drop code trong *một* module. Nặng thêm:
[`src/index.ts:59`](../src/index.ts#L59) `export * from './icons/ITUI'` kéo **6.648 icon
component** (7.913 file trong [`src/icons/`](../src/icons/)) vào cùng module đó. Không có
subpath export nào trong `package.json` ngoài CSS.

**Impact** — Không dùng được cho sản phẩm quan tâm performance. 24 component tiếp theo chỉ
tốn thêm 67 kB — nghĩa là chi phí *nào cũng* là chi phí toàn bộ thư viện.

**Loại** Implementation (packaging) · **Priority** P0 · **Breaking** Không (giữ barrel)

**Solution** — **I-02 phần lớn là hệ quả miễn phí của I-01(b).** `bundle: false` cho ra
`dist/**` mirror source 1:1, mỗi component là một ES module riêng → consumer tree-shake được
*thật*, không phụ thuộc việc esbuild chunk có đoán đúng hay không.

1. ✅ **Bỏ `splitting`/`treeshake` khỏi kế hoạch** — bundleless không có chunk nên không cần
   (và đây là lý do rủi ro lớn nhất ở §7 biến mất)
2. ✅ **Subpath exports** — thêm vào [`package.json`](../package.json) dạng **pattern** thay
   vì liệt kê 49 dòng: `"./*"` → `./dist/components/*/index.js` (+ `types`). Component mới tự
   động có subpath, không phải sửa gì. Kèm `"./icons"` và `"./package.json"` (thiếu cái sau
   thì tool đọc manifest của dep bị `ERR_PACKAGE_PATH_NOT_EXPORTED` — I-11)
3. ✅ **Tách `icons` khỏi barrel** — **đã làm ở M3** (2026-08-04). Icons ship qua subpath
   `@echoit/itui.css/icons`, entry mới là [`src/icons/index.ts`](../src/icons/index.ts) để
   **một cách viết** resolve giống nhau qua cả 3 đường: `exports` của npm, `paths` tsconfig của
   `apps/web`, alias Vite của `apps/storybook`. Breaking: **20 file trong `apps/`** đã đổi
   (41 named import + 2 deep-import — xem §0.8). ⚠️ Bản thân việc gỡ dòng barrel **không** giảm
   được module nào — đòn bẩy thật là **I-29** (§3.8)
4. ✅ Giữ `sideEffects` — nhưng đã **thêm `"./dist/index.js"`**, xem I-01(b): thiếu nó thì
   bundler drop import CSS của barrel khi tree-shake

> ⚠️ **Về `external`:** user đã chốt bundle Lexical vào dist thay vì `external` +
> `peerDependencies`. `bundle: false` **có** thay đổi điều này (deps thành import runtime),
> nhưng deps vẫn ở `dependencies` nên consumer không phải cài tay — xem mục
> **"Cái giá phải trả"** ở I-01. Cần user xác nhận trước khi làm.

**File** — [`tsup.config.ts`](../tsup.config.ts) · [`package.json`](../package.json)
(`exports`, `main`/`module`) · [`src/index.ts`](../src/index.ts) ·
[`tsconfig.components.json`](../tsconfig.components.json)

#### Acceptance test — ✅ đã đo

Fixture [`fixtures/vite-app/`](../fixtures/vite-app/) · runner
[`scripts/check-bundle.ts`](../scripts/check-bundle.ts) (`pnpm check:bundle`) · job CI
`bundle-size`. Build **3 lần riêng biệt** (build chung sẽ để Rollup hoist chunk chung làm nhoè
số đo), mỗi lần 1 entry, rồi lấy **delta so với baseline React-only** — nên con số là chi phí
của thư viện, không lẫn gì khác:

| entry | JS raw | JS gzip | vs baseline | CSS | module transform |
| --- | --- | --- | --- | --- | --- |
| `baseline` (React only) | 189,2 kB | 59,1 kB | — | 0 | 25 |
| `barrel` (`from '@echoit/itui.css'`) | 212,7 kB | 66,9 kB | **+23,5 kB** | 97,5 kB | **15.407** |
| `subpath` (`from '@echoit/itui.css/button'`) | 212,7 kB | 66,9 kB | +23,5 kB | **0 kB** | **31** |

**Một `Button` = 23,5 kB raw / 7,8 kB gzip** — trước là +229 kB gzip. Budget 260 kB raw của
plan giờ dư 10x.

Ba điều rút ra từ bảng này, đều không đoán được trước khi đo:

1. **Barrel và subpath cho bundle byte-identical** ⇒ tree-shaking xuyên barrel hoạt động, và
   **tách `icons` khỏi barrel không giúp gì cho bundle size**. Lý do duy nhất còn lại để tách
   là dev mode.
2. **15.407 vs 31 module transform.** Vite/Next dev **không** tree-shake ⇒ mỗi lần load page ở
   dev, import qua barrel phải nạp 15.4k module. Đây mới là lý do thật để dùng subpath, và là
   lý do thật để tách `icons` (M4).
3. ⚠️ **Subpath không kéo CSS** (0 kB) trong khi barrel có (97,5 kB). Consumer dùng subpath
   **phải tự** `@import '@echoit/itui.css/dist/index.css'`. Phải viết rõ trong README (I-03),
   không thì lại là một kiểu fail im lặng nữa.

---

### I-03 · Làm theo README → toàn bộ UI không style, im lặng

**Vấn đề** — [`README.md:90-94`](../README.md#L90-L94) bảo `import '@echoit/itui.css'` trong
`main.tsx`. Kết quả: 0 CSS rule của thư viện, button cao 21px nền xám, **không warning nào**.

**Nguyên nhân** — Bare specifier resolve qua điều kiện `import` → `dist/index.js` (JS entry),
không phải `dist/index.css`. Điều kiện `style` không được JS import tra tới.

**Impact** — Defect nặng nhất trong toàn bộ evaluation: happy path chính thức thất bại
**im lặng**. Kết hợp I-06 (docs site chết) thì dev không có đường thoát nào.

**Loại** Documentation · **Priority** P0 · **Breaking** Không

**Solution** — Viết lại §1–2:
- Install kèm `tailwindcss @tailwindcss/vite`, đưa Tailwind v4 vào **bước install**, không
  để dưới "Requirements"
- ⚠️ **Đổi so với bản plan đầu:** sau I-01b thì `import '@echoit/itui.css'` trong `.tsx`
  **đã load style thật** (`dist/index.js` giữ lại `import './index.css'`). Bỏ hẳn cảnh báo
  "import từ .tsx sẽ không load styles" — nó không còn đúng. Thay bằng: nêu **cả hai** đường
  (barrel JS *hoặc* `@import '@echoit/itui.css/dist/index.css'` trong file CSS), và nói rõ
  Tailwind v4 là **bắt buộc** — thiếu nó giờ là build error chứ không phải UI không style
- 🛑 **ĐÍNH CHÍNH — KHÔNG được xoá `@source`.** Bản plan đầu (theo evaluator) nói `@source`
  là no-op vì "build có/không nó ra CSS byte-identical". **Sai, và sai nguy hiểm.** Đo trong
  fixture Vite bằng cách xoá `@source` khỏi CSS đã cài trong `node_modules`:
  **CSS của consumer tụt 99,8 kB → 7,34 kB.** Tailwind v4 **không** tự quét `node_modules`,
  nên không có `@source` thì consumer nhận đúng token và **không có utility class nào** →
  UI không style. Đúng cái fail im lặng mà I-03 đang muốn dẹp.
  - Việc cần làm ngược lại: **giữ** `@source`, nhưng **thu hẹp phạm vi**. Trong `src` thì
    `@source "../"` nghĩa là "quét src/"; copy y nguyên sang `dist/index.css` thì nó thành
    "quét cả package đã publish", kéo Tailwind bò qua 23k file icon.
    [`scripts/fix-esm-paths.ts`](../scripts/fix-esm-paths.ts) rewrite thành `@source "./"`:
    output **byte-identical** (99,80 kB) mà consumer build **nhanh hơn 35%** (34,7s → 22,4s).
    Script **fail** nếu không tìm thấy `@source` — coi nó là load-bearing, không phải rác.
  - Còn phải sửa README chỗ prose/code block lệch nhau ([`README.md:40,46`](../README.md#L40)),
    nhưng theo hướng **giải thích `@source` là bắt buộc**, không phải xoá nó

**File** — [`README.md`](../README.md)

**Acceptance test** — Copy-paste README vào Vite app mới → thấy button có style ngay lần chạy đầu.

---

### I-04 · Dialog không trap focus (a11y nghiêm trọng)

**Vấn đề** — Mở dialog bằng bàn phím: focus ở nguyên trigger, Tab đi xuyên qua nội dung
phía sau overlay, `aria-modal` = null. Trong khi `body { pointer-events: none }` chặn chuột.

**Nguyên nhân** — **Tìm thấy chính xác**: [`dialog.tsx:73-76`](../src/components/dialog/dialog.tsx#L73-L76)
gọi `e.preventDefault()` **vô điều kiện** trong `onOpenAutoFocus`, huỷ luôn cơ chế focus của
Radix. Consumer truyền `onOpenAutoFocus` cũng **không** undo được vì preventDefault chạy trước.

```tsx
onOpenAutoFocus={(e) => {
  e.preventDefault();      // ← thủ phạm
  onOpenAutoFocus?.(e);
}}
```

**Impact** — Modal "mouse-modal nhưng keyboard-transparent" — tổ hợp tệ nhất. User bàn
phím/screen reader không chạm được nút Cancel/Delete của chính dialog, nhưng *lại* tab được
vào nội dung bị overlay che. Mâu thuẫn trực tiếp claim "🦾 Accessible by default".

**Loại** Accessibility · **Priority** P0 · **Breaking** **Có (hành vi)** — ghi changelog

**Solution** — Bỏ `e.preventDefault()`, chỉ forward `onOpenAutoFocus?.(e)` để consumer tự
quyết. Rà `BottomSheet` / `modals` / `popup` xem có pattern tương tự không.

**File** — [`src/components/dialog/dialog.tsx`](../src/components/dialog/dialog.tsx#L73-L76)
· rà [`modals/`](../src/components/modals/) · [`popup/`](../src/components/popup/) ·
[`bottom-sheet/`](../src/components/bottom-sheet/)

**Acceptance test** — Mở dialog bằng bàn phím, Tab 6 lần, assert focus không rời khỏi dialog.

---

### I-05 · `TableRow disabled` không disable gì cả

**Vấn đề** — README document `disabled?: boolean` nhưng row vẫn click được, vẫn fire
`onClick`, vẫn select được; `aria-disabled` null, `pointer-events: auto`, `opacity: 1`.

**Nguyên nhân** — [`Table.tsx:98`](../src/components/table/Table.tsx#L98): prop chỉ đổi class
nền `bg-neutral-subtle`, không chạm ARIA hay handler.

```tsx
selected ? 'bg-neutral-100' : disabled ? 'bg-neutral-subtle' : 'bg-white',
```

**Impact** — API có tài liệu nhưng vô tác dụng — tệ hơn API thiếu, vì nó lọt review chứ
không fail compile. Dev tin là đã disable → bug logic ngầm.

**Loại** Implementation + Accessibility · **Priority** P0 · **Breaking** **Có (hành vi)**,
nhưng là sửa về đúng hợp đồng đã document

**Solution** — Set `aria-disabled="true"`, `data-disabled`, `pointer-events-none`, giảm
opacity, và chặn `onClick`/`onKeyDown` khi disabled.

**File** — [`src/components/table/Table.tsx:89-103`](../src/components/table/Table.tsx#L89-L103)

---

### I-06 · Docs site chết, ~70% API không có tài liệu

**Vấn đề** — `https://itui.echoit.co.kr` → `ENOTFOUND`, vẫn đánh dấu `<!-- TODO: update -->`
([`README.md:440`](../README.md#L440)). README document **17** component; barrel export
**49 module** (riêng `input` đã 13 component).

**Nguyên nhân** — Site chưa từng được deploy; README không cập nhật theo tốc độ thêm component.

**Impact** — Đo được cụ thể (F-14): cần label gói cước, README chỉ có `Badge` → dev dùng
`Badge` → "Enterprise" render thành **"erp"** vì `Badge` là component đếm notification.
`Tag`/`Chip` mới đúng, thiết kế tốt, JSDoc tốt — **không có trong README**.
Tài liệu hiện tại *chủ động dẫn dev đi sai*.

**Loại** Documentation · **Priority** P0 · **Breaking** Không

**Solution**
- ✅ **Gỡ link chết** — xong ở M1
- ✅ **Sinh reference tự động** — [`scripts/generate-api-docs.ts`](../scripts/generate-api-docs.ts)
  → [`API.md`](../API.md), **483 export / 56 module / 2.649 dòng**. Xem chi tiết §3.6
- ✅ **README thôi trùng lặp** — 17 bảng props hand-written **bị gỡ**, thay bằng deep link tới
  anchor API.md. Giữ lại toàn bộ code example + phần prose mà generator không viết được
- ⬜ **Trung hạn** — deploy docs site; cân nhắc tận dụng `apps/storybook` đã có

**File** — [`README.md`](../README.md) · [`API.md`](../API.md) **(mới, generated)** ·
[`scripts/generate-api-docs.ts`](../scripts/generate-api-docs.ts) **(mới)** ·
[`package.json`](../package.json) (`docs:api`, `check:docs`) ·
[`.github/workflows/ci.yml`](../.github/workflows/ci.yml) (job `api-docs`)

---

## 3. P1 — Giá trị cao, chi phí thấp

### 3.1 Hai defect phát hiện khi làm M1 (không có trong evaluation)

#### I-23 · `--color-surface-hover` / `--color-surface-pressed` không tồn tại — ✅ DONE

**Vấn đề** — Component dùng `bg-surface-hover` / `bg-surface-pressed`, nhưng **cả hai token
đều không có trong `@theme`**. Tailwind không sinh rule cho token không định nghĩa, nên các state
này **chết im lặng**:

| Component | Class | Hệ quả |
| --- | --- | --- |
| [`button/Button.tsx:135-136`](../src/components/button/Button.tsx#L135-L136) | `hover:bg-surface-hover` · `active:bg-surface-pressed` | variant `ghost` **không có phản hồi hover/pressed nào** |
| [`avatar/Avatar.tsx:102-103`](../src/components/avatar/Avatar.tsx#L102-L103) | `bg-surface-hover` · `bg-surface-pressed` | 2 variant nền trong suốt |
| ~~`popover/Popover.tsx`~~ | — | **báo oan** (§0.2): dùng `hover:bg-muted active:bg-secondary` |
| ~~`sidebar/Sidebar.tsx`~~ | — | **báo oan** (§0.2): dùng `bg-sidebar-accent` / `bg-secondary` |

**Nguyên nhân** — Comment trong chính các file đó ghi `(in @theme)`, tức tác giả tin là đã có.
Token thật mang tên khác và **lệch một bậc** so với tên: `--color-surface-neutral-subtle` =
`#f5f5f5`, `-neutral-hover` = `#ededed`, `-neutral-pressed` = `#dadada`; trong khi comment
component muốn `#f5f5f5` cho hover và `#ededed` cho pressed.

Đây chính là 2 dòng `TODO` mà [`TOKENS.md`](../TOKENS.md) đã mang từ đầu — nhưng TOKENS.md chỉ
ghi "value not specified", **không** ghi rằng đã có 4 component phụ thuộc vào chúng.

**Solution** — ✅ **Đã làm.** Thêm 2 token vào `@theme` theo đúng ý comment:

```css
--color-surface-hover: #f5f5f5; /* surface/neutral/secondary/hover */
--color-surface-pressed: #ededed; /* surface/neutral/secondary/pressed */
```

⚠️ Đây là **thay đổi hiển thị** cho 2 component — `Button` variant `ghost` và `Avatar` — từ
"không có hover" thành "có hover". Đúng ý thiết kế. `dist/index.css` đã rebuild và verify có cả
2 khai báo.

⚠️ **2 token này là `@theme` hex phẳng nên không theo dark mode.** Cặp `@theme inline`
(`bg-muted` / `bg-secondary` / `bg-sidebar-accent`) trùng giá trị ở light mode mà **có** theo dark
mode — đó là thứ `Popover` và `Sidebar` đang dùng, và là lựa chọn đúng cho surface cần theming.
Comment sai ở 2 file đó đã sửa lại cho khớp code.

**File** — [`src/styles/global.css`](../src/styles/global.css) · [`TOKENS.md`](../TOKENS.md) (2
entry `⚠️ not defined` → giá trị thật, chuyển sang bảng *Resolved*, ghi rõ bẫy off-by-one so với
neutral ramp) · [`popover/Popover.tsx`](../src/components/popover/Popover.tsx) ·
[`sidebar/Sidebar.tsx`](../src/components/sidebar/Sidebar.tsx) (comment)

#### I-24 · `dist` trên đĩa là bản build dở

**Vấn đề** — `dist` hiện tại chạy `build:js` + `build:dts` mà **không** chạy `build:paths`, nên
mang đúng 3 lỗi mà script đó sinh ra để sửa:

| Bằng chứng | Hệ quả |
| --- | --- |
| `dist/index.js:1` là `import "./styles/global.css"` và **`dist/styles/` không tồn tại** | Barrel import một file không có → consumer vỡ ngay |
| `dist/components/button/index.js:1` là `export * from "./Button"` (thiếu `.js`) | Node ESM `ERR_MODULE_NOT_FOUND` |
| `dist/index.css:4` vẫn là `@source "../"` | Tailwind bò qua 23k file icon (mất 35% thời gian build của consumer) |

**Nguyên nhân** — `build` là 3 stage (`build:js && build:dts && build:paths`); ai chạy `build:js`
riêng sẽ để dist ở trạng thái trông-như-xong. `dist` bị gitignore nên CI không bắt được.

**Solution** — ✅ Đã ghi cảnh báo vào [`DEVELOPMENT.md`](../DEVELOPMENT.md) bước 1, và **đã chạy
`pnpm build` đủ 3 stage** (2026-07-30): `build:js` 46s → `build:dts` (6.613 icon type, 7.868 file
`.d.ts` gỡ bỏ) → `build:paths` (8.475 specifier / 1.472 file, `@source "../"` → `"./"`). Cân nhắc:
thêm guard vào `check:package`.

#### 3.2 · I-25 — `build:dts` chết vì `build-icon-types` giả định specifier có `.js`

**Phát hiện khi chạy `pnpm build` đầy đủ cho I-24** — build dừng ở stage 2, exit 1:

```
✗ barrel re-exports icons but …\dist\icons\ITUI\icons does not exist
```

**Nguyên nhân** — Script resolve target bằng `match[1].replace(/\.js$/, '.d.ts')`. Nhưng nó chạy
**trước** `build:paths`, nên specifier của tsc vẫn còn nguyên dạng extensionless
(`export * from './icons'`) — `.replace` thành **no-op**, và nó đi tìm một path không có đuôi.
Sai với **cả 1.263 dòng** của barrel, không riêng dòng đầu: `./icons` là file
(`icons.d.ts`), 1.262 dòng còn lại là **thư mục** (`address-book/index.d.ts`).

Đây là lý do thật khiến `dist` ở trạng thái dở của I-24: không phải "ai đó chạy `build:js` riêng",
mà là **`pnpm build` chưa từng chạy hết** kể từ lần script này được viết lại.

**Solution** — ✅ Tra filesystem thay vì nối đuôi, đúng kỷ luật mà
[`fix-esm-paths.ts`](../scripts/fix-esm-paths.ts) đã đặt ra: thử `<spec>.d.ts` rồi
`<spec>/index.d.ts`, không tìm thấy thì exit 1 thay vì đoán.

**File** — [`scripts/build-icon-types.ts`](../scripts/build-icon-types.ts)

#### 3.3 · I-26 — I-13 làm vỡ gate RSC của I-01

**Phát hiện khi chạy lại `pnpm check:rsc` cho I-11** — fixture Next fail ở đúng chỗ nó từng pass:

```
Error: Event handlers cannot be passed to Client Component props.
  {ref: undefined, type: "button", disabled: …, aria-busy: …, aria-disabled: …, onClick: function onClick, …}
```

**Nguyên nhân** — I-13 thêm `handleClick` (bọc `preventDefault` khi `loading`) và gắn
`onClick={handleClick}` **vô điều kiện** vào `<button>`. Nhưng [`Button.tsx`](../src/components/button/Button.tsx)
cố ý **không có** `'use client'` (Bảng B1), mà Server Component thì không được truyền function
xuống DOM element. Nghĩa là kể từ I-13, **mọi** `<Button>` thuần trong Server Component đều làm
`next build` fail — đúng cái lỗi P0 mà I-01 vừa dẹp xong.

Vì sao lọt: acceptance test của I-13 chạy `renderToStaticMarkup`, **không phải** RSC; và
`check:rsc` không được chạy lại sau I-13 (thứ tự checklist M2 cho thấy fixture xong **trước**
I-13). Đây là hệ quả trực tiếp của nợ kỹ thuật #1 ở §6 — không có gì chặn regression tự động.

**Ngõ cụt đã thử** — hạ `type` xuống `"button"` khi loading để chặn bàn phím bằng markup thay vì
handler (giữ được server-safe **cả khi** `loading`). Harness DOM bác bỏ: form mất submit button
thì HTML **vẫn** submit khi bấm Enter trong text field, mà lần này **không dispatch click nào** để
`preventDefault` — hoá ra còn yếu hơn bản gốc. Chỉ lộ ra khi form được dựng đúng (submit button
duy nhất là `Button` đang loading); lần chạy đầu tiên có một `<button>` trần vô tình `type="submit"`
nên assertion đo nhầm.

**Solution** — Gắn handler **đúng lúc có gì để chặn**:

```tsx
onClick={loading || onClick ? handleClick : undefined}
```

`<Button>` thuần và `<Button>` không handler → không có function nào truyền xuống → RSC pass.
Còn `loading` hoặc có `onClick` thì hành vi I-13 nguyên vẹn 100%.

⚠️ **Giới hạn còn lại:** `<Button loading>` **trong Server Component** vẫn fail build. Chấp nhận
được — `loading` là trạng thái của một async action đang chạy, vốn không tồn tại ở server.

**File** — [`button/Button.tsx`](../src/components/button/Button.tsx)

**Acceptance test — 15/15 assertion** (harness esbuild + puppeteer, DOM thật, chạy trên `dist`):
`type` giữ nguyên `submit` · `aria-busy`/`aria-disabled` set · **không** native `disabled` ·
`tabIndex` = 0 · implicit form submit bị chặn · Enter/Space không submit · `onClick` của consumer
không chạy (cả keyboard lẫn `click()`) · và 5 assertion đối chứng ở trạng thái idle chứng minh
mọi thứ **chạy lại bình thường** khi hết loading. Cộng `pnpm check:rsc` xanh.

#### 3.4 · Đóng A2 — gỡ directive 8/9 file — ✅ DONE

Điều kiện (ii) của Bảng A2 đã thoả (§0.3: cả 8 package `@radix-ui/react-*` tự ship `"use client"`),
nên 8 file gỡ được directive và server-renderable trở lại.

**`pnpm check:client` xanh không đủ để kết luận** — I-26 đã chứng minh guard không thấy loại lỗi
A3 ("truyền handler cục bộ xuống client primitive"), mà fixture thì chỉ *reference* nhóm A2 chứ
không *render*. Nên trình tự là: **mở rộng fixture để render trước, rồi mới gỡ**, và build phải
xanh ở **cả hai** trạng thái — còn directive (positive control: chứng minh bản thân fixture hợp lệ)
và không directive (payoff). Đảo thứ tự thì một lần đỏ không phân biệt được nguyên nhân.

Audit A3 trước khi gỡ: grep `on[A-Z]\w*={` trên 8 file → chỉ [`modal.tsx`](../src/components/modals/modal.tsx)
có handler, và cả 3 đều là **prop forward** (`onConfirm`/`onCancel`/`onOpenChange`), không phải hàm
cục bộ ⇒ không có rủi ro A3.

| File | Barrel module | Gỡ? |
| --- | --- | --- |
| `avatar/Avatar` · `progress/Progress` · `radio/Radio` · `scroll/Scroll` · `slider/Slider` · `toggle/Toggle` · `lnb/Lnb` · `modals/modal` | — | ✅ gỡ |
| [`popup/Popup.tsx`](../src/components/popup/Popup.tsx#L91) | — | ❌ **giữ** — `onChange={(event) => onDontShowAgainChange?.(…)}` là arrow **cục bộ** truyền xuống `Checkbox` ⇒ Bảng **A3**, không phải A2. Chính plan đã ghi chú điều này ở A3 |

Kết quả đo trên fixture Next (client JS = tổng `.next/static/chunks/*.js`, reproducible từng byte):

| | Còn directive | Đã gỡ |
| --- | --- | --- |
| Client JS | 1.359.225 B | **845.026 B** (−514.199 B, **−38%**) |
| Lexical / date-fns trong client bundle | có | **không** |
| Marker của 8 component trong client chunk | có | **không** (chỉ còn ở `.next/server`) |
| Chunk lớn nhất | 732.252 B | **227.528 B** |

⚠️ **514 kB đó phần lớn không phải code của 8 component** — mà là cả thư viện thôi bị kéo theo.
Đó là **I-27** (§3.5), một defect độc lập mà việc gỡ directive chỉ *tình cờ* dập được 2 trong 6
đường dẫn tới nó. Đừng ghi công cho A2.

`src` còn **33** file có directive (trước là 41). Cả 4 gate xanh: `check:client` · `check:rsc` ·
`check:bundle` (23,6 kB/Button) · `check:docs` (483 export).

**File** — 8 file A2 · [`fixtures/next-app/app/page.tsx`](../fixtures/next-app/app/page.tsx)
(render 8 component, **không prop hàm nào** — Server Component không truyền được function xuống
Client Component) · [`fixtures/next-app/README.md`](../fixtures/next-app/README.md)

#### 3.5 · I-27 — barrel `export *` chứa client module kéo cả thư viện vào client bundle — ✅ DONE

**Vấn đề** — Consumer render một client component qua barrel từ Server Component → client bundle
nhận **toàn bộ** thư viện, kể cả module không hề được import: Lexical (`InputTextFormatting`),
date-fns locale (`calendar`), `sonner` (`toast`), `InputFileUpload`. **+~500 kB raw**.

**Nguyên nhân** — Không phải directive, không phải root barrel, không phải sibling nặng.
Là **`export *` trong barrel của module**. Test một biến, `lnb` cố ý được chọn vì barrel của nó
**chỉ có 1 module** nên loại trừ được yếu tố sibling:

| Directive đặt ở đúng 1 file | Barrel của module đó | Client JS | Lexical |
| --- | --- | --- | --- |
| `avatar/Avatar.js` | `export { Avatar } from './Avatar'` (named) | 846.819 B | không |
| `lnb/Lnb.js` | `export * from './Lnb'` | **1.347.221 B** | **có** |

Với named re-export, bundler biết chính xác binding nào là client reference nên giữ được boundary
hẹp. Với `export *` thì barrel không tự khai được export của nó mà không evaluate module con — một
client module bên trong biến **cả barrel** thành client, rồi `export * from './components/lnb'` ở
[`src/index.ts`](../src/index.ts) truyền tiếp lên **root barrel**. Root barrel dùng `export *` là
**vô hại** (đã chứng minh: `avatar` đi qua đúng root barrel đó mà không rò) — chỉ tầng barrel
module mới quyết định.

> 🛑 **Đoạn trên đúng về cơ chế nhưng sai về điều kiện kích hoạt** — xem §0.6. Bảng `lnb` /
> `avatar` ở trên **không** phải thí nghiệm một biến như nó tưởng: ở **cả hai** nhánh, 6 barrel
> kia vẫn đang `export *`. Đo lại bằng 5 phép đo có kiểm soát thì **một** barrel `export *` không
> bao giờ đủ để rò.

**Blast radius — 6 barrel** `export *` đang chứa client module. Lỗi kích hoạt khi consumer render
**chính** module client đó từ Server Component **và** còn ít nhất một barrel `export *` khác chứa
client module (§0.6) — điều kiện thứ hai luôn thoả khi chưa sửa cái nào:

| Barrel | Client module bên trong | Ai gặp |
| --- | --- | --- |
| `select` | `Select` | **rộng nhất** — `Select` là component dùng thường xuyên |
| `tab` | `Tab` | rộng |
| `calendar` | `Calendar`, `DatePicker`, `WheelPicker` | app có date picker |
| `popover` | `PopoverMenu` | consumer dùng menu của I-13 |
| `modals` | `resource-modal` | consumer dùng `ResourceModal` |
| `grid` | `Grid` | token showcase (I-18 định gỡ khỏi public API) |

Ba ngõ cụt đã loại, ghi lại kẻo thử lại: **(1)** "root barrel `export *` kéo cả thư viện" — sai,
`Rating` và `Input` (đều client, đều qua root barrel, đều được render) không rò gì.
**(2)** "sibling nặng trong cùng barrel" — sai, `lnb` barrel chỉ có 1 module vẫn rò; và ở trạng
thái `modal` không directive thì `resource-modal` (client, cùng barrel) **không** rò.
**(3)** "`resource-modal` import barrel `../input`" — sai, sửa specifier thành `../input/Input.js`
mà con số **không nhích một byte** (1.337.845 cả trước lẫn sau). Đây cũng là internal barrel import
duy nhất trong package, vẫn nên sửa nhưng **không** vì lý do này.

**Solution** — ✅ **Đã làm.** Đổi **6 barrel** sang named re-export: **76 export / 13 file module**
(48 type + 28 value). Cơ học nhưng phải chính xác — `export *` gồm cả type, thiếu một cái là
breaking, nên danh sách được liệt kê bằng `checker.getExportsOfModule` chứ không đọc bằng mắt.
`isolatedModules` bắt buộc tách `export type { … }` khỏi `export { … }`.

**Không rơi export nào** — `pnpm check:docs` xanh với `API.md` **nguyên bản từ git**: 483 export,
56 module, diff rỗng tuyệt đối. Đây đúng là lý do §3.6 dựng gate `--check`.

16 barrel `export *` còn lại giữ nguyên — hiện không chứa client module, và giờ **có gì canh**:

**Guard mới `pnpm check:barrels`** ([`scripts/check-barrel-exports.ts`](../scripts/check-barrel-exports.ts))
— fail khi barrel component `export *` từ một module có `"use client"`, kể cả **bắc cầu** qua
barrel lồng nhau. Cùng kỷ luật với `check-client-boundary`: suy từ dữ kiện (đọc directive tại chỗ),
không từ danh sách chép tay. Cố ý **không** cấm `export *` nói chung — root barrel `export *` là vô
hại (đã chứng minh), cấm hết chỉ tạo nhiễu; 16 barrel kia sẽ bị báo **đúng ngày** một `useState`
land vào trong, tức đúng lúc hình dạng của chúng buộc phải đổi.

Self-test 4 case, cả 4 đúng: `export *` từ client module → **đỏ** · bắc cầu barrel→barrel→client →
**đỏ**, và nêu đúng tên file thủ phạm chứ không đổ cho barrel trung gian · `export *` từ module
server-safe → **không báo oan** · `export * as ns` → **đỏ** (nhánh regex riêng). Wire vào
`prebuild` + job CI `barrel-exports`.

#### Acceptance test — ✅ gate mới đỏ đúng lúc, xanh đúng lúc

Fixture Next giờ **render** `Select` từ Server Component (trước chỉ *reference*), và
[`scripts/check-rsc.ts`](../scripts/check-rsc.ts) thôi chỉ hỏi exit code — nó assert 2 thứ mà §7 đã
chỉ ra là lỗ hổng:

- **Marker** — `lexical` / `date-fns` / `sonner` **không** được có mặt trong `.next/static/chunks`,
  vì không trang nào render chúng. Đây là dụng cụ sắc; byte budget chỉ nói "nặng lên".
- **Byte budget** — tổng client JS < 1.000.000 B (đo: 869.581 B sạch · 1.336.571 B lúc rò)

| | rò | đã sửa |
| --- | --- | --- |
| Client JS | 1.336.571 B | **869.581 B** (−466.990 B, **−35%**) — ⚠️ đo lại trên build sạch ngày 2026-08-03 ra **849,2 kB**, xem §0.7 |
| `lexical` / `date-fns` / `sonner` trong client chunk | có / có / có | **không / không / không** |
| Chunk lớn nhất | 709.598 B | **243.325 B** |
| `select-trigger` (phải **còn**) | có | **có** — boundary hẹp lại, không phải component bị shake mất |

Đối chứng: §3.4 đo 845.026 B khi fixture *chưa* render `Select`; 869.581 B − 845.026 B = **24,5 kB**
đúng bằng chi phí thật của `Select`.

⚠️ `check:bundle` (Vite) vẫn **+23,6 kB/Button** xuyên suốt — nó không có RSC boundary nên không bao
giờ thấy lỗi này. Hai gate đo hai thứ khác nhau, không thay được nhau.

#### 3.6 · I-06 — API reference sinh từ type checker

**Cách tiếp cận** — [`scripts/generate-api-docs.ts`](../scripts/generate-api-docs.ts) đọc
`src/index.ts` qua compiler API rồi ghi [`API.md`](../API.md). Không có gì được chép tay: tên,
type, JSDoc, default đều đọc từ source đang ship. Cùng kỷ luật với `check-client-boundary` —
suy từ dữ kiện, không từ danh sách chép tay.

4 quyết định thiết kế, mỗi cái đều do đo mà ra chứ không đoán trước được:

| # | Quyết định | Vì sao |
| --- | --- | --- |
| 1 | Đọc **`src`**, không phải `dist` | Default **chỉ tồn tại trong source** — xem §0.4. Lợi kèm: regenerate không cần build |
| 2 | Lọc props về **những cái khai báo trong package** | Checker báo **296 prop** cho `Button`: 6 của ta + 290 của lib.dom/`@types/react`. Liệt kê đủ 296 thì chôn mất 6 cái thật. Phần thừa hưởng được nêu **một lần**, dưới dạng clause `extends` |
| 3 | Group theo **dòng barrel**, không theo file khai báo | `toast` re-export từ `sonner` (I-12) → group theo declaration sẽ xếp nó vào `node_modules/` thay vì module `toast` nơi người đọc tìm |
| 4 | `XxxProps` **không** có section riêng | Nó lặp lại y nguyên bảng của component, chỉ thiếu cột default. Index trỏ tên đó về component |
| 5 | `@deprecated` render thành callout riêng *(thêm ở M4)* | `@deprecated` là **tag**, không phải thân docblock, nên `getDocumentationComment` bỏ qua — alias `PopoverRoot` của I-14 tự mô tả mình như một export bình thường, đúng cái duy nhất nó không được phép làm. Đọc bằng `getJsDocTags`. Bắt được vì I-14 là chỗ đầu tiên trong package dùng tag này |

**Chỗ khó nhất là props type có 2 hình dạng.** Một nửa là `interface XProps extends Y`, nửa còn
lại là `type XProps = Y & { … }` (10 component). Phải resolve cả hai về cùng một cặp *tên +
thứ nó dựng lên*, vì cặp đó chính là dòng thay mặt cho ~290 prop bị lược khỏi bảng. Với alias thì
phải leo `TypeLiteral → IntersectionType → TypeAliasDeclaration` mới lấy được.

**Hai nhóm được tóm tắt thay vì liệt kê**, nếu không tài liệu sẽ chìm: 6.613 icon ITUI, và bất kỳ
cụm ≥5 export trong một module mà **prop riêng duy nhất là `className`** — đó là hình dạng icon
generated, riêng `file-type` đã 36 cái.

**Chống rot bằng `--check`** — `pnpm check:docs` sinh lại rồi so với file trên đĩa, lệch thì exit 1.
Job CI [`api-docs`](../.github/workflows/ci.yml) chạy nó trên mọi PR; job này **không cần build**
vì đọc `src`. Đây là phần trả lời cho câu "vì sao lần này không rot nữa": bảng cũ rot được vì
không có gì so nó với source.

**Kết quả**

| Đo | Trước | Sau |
| --- | --- | --- |
| Export có tài liệu | 17 | **483** (245 component, 56 module) |
| Bảng props hand-written trong README | 17 (4 cái sai — §0.4) | **0** — thay bằng 17 deep link |
| Nguồn sự thật cho props | README + `.d.ts` (lệch nhau) | `src` (một nguồn, CI canh) |

⚠️ **API.md không nằm trong tarball** (`files: ["dist"]`), giống `TOKENS.md`/`DEVELOPMENT.md`, nên
link trong README phải là **absolute GitHub** — đúng quy ước I-19 đã đặt. Anchor viết tay dễ sai:
7/17 link đầu tiên trỏ sai vì anchor module là `echoitituicss…` (`itui` + `css`) chứ không phải
`echoititucss…`; bắt được bằng script so anchor với heading thật của API.md.

#### 3.7 · I-28 — `check:docs` luôn đỏ trên Windows, dù nội dung khớp từng ký tự

**Phát hiện khi chạy `pnpm check:docs` để xác nhận I-27 không rơi export.** Gate đỏ, nhưng
regenerate xong thì `git diff` **rỗng** — vòng lặp không có lối ra.

**Nguyên nhân** — Generator ghi `\n`; repo không có `.gitattributes` và `core.autocrlf=true`, nên
file trên đĩa là `\r\n`. `--check` so **byte**, nên hai chuỗi cùng nội dung vẫn khác nhau.
`pnpm docs:api` không cứu được: git normalise bản ghi đè về đúng như cũ.

**Vì sao chưa ai thấy** — job CI chạy `ubuntu-latest`, ở đó `autocrlf` tắt nên gate xanh. Lỗi này
chỉ tồn tại trên máy dev Windows, tức đúng chỗ không có ai đo. Cùng họ với I-26 và I-27: **gate nói
sai về thực tế**, chỉ khác chiều — I-26/I-27 là xanh mà hỏng, I-28 là đỏ mà lành. Chiều này rẻ hơn
nhưng bào mòn niềm tin vào gate nhanh hơn, vì nó dạy dev bỏ qua màu đỏ.

**Solution** — ✅ So nội dung, không so line ending: normalise `\r\n` → `\n` **cả hai vế** trước khi
so. Không đổi thứ ghi ra đĩa (vẫn LF), nên CI giữ nguyên hành vi.

Cân nhắc kèm theo, **chưa làm**: thêm `.gitattributes` với `* text=auto eol=lf` để chuẩn hoá ở tầng
git. Sửa tận gốc nhưng đụng **toàn repo** (mọi file renormalise ở lần checkout sau) — lớn hơn phạm
vi I-27 nhiều, tách ra để user quyết.

**File** — [`scripts/generate-api-docs.ts`](../scripts/generate-api-docs.ts)

---

#### 3.8 · I-29 — component import icon qua barrel ITUI kéo cả bộ icon vào graph của consumer — ✅ DONE

**Phát hiện khi tách `icons` khỏi root barrel.** Gỡ [`src/index.ts`](../src/index.ts) dòng
`export * from './icons/ITUI'` xong, `check:bundle` báo **9.137 module** — **đúng bằng số cũ**, không
nhích một byte. Trước khi kết luận gì, đếm lại 9.137 module đó theo nguồn (plugin `load()` gom theo
thư mục, cùng fixture, cùng entry):

| Nguồn | Module |
| --- | --- |
| `itui:icons` | **7.912** |
| `dep:date-fns` | 826 |
| `itui:components` | 141 |
| `dep:react-day-picker` | 106 |
| còn lại (react, react-dom, lexical, …) | ~150 |

**Nguyên nhân** — 7 file component import icon qua **barrel ITUI**
(`import { XRegularIcon } from '../../icons/ITUI'`). Barrel đó là **1.263 dòng `export *`**, nên
bundler phải nạp cả 7.912 module chỉ để biết `XRegularIcon` nằm ở đâu. Root barrel có liệt kê icons
hay không **không liên quan**: đường vào là từ component, không phải từ `src/index.ts`.

**Solution** — ✅ Mỗi icon import thẳng file khai báo nó:

```tsx
import XRegularIcon from '../../icons/ITUI/x/XRegularIcon';   // default export
```

50 icon ở 7 file: `dialog` 1 · `DateHeader` 2 · `DatePicker` 4 · `FileType` 37 · `Progress` 4 ·
`SidebarGroup` 1 · `Stepper` 1.

| Đo (fixture Vite, entry `barrel`) | Trước | Sau |
| --- | --- | --- |
| Module transform | 9.137 | **1.517 (−83%)** |
| `bundle.js` | 217,93 kB | **217,93 kB — byte-identical** |
| `bundle.css` | 98,1 kB | **98,1 kB** |
| Chi phí 1 Button | +23,6 kB | **+23,6 kB** |

⚠️ **Vì sao không gate nào thấy:** production output **không đổi một byte** — Rollup vẫn shake sạch.
Cái phải trả là thời gian transform ở dev server và ở mỗi lần build. Cùng họ với I-27 (gate xanh mà
hỏng), nhưng lần này ngay cả `check:bundle` — gate *đo bằng byte* — cũng không thể thấy, vì byte là
thứ duy nhất **không** đổi.

**2 guard mới, cả hai đều bắt được lỗi này:**

- **`check:barrels` rule R2** ([`scripts/check-barrel-exports.ts`](../scripts/check-barrel-exports.ts))
  — fail khi bất kỳ file nào trong `src/components` import từ `icons/ITUI` hoặc `icons`. Static, chạy
  trong `prebuild`, không cần build. Negative control: dựng file probe import cả 2 barrel → **đỏ, nêu
  đúng 2 dòng**; xoá đi → xanh (136 file quét)
- **Module budget trong `check:bundle`** — đọc số `modules transformed` của Vite và fail nếu barrel
  vượt **3.000**. Ngưỡng nằm giữa 1.517 (sạch) và 9.137 (rò) nên thêm component không bao giờ chạm,
  còn regression thì vượt gấp 3

**Phát hiện kèm theo** — `FolderColorLogo` / `FolderColorOpenLogo` có file trong
[`icons/ITUI/file-type/`](../src/icons/ITUI/file-type/) mà `index.ts` của thư mục **không** re-export,
nên `@echoit/itui.css/icons` không với tới được. Đã thêm: **6.613 → 6.615 icon**.

**File** — 7 file component · [`src/icons/ITUI/file-type/index.ts`](../src/icons/ITUI/file-type/index.ts) ·
[`scripts/check-barrel-exports.ts`](../scripts/check-barrel-exports.ts) ·
[`scripts/check-bundle.ts`](../scripts/check-bundle.ts) ·
[`scripts/pack-tarball.ts`](../scripts/pack-tarball.ts) (`runCapture`)

---

### I-07 · Ví dụ theming trong README là no-op

**Vấn đề** — [`README.md:419-424`](../README.md#L419-L424) bảo override `--primary` /
`--radius`. Đo thực tế: **không đổi gì**. `--color-brand` / `--radius-lg` mới đúng.

**Nguyên nhân** — Snippet copy từ shadcn/ui; component đọc `var(--color-brand)` và
`var(--radius-lg)`.

**Impact** — Feature headline "🎨 Token-driven theming" thất bại im lặng ngay ví dụ đầu tiên.

**Loại** Documentation · **P1** · **Breaking** Không

**Solution** — Thay bằng token thật từ TOKENS.md, link tới bảng token.

**File** — [`README.md:415-426`](../README.md#L415-L426)

---

### I-08 · `Button` nối class thay vì merge

**Vấn đề** — `className="bg-purple-600 rounded-full px-10"`: `bg-*` và `px-*` thắng,
`rounded-full` **im lặng thua** `rounded-lg`.

**Nguyên nhân** — [`Button.tsx:169-181`](../src/components/button/Button.tsx#L169-L181) dùng
`[...].filter(Boolean).join(' ')` thay vì `cn()`. `cn()` **đã có twMerge** sẵn ở
[`src/lib/utils.ts`](../src/lib/utils.ts) — chỉ là Button không gọi.

**Impact** — Fail im lặng và *theo từng utility* — tệ hơn fail nhất quán, vì dev thấy `bg-*`
chạy nên tin cả `rounded-*` cũng chạy.

**Loại** Implementation · **P1** · **Breaking** **Có (hành vi)** ở edge case — consumer đang
vô tình dựa vào class thư viện thắng

**Solution** — Đổi sang `cn(...)`. Audit đã xong: chỉ **3 module** thiếu, 46 module còn lại
đã dùng đúng.

**File** — [`button/Button.tsx`](../src/components/button/Button.tsx) ·
[`file-type/`](../src/components/file-type/) · [`toast/`](../src/components/toast/)

---

### I-09 · 41 chuỗi Hàn hardcode, gồm cả nhãn a11y

**Vấn đề** — `로딩 중` (Spinner `aria-label`), `검색어 지우기`, `올바른 휴대폰 번호를 입력해주세요`,
toolbar rich-text… ship thẳng trong bundle.

**Nguyên nhân** — Component viết cho thị trường Hàn, không có lớp i18n. **Nhưng**: phần lớn
**đã là prop có default Hàn** — chỉ một nhóm nhỏ là hardcode thật.

**Impact** — Team không dùng tiếng Hàn không production được các component đó. Screen reader
đọc tiếng Hàn cho mọi locale.

**Loại** Missing feature · **P1** · **Breaking** **Có (hiển thị)** với consumer Hàn nếu đổi
default. Cân nhắc: đổi default ở major, hoặc mặc định English ngay vì package đăng ký npm
quốc tế.

**Solution** — 3 bước, rẻ hơn report ước tính nhiều:

- **(a) Đổi default sang English** cho prop đã tồn tại — ✅ **DONE**, sửa 1 dòng mỗi chỗ.
  Thực tế **17 default / 10 file**, không phải 12 (§0.3). Ngoài danh sách dưới đây còn:
  `title` ([`Empty.tsx:70`](../src/components/empty/Empty.tsx#L70)) ·
  `title ?? '메뉴'` ([`BottomSheet.tsx`](../src/components/bottom-sheet/BottomSheet.tsx)) ·
  `placeholder` + `linkPromptLabel` ([`InputTextFormatting.tsx:456,461`](../src/components/input/InputTextFormatting.tsx#L456)) ·
  `dontShowAgainLabel` ([`Popup.tsx:83`](../src/components/popup/Popup.tsx#L83)).
  Danh sách gốc của report:
  `clearLabel` ([`InputSearch.tsx:44`](../src/components/input/InputSearch.tsx#L44)),
  `invalidMessage` / `calendarLabel` ([`InputDate.tsx:96-97`](../src/components/input/InputDate.tsx#L96-L97)),
  `invalidMessage` ([`InputPhoneNumber.tsx:57`](../src/components/input/InputPhoneNumber.tsx#L57)),
  `removeLabel` / `downloadLabel` / `previewLabel` / `description` / `hint`
  ([`InputFileUpload.tsx`](../src/components/input/InputFileUpload.tsx)),
  `placeholder` ([`InputDropdown.tsx:253`](../src/components/input/InputDropdown.tsx#L253)),
  `cancelText` / `confirmText` ([`modal.tsx:49-50`](../src/components/modals/modal.tsx#L49-L50))

- **(b) Prop hoá phần hardcode thật** — ✅ **DONE**. `InputTextFormatting` gom **18 nhãn toolbar
  vào một bag** `labels?: Partial<InputTextFormattingLabels>` chứ không thêm 18 prop — chúng luôn
  được dịch cùng nhau, và component đã nhận 13 prop hành vi rồi. `resource-modal` làm y vậy với
  `ResourceModalLabels`. Danh sách gốc:
  [`Spinner.tsx:62`](../src/components/spinner/Spinner.tsx#L62) `aria-label="로딩 중"` ·
  mảng toolbar [`InputTextFormatting.tsx:110-147`](../src/components/input/InputTextFormatting.tsx#L110-L147) ·
  `aria-label="문단 스타일"` ([`:234`](../src/components/input/InputTextFormatting.tsx#L234)) ·
  switch-case [`resource-modal.tsx:101-107`](../src/components/modals/resource-modal.tsx#L101-L107) ·
  `title` [`Empty.tsx:70`](../src/components/empty/Empty.tsx#L70) ·
  `title` [`BottomSheet.tsx:227`](../src/components/bottom-sheet/BottomSheet.tsx#L227) ·
  `setRejection('지원하지 않는 파일 형식입니다.')` [`InputFileUpload.tsx:345`](../src/components/input/InputFileUpload.tsx#L345)

- **(c) Tuỳ chọn** — `<ITUIProvider locale>` với string table, nếu định làm i18n đầy đủ

**File** — ~10 file, tập trung ở [`input/`](../src/components/input/) ·
[`modals/`](../src/components/modals/) · [`spinner/`](../src/components/spinner/)

---

### I-10 · Package 98 MB / 16.129 file

**Vấn đề** — 98 MB trên đĩa (MUI ~30 MB), trong đó 40 MB là sourcemap consumer không dùng được.

**Nguyên nhân** — **Không phải thiếu `files`** (đã có `files: ["dist"]`). Thủ phạm:
- `sourcemap: true` [`tsup.config.ts:10`](../tsup.config.ts#L10) → 2 file map 20 MB
- **7.913 file icon** trong [`src/icons/`](../src/icons/) → `dist/icons` 22 MB + 8.053 `.d.ts`

**Impact** — Install chậm, CI cache phình, `node_modules` nặng.

**Loại** Implementation · **P1** · **Breaking** Không (tách icon package thì có)

**Solution**
- ✅ **M1 — đã xong cùng I-01b.** `sourcemap: false` + bỏ CJS + bundleless →
  **98 MB → 24,6 MB unpacked / 4,6 MB packed**, đã dưới MUI (~30 MB). Đo lại sau I-10b + I-25:
  **18,6 MB unpacked / 4,1 MB packed / 8.244 file** (từ 24.163 file — chênh đúng bằng
  8.052 `.d.ts.map` + 7.868 `.d.ts` icon thừa mà 2 fix đó gỡ)
- ✅ **3,2 MB `.d.ts.map`** (8.052 file) — đã tắt `declarationMap` trong
  [`tsconfig.json`](../tsconfig.json#L21) (`tsconfig.components.json` extends nó nên không cần
  sửa 2 chỗ). `files: ["dist"]` không ship source, nên map chẳng trỏ được vào đâu
- ⬜ **M4** — icon vẫn là **~17 MB / 95%** của dist (component chỉ ~0,8 MB). Subpath export
  **đã có** (`/icons`, M3) nhưng không giảm dung lượng tarball: consumer vẫn tải cả bộ. Chỉ tách
  package riêng mới giảm được — quyết định ở M4

**File** — [`tsup.config.ts`](../tsup.config.ts) · [`scripts/build-icon-types.ts`](../scripts/build-icon-types.ts)

---

### I-11 · Phân loại dependency sai

**Vấn đề** — [`package.json:67-93`](../package.json#L67-L93):

| Package | Hiện tại | Nên là |
| --- | --- | --- |
| `@types/react` | `dependencies` | `peerDependencies` (optional) |
| `tailwindcss`, `@tailwindcss/vite` | `dependencies` | `peerDependencies` + `devDependencies` |
| `radix-ui` (umbrella) | `dependencies` | bỏ — đã có 7 package `@radix-ui/react-*` riêng |
| | | ↳ verified: umbrella chỉ là file re-export 2,5 KB import **~30** package Radix, và bản `.mjs` của nó **không có** `"use client"`. 13 component đang import qua umbrella → vừa kéo deps không dùng (I-02) vừa dựa vào namespace re-export của client module, một edge chưa được kiểm chứng trong RSC |
| `lucide-react` **và** `@phosphor-icons/react` | cả hai | chọn một |
| Tất cả Radix/Lexical | pin exact (`1.1.15`, `0.48.0`) | caret range |

**Nguyên nhân** — Chưa rà soát ranh giới runtime vs build-time.

**Impact** — `@types/react@19.2.3` cài **bản types React thứ hai** cạnh app (`19.2.17`) →
nguồn lỗi JSX khó gỡ kinh điển. Pin exact → duplicate Radix instance cho consumer dùng
Radix trực tiếp.

**Loại** API (packaging contract) · **P1** · **Breaking** **Có** — consumer phải tự cài
`tailwindcss` (vốn đã bắt buộc). Đi kèm I-03.

**Solution** — ✅ **Đã làm**, theo bảng trên với 2 chỗ lệch (§0.3). `"./package.json"` đã được
thêm vào `exports` từ I-02.

| # | Việc | Kết quả thật |
| --- | --- | --- |
| 1 | Bỏ umbrella `radix-ui` | 13 file đổi sang `import * as X from '@radix-ui/react-*'` — **cùng namespace, cùng member**, vì umbrella chỉ `export * as X from` đúng package đó. 5 file (`dialog`×3, `select`, `tab`) dùng package **đã cài sẵn**; 8 package mới thêm ở **đúng version umbrella đang pin** → code resolve ra là byte-identical. Umbrella kéo **55 dep**, giờ còn 8 |
| 2 | Bỏ cả 2 thư viện icon → ITUI | 11 call-site ở 5 file. Bám quy ước sẵn có của repo: `width`/`height` prop + `[&_path]:fill-current` (như [`Rating.tsx:97`](../src/components/rating/Rating.tsx#L97)) — **bắt buộc**, vì path của icon ITUI hardcode `fill="#101010"` nên không tự theo `currentColor`; thiếu class này thì `text-muted-foreground` ở [`Select.tsx`](../src/components/select/Select.tsx) chết im lặng |
| 3 | `@types/react` → peer (optional) + dev | Hết cài bản types React thứ hai cạnh app |
| 4 | `tailwindcss` → peer `^4` (bắt buộc) + dev; `@tailwindcss/vite` gỡ hẳn | Xem §0.3. 2 fixture đều tự khai `tailwindcss` nên gate không đỏ — và nhờ vậy chúng **kiểm luôn** hợp đồng peer mới |
| 5 | Pin exact → caret range | Toàn bộ Radix/Lexical/còn lại |

Đo được sau khi làm:

| | Trước | Sau |
| --- | --- | --- |
| npm packed / unpacked | 4,6 MB / 24,6 MB | **4,1 MB / 18,6 MB** |
| File trong tarball | 24.163 | **8.244** *(phần lớn là I-10b + I-25, không phải I-11)* |
| `pnpm-lock.yaml` submodule | — | **−804 dòng** |
| Module transform ở dev qua barrel | 15.407 | **9.137** (−41%) |

Dòng cuối là lợi ích thật của I-11 mà bảng bundle-size không thấy: Vite/Next **không** tree-shake ở
dev, nên 55 dep của umbrella + 2 thư viện icon là chi phí mỗi lần load page. `check:bundle` vẫn
**+23,6 kB** cho 1 Button (production không đổi, đúng như dự đoán — deps đó vốn đã bị shake mất).

⚠️ **Lockfile submodule phải refresh tay**: `pnpm i --lockfile-only --ignore-workspace` trong
`packages/ui`. `pnpm i` ở workspace cha **không** đụng tới nó → CI đỏ ở bước `--frozen-lockfile`.

**File** — [`package.json`](../package.json) · [`pnpm-lock.yaml`](../pnpm-lock.yaml) · 13 file đổi
import Radix · 5 file đổi icon (`select`, `table`, `dropdown-menu`, `modals/resource-modal`,
`popover` — file cuối chỉ là gỡ import chết)

#### Acceptance test — ✅ cả 3 gate xanh

| Gate | Kết quả |
| --- | --- |
| `pnpm check:client` | ✓ mọi module cần `"use client"` đều có |
| `pnpm check:rsc` | ✓ sau khi sửa I-26 (§3.3) — **gate này bắt được regression mà 41/41 assertion của I-13 không thấy** |
| `pnpm check:bundle` | ✓ 23,6 kB raw / 1 Button, trong budget 253,9 kB |

---

### I-12 · `sonner` là phantom dependency

**Vấn đề** — README bảo `import { toast } from 'sonner'`, nhưng `sonner` không có trong
`package.json` của consumer và không phải `peerDependency`.

**Nguyên nhân** — [`toast/index.tsx`](../src/components/toast/index.tsx) chỉ export `Toaster`,
không re-export `toast`. Import hiện chạy được **chỉ nhờ npm hoisting**.

**Impact** — Vỡ hoàn toàn dưới pnpm strict layout hoặc Yarn PnP. Không có cách hợp lệ nào
để bắn toast.

**Loại** API · **P1** · **Breaking** Không (chỉ thêm export)

**Solution** — Re-export `toast` từ [`toast/Toast.tsx`](../src/components/toast/Toast.tsx)
(1 dòng), cập nhật README.

**File** — [`src/components/toast/Toast.tsx`](../src/components/toast/Toast.tsx) ·
[`toast/index.tsx`](../src/components/toast/index.tsx) · [`README.md:396-411`](../README.md#L396-L411)

---

### I-13 · Thiếu ARIA ở form & table primitive — ✅ DONE

**Vấn đề**

| Component | Hiện tại | Đã làm |
| --- | --- | --- |
| `Input` có `error` | text hiện; `aria-invalid` null, `aria-describedby` null | ✅ set cả hai, `aria-describedby` trỏ tới `${inputId}-error`, **nối thêm** chứ không ghi đè giá trị consumer truyền |
| `TableHead` có `sortDirection` | chỉ chevron; `aria-sort` null | ✅ `aria-sort="ascending"\|"descending"`, thêm `"none"` cho cột sortable chưa sort |
| `<th>` | không có `scope` | ✅ `scope="col"`, đặt trước `{...props}` nên consumer vẫn override được |
| Header sort | `<th>` thuần, không focus được | ✅ bọc nội dung trong `<button type="button">` |
| `Button` có `loading` | `aria-busy` ✓, `pointer-events:none` ✓, nhưng `disabled` false | ✅ `aria-disabled` + `preventDefault` — **không** native `disabled`, xem §0.2 |
| `PopoverItem` | render trong `role="dialog"` | ✅ `PopoverMenu` mới: `role="menu"` + roving tabindex + Arrow/Home/End — xem §0.2 |

**Nguyên nhân** — Style-first, ARIA chưa vào checklist component.

**Impact** — Screen reader không nghe được error message dù nó hiển thị. Sort chỉ dùng
được bằng chuột.

**Loại** Accessibility · **P1** · **Breaking** Không

#### 3 quyết định thiết kế cần biết

**(a) `TableHead` bọc `<button>` là opt-in, không tự động.** Điều kiện là `sortable` hoặc
`sortDirection != null` — **không** phải mọi `<th>`. Lý do: cột checkbox "chọn tất cả" render
`<input type="checkbox">` làm children, tự động bọc `<button>` sẽ thành nested interactive
element — HTML không hợp lệ và screen reader đọc sai.

Không thêm prop `onSort`: click của button **bubble** lên `<th>`, nên `onClick` mà consumer đã
đặt sẵn ở đó vẫn chạy — và giờ chạy cả khi bấm Enter/Space. Verified:
[`data-table.tsx:363-372`](../../../apps/web/components/ui/data-table.tsx#L363-L372) của `apps/web`
đang dùng đúng pattern đó, chỉ cần thêm `sortable` là các cột chưa sort cũng focus được.

**(b) `Button loading` giữ focus.** Xem §0.2 — native `disabled` gỡ button khỏi tab order. Chặn
double-submit bằng `preventDefault` trong `onClick`, đủ cho cả implicit form submission (Enter
trong text field dispatch click lên submit button, `preventDefault` huỷ luôn submit).

> ⚠️ **Đã sửa lại ở I-26 (§3.3):** handler này lúc đầu được gắn **vô điều kiện**, làm vỡ gate RSC
> của I-01 vì `Button` không có `'use client'`. Giờ là `loading || onClick ? handleClick :
> undefined`. Hành vi mô tả ở đoạn trên **không đổi** — 15/15 assertion trên DOM thật.

**(c) `PopoverMenu` tách file riêng.** [`Popover.tsx`](../src/components/popover/Popover.tsx) cố ý
**không có hook** để render được từ Server Component. Keyboard handler thì bắt buộc phải client,
nên menu nằm ở [`PopoverMenu.tsx`](../src/components/popover/PopoverMenu.tsx) với `'use client'` —
chỉ consumer nào thật sự cần menu mới trả giá đó. `PopoverItem` chỉ nhận thêm prop `asMenuItem`
(attribute tĩnh: `role="menuitem"` + `tabIndex={-1}`) nên vẫn server-safe; `pnpm check:client`
xanh.

Roving tabindex đặt trực tiếp lên DOM node chứ không qua React state: `PopoverMenu` **tìm item
theo role**, nó không sở hữu cũng không clone children. `useEffect` cố ý **không có dep array** —
item có thể bị thêm/xoá/disable giữa các lần render, và menu mà item tabbable duy nhất vừa unmount
thì không được phép thành không-với-tới-được.

**Không** thay thế `DropdownMenu` / `OverflowMenu` (đều đã dựng trên Radix DropdownMenu). Dùng
`PopoverMenu` khi menu chỉ là *một phần* của popover, cạnh header/description/form.

**File** — [`input/Input.tsx`](../src/components/input/Input.tsx) ·
[`table/Table.tsx`](../src/components/table/Table.tsx) ·
[`button/Button.tsx`](../src/components/button/Button.tsx) ·
[`popover/Popover.tsx`](../src/components/popover/Popover.tsx) ·
[`popover/PopoverMenu.tsx`](../src/components/popover/PopoverMenu.tsx) **(mới)** ·
[`popover/index.ts`](../src/components/popover/index.ts) · story:
[`Popover.stories.tsx`](../../../apps/storybook/src/stories/Popover.stories.tsx) `Menu` ·
[`Table.stories.tsx`](../../../apps/storybook/src/stories/Table.stories.tsx) `SortableHeaders` ·
[`Button.stories.tsx`](../../../apps/storybook/src/stories/Button.stories.tsx) `Loading`

#### Acceptance test — **41/41 assertion**

Chạy trên `dist` **đã build**, không phải `src` — nên đồng thời kiểm luôn output bundleless của
I-01b và subpath của I-02.

| Lớp | Cách chạy | Kết quả |
| --- | --- | --- |
| Markup tĩnh | `renderToStaticMarkup` import thẳng từ `dist/components/*/index.js` | **25/25** — ARIA của Input/Table/Button/PopoverItem, cộng regression guard cho I-08 (`rounded-full` thắng), I-16 (không rò class lên `<tr>`), I-23 (2 token có trong `dist/index.css`), I-03 (`@source "./"`) |
| Tương tác | Harness esbuild + puppeteer, DOM thật | **16/16** — Enter/Space/click/implicit-submit đều bị chặn khi loading mà button **vẫn** focus được; Arrow/Home/End + wrap-around, bỏ qua item disabled, luôn đúng 1 tab stop, Tab thoát được menu, Escape **không** bị nuốt (Radix vẫn đóng được popover) |

⚠️ **Cả 2 script đều là throwaway trong scratchpad, không commit** — user đã chốt không thêm test
infra vào package (xem "Nợ kỹ thuật" ở §6). Nghĩa là I-13 **hiện không có gì chặn regression**.

---

## 4. P2 — Nhất quán API (gom vào 2.0)

### I-14 · `PopoverRoot` lệch quy ước, error message chỉ sai chỗ — ✅ DONE

`PopoverRoot` là root, còn `Popover` là component **khác** — lệch với `Dialog`/`Tabs`/`Tooltip`.
Runtime error lại nói ``must be used within `Popover` ``.

**Impact** — Dev đọc error đi import `Popover`, lỗi vẫn còn, bế tắc.
**Solution** — ✅ Rename theo đúng plan, kèm 1 quyết định không có trong plan (§4.1):

| Trước | Sau |
| --- | --- |
| `PopoverRoot` (Radix root) | **`Popover`** — error message của Radix tự đúng, không phải sửa gì |
| — | `PopoverRoot` giữ làm alias **`@deprecated`**, gỡ ở minor kế tiếp |
| `Popover` (panel `<div>` có style) | **`PopoverPanel`** + `PopoverPanelProps` |

File đổi tên theo export chính: `Popover.tsx` → [`PopoverPanel.tsx`](../src/components/popover/PopoverPanel.tsx),
`PopoverRoot.tsx` → [`Popover.tsx`](../src/components/popover/Popover.tsx) (`git mv`, giữ history).

**File** — [`popover/`](../src/components/popover/) 4 file · 3 file [`input/`](../src/components/input/)
import thẳng `'../popover/PopoverRoot'` · [`README.md`](../README.md) §Popover ·
[`API.md`](../API.md) regenerate (**483 → 484** export: `PopoverPanel` + `PopoverPanelProps` vào,
`PopoverProps` ra, alias `PopoverRoot` ở lại) ·
[`scripts/generate-api-docs.ts`](../scripts/generate-api-docs.ts) (callout `@deprecated`, xem §3.6
mục 5) · **16 file `apps/`** (13 `PopoverRoot`, 5 panel, 2 file nằm ở cả hai nhóm; +1 story) ·
**Breaking** Có

#### 4.1 · Vì sao gỡ `className` khỏi root — biến breaking im lặng thành lỗi compile

Rủi ro thật của I-14 **không** nằm ở người dùng `PopoverRoot` — họ có alias. Nó nằm ở **5 file
`apps/web`** đang dùng panel `Popover` làm surface context-menu (§0.9). Với họ, cái tên `Popover`
**đổi nghĩa**: từ một `<div>` có style thành Radix Root, mà Root **không render DOM nào**. Panel
biến mất, không lỗi, không warning.

Root cũ nhận `ComponentProps<Root> & { className?: string }` — và **thả `className` xuống đất**, vì
nó không có element nào để gắn. Cái intersection đó chính là thứ làm breaking này im lặng: `<Popover
className="w-56">` vẫn typecheck ngon lành rồi render ra hư không. Đã gỡ nó. Verified bằng negative
control (file probe tạm trong `apps/storybook`, xoá sau khi chạy):

```
error TS2322: Property 'className' does not exist on type 'IntrinsicAttributes & PopoverProps'.
```

⚠️ Không phải mọi call site cũ đều được chặn — panel không truyền `className` thì vẫn compile và vẫn
biến mất. Trong repo cả 5 file đều có `className` nên đều bị chặn, nhưng consumer npm thì không đo
được từ trong repo ⇒ **phải vào changelog `2.0`**, đây là mục thứ 8 sau 7 mục đã liệt kê ở M1.

#### Acceptance test — **10/10 assertion**, cộng 5 gate

Chạy trên `dist` đã build (`renderToStaticMarkup` + subpath import), script throwaway không commit:
`PopoverRoot === Popover` · root render **rỗng** đúng như Radix · `PopoverPanel` giữ class surface,
merge `className` của consumer, vẫn chứa `PopoverItem` được. `tsc --noEmit` xanh ở **cả**
`apps/web` lẫn `apps/storybook`.

### I-15 · TOKENS.md lỗi thời

Line 90 ghi `--primary` = `oklch(0.205 0 0)`, giá trị ship là `#009ce0`. Còn `TODO`
placeholder ở `color.surface.hover` và `color.surface.pressed`.

**Impact** — Tài liệu tốt nhất của package có điểm sai → mất tin cậy.
**Solution** — Sync 2 entry + điền TODO. Giữ nguyên cấu trúc 1.651 dòng.
**File** [`TOKENS.md`](../TOKENS.md) · **Breaking** Không

### I-16 · Class rác trên `<tr>`

[`Table.tsx:97`](../src/components/table/Table.tsx#L97) — `<tr>` mang
`overflow-x-auto w-full min-w-0 shadow-downwards-sm [&>div]:overflow-visible`, rò từ `Table`
wrapper, vô nghĩa trên table row.

**Solution** — Xoá; làm chung PR với I-05. · **Breaking** Không

### I-17 · Component trùng lặp

5 cặp không có hướng dẫn chọn: `Input`/`InputV2` · `navigation`/`navigation-v2` ·
`tab`/`tabs` · `dialog`/`modals`/`popup`/`bottom-sheet` · `toast`/`snackbar`.

**Impact** — Mọi consumer tung đồng xu chọn API.
**Solution** — Chọn winner mỗi cặp, `@deprecated` + JSDoc trỏ sang thay thế, viết migration guide.
**File** [`src/index.ts`](../src/index.ts) + 10 module · **Breaking** Có

### I-18 · Token showcase export như component thật — 🚫 SKIP

`colors`, `radius`, `shadow`, `spacing`, `typography`, `grid` export từ entry chính, đứng
cạnh component UI thật.

**Impact** — Nhiễu autocomplete, phình bundle.
**Solution** — 🚫 **Không làm. Tiền đề sai — xem §0.9.** Không cái nào là showcase: `Grid` là
layout responsive thật, `Typography` là component text 10 variant, 4 cái còn lại là primitive
`forwardRef` + `asChild` kèm map hằng số mà một hệ token-driven **phải** export. "Phình bundle" thì
chính §I-02 (barrel ≡ subpath, byte-identical) và §3.8 (1.517 module) đã bác. Còn lại đúng mỗi
"nhiễu autocomplete" — không đáng một breaking change, và `GridOverlay` (dev aid duy nhất trong
nhóm) thì đi kèm `Grid`.

**File** — không đổi file nào · **Breaking** Không còn

### I-19 · Metadata README/npm sai

- README "Requirements: React 19+" vs `peerDependencies: ^18 || ^19`
- `./TOKENS.md`, `./DEVELOPMENT.md` là link tương đối, vỡ trên trang npm
- npm `description` bắt đầu bằng literal `> ` (rò markdown blockquote); trong repo
  [`package.json:4`](../package.json#L4) field này đang **rỗng**

**Solution** — Sửa metadata; link tuyệt đối GitHub; điền `description`. · **Breaking** Không

---

## 5. P3 — Đánh bóng

| # | Vấn đề | Solution | Breaking |
| --- | --- | --- | --- |
| **I-20** | `Checkbox` dùng `onChange(e.target.checked)`, `Select` dùng `onValueChange(value)` — 2 paradigm trong 1 form | Chọn 1 quy ước, hoặc **document rõ** để đọc như quyết định chứ không phải tai nạn | Có |
| **I-21** ✅ | `SelectTrigger.placeholder` được khai, được destructure, rồi **không dùng vào đâu** — prop chết chứ không phải "truyền 2 lần" (§0.9) | ✅ Không children → trigger tự render `<SelectValue placeholder={…} />`. Có children thì children thắng, prop thành không dùng. Kiểu nới `string` → `ReactNode` cho khớp Radix. **5/5 assertion** | Không |
| **I-22** | [`package.json`](../package.json#L4) local là `1.0.10`, npm đang ở `1.0.14` — repo không khớp bản published | Xác minh publish flow có commit version bump không; nếu không, thêm bước vào [`DEVELOPMENT.md`](../DEVELOPMENT.md) | Không |

---

## 6. Roadmap

### M1 — `1.0.15` (patch · ~2 ngày) — sửa **3/6 blocker**

Toàn bộ là fix nhỏ, không đổi API. Effort mỗi item: **S**.

- [x] **I-03** Viết lại README §1–2 — **giữ** `@source` (xem §0), nêu cả 2 đường load CSS, đánh
      dấu Tailwind v4 là bắt buộc, cảnh báo subpath không kéo CSS, gỡ hẳn mục Tailwind v3 (syntax
      v4-only nên v3 không dùng được)
- [x] **I-07** Sửa ví dụ theming sang `--color-brand` / `--radius-lg` + giải thích 2 lớp
      (`@theme` vs `@theme inline`) và vì sao `--primary` trông như no-op
- [x] **I-04** Bỏ `preventDefault` trong Dialog — 4 dòng → 1. **QA browser: Tab 6 lần, focus
      không rời dialog** (Close → Cancel → Confirm → vòng lại)
- [x] **I-05** + **I-16** `TableRow disabled` (`aria-disabled`, `data-disabled`,
      `pointer-events-none`, `text-neutral-disabled`, chặn `onClick`/`onKeyDown`) + xoá 5 class rác
      — **19/19 assertion**
- [x] **I-08** `cn()` cho `button` + `toast` — **2 module, không phải 3** (xem §0.1). **12/12
      assertion**: `rounded-full` của consumer thắng `rounded-lg`, `hover:bg-brand-hover` giữ nguyên
- [x] **I-12** Re-export `toast` từ `toast/Toast.tsx` + `toast/index.tsx` — **4/4 assertion**
- [x] **I-10a** Tắt sourcemap *(đã xong cùng I-01b ở M2)*
- [x] **I-15** Sync TOKENS.md — **8 dòng**, không phải 2; + cảnh báo I-23
- [x] **I-19** `description` npm, React `^18 || ^19` (khớp peerDeps), ghi rõ ESM-only, link
      TOKENS/DEVELOPMENT thành absolute GitHub
- [x] **I-22** Root cause: script `publish:latest`/`publish:beta` = `pnpm build && npm publish`,
      **bỏ bước `pnpm version`** mà DEVELOPMENT.md yêu cầu → 1.0.11–1.0.14 publish không có commit
      bump. Đã ghi cảnh báo vào DEVELOPMENT.md
- [x] **I-06 (một phần)** Gỡ link `itui.echoit.co.kr` (verified HTTP 000, DNS fail), thay bằng
      nguồn thật + cảnh báo `Badge` vs `Tag`/`Chip`
- [x] **I-23** Thêm 2 token `--color-surface-hover/pressed` — 2 component đổi hiển thị
      (`Button` ghost, `Avatar`), không phải 4
- [x] Bump version `1.0.10` → **`1.0.15`** (`pnpm build` đầy đủ: đã chạy, xem I-24/I-25).
      Bump **trong repo thôi, chưa publish npm** — user chốt không chạy `publish:latest`.
      ⚠️ `1.0.15` là **patch** so với `1.0.14` đang ở npm, trong khi đợt này có breaking thật
      (ESM-only, `tailwindcss` thành peer bắt buộc, default Hàn → Anh, Dialog trap focus,
      `TableRow disabled` có tác dụng, `Button` merge className, từ M3 là **icon rời khỏi
      barrel** → `import { XIcon } from '@echoit/itui.css'` không còn compile, và từ M4 là
      **`Popover` đổi nghĩa** → panel cũ giờ là `PopoverPanel`, §4.1). Trước khi thật sự publish
      phải chọn lại số hoặc ship changelog nêu đủ 8 mục trên
- [x] Sửa version bằng cách **edit `package.json`**, không dùng `pnpm version` — script đó
      commit **và tag**, mà tag khi chưa publish thì trỏ vào một bản không tồn tại trên npm

**Điểm dự kiến ~6.0** · M1 **đóng**.

### M2 — `1.1.0` (minor · ~1–2 tuần) — phần khó

- [ ] **I-01 + I-02** — **M–L, tách PR riêng**, theo đúng thứ tự:
  - [x] **I-01c** Chốt: **bỏ CJS, ESM-only** (`main` + điều kiện `require` đã gỡ)
  - [x] **I-01a-1** `scripts/check-client-boundary.ts` — đã viết + self-test
  - [x] **I-01a-2** Directive cho 17 file Bảng A + wire `prebuild` → `check:client`
  - [x] **I-01a-3** Job CI `client-boundary` trong `.github/workflows/ci.yml` của submodule
  - [x] Bật `isolatedModules` — 0 lỗi
  - [x] **I-01b** `bundle: false` + entry CSS riêng + `build:paths` rewrite extension
  - [x] **I-10a** Tắt sourcemap (đi kèm I-01b) — 98 MB → **24,6 MB** unpacked / 4,6 MB packed
  - [x] Fixture Next App Router + job CI `rsc-fixture` — **gate của I-01 đã qua**, 5 file B2
        xác nhận server-safe, negative control tái tạo đúng lỗi gốc
  - [x] **I-02** Subpath exports pattern `"./*"` + `"./icons"` + `"./package.json"`
  - [x] Fixture Vite + job CI `bundle-size` — **1 Button = 23,5 kB raw / 7,8 kB gzip**
        (trước +229 kB gzip)
  - [x] Tách `icons` khỏi barrel → **đã làm ở M3** (không phải M4). Breaking với **20** file
        trong `apps/` (§0.8, không phải 16). ⚠️ Dự đoán "sẽ giảm dev mode" **sai**: gỡ dòng
        barrel xong vẫn đúng 9.137 module — xem I-29 (§3.8)
- [x] **I-13** Hoàn thiện ARIA form/table — **41/41 assertion**. 3 chỗ lệch plan, xem §0.2:
      `Button` dùng `aria-disabled` chứ không native `disabled`; `PopoverMenu` là component mới
      chứ không phải gắn role trần lên `PopoverItem`; `<th>` bọc `<button>` là opt-in
- [x] **I-23** 2 token `--color-surface-hover/pressed` *(kéo từ M1 sang vì là thay đổi hiển thị)*
- [x] **I-24** `dist` build đủ 3 stage · **I-25** sửa `build-icon-types` đang chặn `build:dts`
- [x] **I-10b** `declarationMap: false` — 3,2 MB / 8.052 file `.d.ts.map` không còn
- [x] **I-11** Phân loại lại dependency — bỏ umbrella `radix-ui` (55 dep → 8), bỏ **cả 2** thư
      viện icon sang ITUI, `@types/react` + `tailwindcss` thành peer, caret range. 3 chỗ lệch
      plan, xem §0.3. Dev mode qua barrel: **15.407 → 9.137** module
- [x] **I-09a** Đổi default chuỗi Hàn → English — **17 default / 10 file**, không phải 12
- [x] **I-26** Sửa regression I-13 làm vỡ gate RSC — **15/15 assertion**, xem §3.3
- [x] **Đóng A2** Fixture render 8 component A2 → gỡ `'use client'` 8/9 file (`Popup` giữ, là A3).
      Client JS fixture **1.359.225 → 845.026 B (−38%)**, `src` còn 33 directive. Xem §3.4 —
      và đọc kèm §3.5, vì phần lớn mức giảm đó là I-27 chứ không phải A2

**Điểm dự kiến ~7.5** · Gate: 2 acceptance test của I-01 và I-02 phải pass — ✅ **cả 2 xanh**
(cùng `check:client`). ⚠️ Bài học từ I-26: **3 gate phải chạy lại sau *mọi* thay đổi component**,
không chỉ sau thay đổi build config. I-13 sửa `Button` và làm đỏ gate của I-01 mà không ai biết.

#### Nợ kỹ thuật mở khi làm I-13

| # | Nợ | Vì sao còn |
| --- | --- | --- |
| 1 | **Package không có test harness component nào.** `vitest.config` chỉ include `src/**/__tests__/**/*.test.ts` (không có `.tsx`), không có `jsdom`/`@testing-library`, và `"test:generate"` trong `package.json` trỏ tới `scripts/test-generate.ts` **không tồn tại** | User chốt QA tay thay vì thêm dep. Hệ quả: mọi con số assertion trong plan này — M1 lẫn I-13 — đều từ script throwaway, **không có gì chặn regression**. ⚠️ **Nợ này đã thành nợ xấu**: I-26 (§3.3) là một P0 do chính I-13 gây ra, sống sót qua 41/41 assertion và chỉ lộ ra khi tình cờ chạy lại `check:rsc` 1 milestone sau |
| 2 | `focus-visible:outline` + `focus-visible:outline-2` trong [`Button.tsx:173`](../src/components/button/Button.tsx#L173) là thừa | Tailwind v4 cho `outline` = `outline-width: 1px`, nên nó và `outline-2` đặt **cùng** một property. Vô hại (cái sau thắng) nhưng IDE cảnh báo `cssConflict`. Code mới ở `TableHead` đã bỏ token thừa |

### M3 — `1.2.0` (~2–3 tuần)

- [x] **I-06a** `scripts/generate-api-docs.ts` → `API.md`: **483 export / 56 module**, README gỡ
      hết 17 bảng props hand-written (4 cái đang sai), job CI `api-docs` canh drift. Xem §3.4 và
      §0.4 — con số thật là 483 export, không phải "49 module", và default phải đọc từ `src`
- [x] **I-09b** Prop hoá 4 nhóm hardcode còn lại: `Spinner label` · `InputTextFormattingLabels`
      (18 nhãn trong **một** bag, không phải 18 prop) · `ResourceModalLabels` ·
      `invalidTypeMessage`/`maxSizeMessage`. Grep Hangul trên `src` giờ chỉ còn hit trong comment
- [x] **I-27** Đổi 6 barrel `export *` sang named re-export — 76 export / 13 file, `check:docs`
      xác nhận 483 export không rơi cái nào. Fixture Next giờ **render** `Select`; `check:rsc` thêm
      marker + byte assertion. Client JS **1.336.571 → 869.581 B (−35%)**. Guard mới
      `check:barrels` + job CI `barrel-exports`. ⚠️ Mô hình nhân quả ở §3.5 **sai** — đọc §0.6:
      cần một **cặp** barrel, không phải một
- [x] **I-28** `check:docs` báo oan trên Windows (CRLF vs LF) — xem §3.7
- [x] **I-02 mục 3** Tách `icons` khỏi root barrel → subpath `@echoit/itui.css/icons`, entry mới
      [`src/icons/index.ts`](../src/icons/index.ts). 20 file `apps/` đổi import; `tsc --noEmit`
      xanh ở cả `apps/web` lẫn `apps/storybook`, storybook build xanh. Xem §0.8
- [x] **I-29** 7 component thôi import icon qua barrel ITUI — **9.137 → 1.517 module (−83%)**,
      `bundle.js` byte-identical. 2 guard mới: `check:barrels` rule R2 + module budget 3.000
      trong `check:bundle`. Xem §3.8
- [ ] **I-06b** Deploy docs site (cân nhắc dùng `apps/storybook`) — M–L
- [ ] **I-09c** `ITUIProvider locale` — tuỳ chọn, chỉ làm nếu định làm i18n đầy đủ
- [ ] **I-10b** Tách icon package (nếu chọn) — M. Subpath `/icons` đã có, nên việc còn lại thuần
      về *dung lượng tarball*, không còn về bundle hay dev graph

**Điểm dự kiến ~8.2**

### M4 — `2.0.0` (breaking)

- [x] **I-14** Rename Popover — root thành `Popover`, panel thành `PopoverPanel`, `PopoverRoot`
      còn lại làm alias `@deprecated`. 16 file `apps/` đã migrate. Gỡ `className` khỏi root để
      breaking của panel **fail compile** thay vì biến mất im lặng — xem §4.1
- [ ] **I-17** Dọn component trùng lặp — cần chốt winner từng cặp trước khi code
- [x] ~~**I-18** Gỡ token showcase khỏi public API~~ → **SKIP**, tiền đề sai (§0.9)
- [ ] **I-11** Hoàn tất chuyển peer deps
- [ ] **I-20** Thống nhất event model
- [x] **I-21** Select placeholder — prop chết được nối vào `SelectValue`, **5/5 assertion**

**Điểm dự kiến ~8.8**

Chạy lại đầy đủ khi chốt đợt này (build 3 stage + 5 gate, `dist` mới): `check:client` ✓ ·
`check:barrels` ✓ (56 barrel, 16 `export *`) · `check:docs` ✓ (**484** export / 56 module) ·
`check:rsc` ✓ (849,2 kB / 7 chunk, không module nào rò) · `check:bundle` ✓ (23,6 kB/Button,
1.517 module qua barrel). Cộng `tsc --noEmit` xanh ở `apps/web` và `apps/storybook`.

---

## 7. Rủi ro

**Lớn nhất vẫn là M2 / I-01 + I-02 (build pipeline)** — nhưng bản chất rủi ro đã đổi.

~~Rủi ro chunking do `splitting: false → true`~~ **không còn**: `bundle: false` không sinh
chunk nên không có circular-import hay CSS-ordering issue từ chunking. Thay vào đó là 4 rủi ro
mới, tất cả đều **fail nhanh và ồn ào** lúc build (tốt hơn rủi ro cũ, vốn fail âm thầm ở
runtime của consumer):

| Rủi ro | Biểu hiện | Kết quả |
| --- | --- | --- |
| Type-only import bị giữ lại | Runtime `does not provide an export named 'X'` | ✅ Bật `isolatedModules` → **0 lỗi**, không có gì phải sửa |
| Relative import không extension | Node ESM `ERR_MODULE_NOT_FOUND` (bundler thì không thấy) | ✅ `build:paths` rewrite 16.337 specifier; test bằng `node --input-type=module` (không chỉ qua Vite) → resolve được |
| CJS `require` trỏ vào file ESM | `ERR_REQUIRE_ESM` | ✅ Không còn đường này — đã chốt ESM-only |
| `dist/index.css` sinh ra sai | UI trắng trơn (giống I-03) | ✅ Diff byte-by-byte: chỉ mất dòng `sourceMappingURL` |
| RSC thật chưa được xác nhận | `next build` fail ở một file B2 | ✅ Fixture Next pass, kể cả 5 file B2, **không cần** `transpilePackages` |
| **Còn lại** — hook render-time thiếu directive | Vỡ lúc render, fixture không thấy | ⬜ Chỉ `check:client` bắt được → **không được bỏ job static** khi đã có fixture |
| **Đã thành sự thật** — sửa component làm vỡ gate build | `next build` fail ở consumer, repo vẫn xanh | ⚠️ I-26 (§3.3): I-13 sửa `Button` → gate RSC đỏ suốt 1 milestone. Guard `check:client` **không** bắt được (nó soi directive, không soi prop truyền xuống DOM). CI có job `rsc-fixture` nên PR sẽ chặn — nhưng chỉ khi PR đó land ở **repo submodule**, xem cảnh báo ở I-01(a) |
| ~~**Đã thành sự thật** — client bundle phình mà **mọi gate vẫn xanh**~~ | Consumer RSC nhận cả thư viện, `check:bundle` vẫn báo 23,6 kB | ✅ **Đã đóng** (I-27, §3.5). `check:rsc` giờ assert **marker + byte budget** chứ không chỉ exit code, và `check:barrels` bắt được hình dạng barrel **trước cả khi** phải build. Đã xác minh gate đỏ đúng lúc rò (1305,2 kB) và xanh khi sạch (849,2 kB) |
| **Còn lại** — kết luận rút từ phép đo mà **nền chưa cố định**, hoặc từ phép đo **không đầy đủ** | Tài liệu ghi một nhân quả sai, lần sau có người sửa nhầm chỗ | ⚠️ Đã xảy ra **8 lần** (§0–§0.4, §0.6, §0.8, §0.9). Chỉ có một cách chặn: mỗi lần đo, nêu rõ *cái gì được giữ nguyên*, và nếu kết luận là "X gây ra Y" thì phải có nhánh **không có X** trong cùng điều kiện. §0.6 tốn 5 lần build để phát hiện §3.5 sai; §0.8 rẻ hơn vì đo **trước** khi ghi công. §0.9 thêm một biến thể: grep bị **cắt ở `head_limit`** mà vẫn được đọc như kết quả đầy đủ — "0 file dùng" hoá ra là 5 |
| ~~**Đã thành sự thật** — chi phí mà **mọi gate đo bằng byte** đều mù~~ | Consumer transform 7.912 module thừa, `bundle.js` byte-identical | ✅ **Đã đóng** (I-29, §3.8). Bài học: byte không phải thước đo duy nhất — dev server trả bằng *thời gian transform*. `check:bundle` giờ assert cả **module count**, `check:barrels` bắt hình dạng import trước cả khi build |

Giảm thiểu chung:
- Làm trên branch riêng, tách khỏi các fix M1
- Verify bằng **cả 2 fixture app** (Vite + Next.js App Router) trước khi merge
- Nhớ: CSS của packages/ui đi qua `dist/index.css` — mọi thay đổi build đều phải rebuild
  trước khi QA trong Storybook
- Số file trong `dist` sẽ **tăng** (mirror 142 module + 6.648 icon component). Đừng nhầm với I-10:
  I-10 đo *dung lượng*, và bundleless làm dung lượng **giảm** vì deps không còn inline

---

## 8. Không được đụng vào

Ghi rõ để đợt cleanup không phá thứ đang tốt.

- **TypeScript surface** (8/10 — mảng mạnh nhất). Union type export có tên, JSDoc trên prop
  không hiển nhiên, diagnostic đủ tốt để gợi ý `Did you mean 'label'?`. Giữ type co-located
  với component qua mọi refactor.
- **`cn()` + kiến trúc token.** `@theme inline` là lựa chọn đúng cho Tailwind v4; scoped
  override và dark mode đều chạy đúng.
- **`fieldClassName` / `boxClassName` của `Input`** — escape hatch đặt tên tốt, JSDoc tốt,
  đúng kiểu van xả ngăn `!important` phía consumer.
- **Compound shape** của `Card` / `Sidebar` / `Table` / `Dialog` — compose tự nhiên, đọc tốt
  trong application code.
- **`TOKENS.md`** (1.651 dòng) — chỉ sửa 2 entry sai (I-15), giữ nguyên cấu trúc.
