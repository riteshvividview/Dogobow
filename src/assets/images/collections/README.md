# Collection product images

Drop new/updated product photos in the matching subfolder here:

- couture-clothing/
- walking-essentials/
- bandanas-bows/
- beds-lounge/

## How it gets picked up
`src/components/Media.tsx` scans every image under `src/assets/images/**`
(subfolders don't matter) and indexes each file by its name, minus the
extension — that name is the "slot". `src/data/collections.ts` lists each
product with an optional `slot` (main photo) and `hoverSlot` (swap-on-hover
photo). A product with no `slot` shows a paw-icon placeholder instead of a
broken image.

## To add or replace a product photo
1. Drop the file in the right subfolder above. Any image format works;
   PNG/JPG get auto-converted to WebP at build time.
2. Tell me the file name and which product (by name, e.g. "Pom-Pom Winter
   Hoodie") it belongs to — or that it's a brand-new product — and I'll
   wire it into `collections.ts`.

You don't need to worry about exact slot-name matching yourself — just
land the files here and point me at them.
