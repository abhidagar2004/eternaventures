# Courses page image assets

Generated with the built-in ImageGen tool using the user-provided screenshot as a visual reference. These are recreated images, not original source photographs extracted from the screenshot.

## Files and final prompts

- `public/images/academy-hero-v2.png`

Wide cinematic website hero background, aspect ratio 2.7:1. Match reference: dark black studio desk with metallic desktop monitor on RIGHT half, black pendant lamp overhead near center, small black books and steel pencil cup on desk. Monitor tilted slightly, full monitor including silver stand visible, screen black with bold condensed white italic text GROWTH PLAYBOOK, small ETERNA ACADEMY, tiny brand strategy / paid growth / design & UX list, fine gray wireframe curves. Left 45% empty pure black for HTML headline overlay. Sophisticated realistic product photography, monochrome black silver white, subtle warm lamp. No website layout, no headline outside screen, no buttons, no badges. Entire desk and monitor visible.

- `public/images/academy-brand-v2.png`

Create only a 16:9 website course thumbnail photograph matching the attached webpage reference first course photo. Warm overhead closeup of cream hardcover notebook on wooden desk, black bold text on notebook BRAND STRATEGY PLAYBOOK on three lines. Open cream branding sketchbook beside it to right with thin pencil geometry logo and grayscale swatches. Realistic premium editorial desk photography, warm brown wood and cream, soft shadows. No UI, no category badges, no play icons.

- `public/images/academy-growth-v2.png`

Create only a 16:9 course thumbnail photograph matching attached webpage reference second course photo. Closeup angled computer screen with dark navy analytics dashboard, vivid electric blue smooth area charts and blue vertical bars along bottom. Cinematic dark blue office photograph, crisp polished glass reflections, graph fills most frame, no people. No UI outside the photographed monitor, no badges, no play icons, no added headline.

- `public/images/academy-design-v2.png`

Create only a 16:9 course thumbnail photograph matching attached webpage reference third course photo. Open silver laptop on light gray beige desk, viewed at 3/4 front angle, laptop screen displays light gray website UX wireframes, 3 cards with large X placeholder boxes, dark screen bezel. Smartphone upright to right shows mobile wireframe. A few cream books on left, warm neutral gray background, realistic premium editorial photography, soft daylight. No UI outside the photograph, no badges, no play icons.

## Course player workbook background

- File: `public/images/academy-workbook.png`
- Method: built-in ImageGen; inspected before use.
- Final prompt: Generate a wide 16:10 photographic background only for the BRAND STRATEGY course player in the attached reference images. Premium matte black embossed hardcover workbook on a dark stone desk, stack of workbooks on RIGHT HALF, foreground black metallic pen cup lower center. Workbook typography in small white text ETERNA ACADEMY above large gray-white three-line text BRAND SCALING STRATEGY WORKBOOK, small neon lime underline. One very broad bright neon lime diagonal ribbon extending across top right behind workbook. Left 45 percent very dark black mostly empty space for HTML lesson title overlay. Black silver monochrome with neon lime accent. Editorial product photography, realistic paper texture, soft dramatic lighting. No webpage chrome, no controls, no buttons, no text outside the workbook.

## Services artwork

`public/images/services-reference.png` is the user-supplied 1086 × 1448 services reference. `ReferenceArtwork.tsx` clips the artwork regions using CSS so the original hero and six practice images are retained. All headings, cards, filters, links, and section layouts are live HTML.

## Shared footer

The public app renders `Footer.tsx` once in `App.tsx`. Its layout is owned by `Footer.css`, with no page-specific footer overrides. Configured branding copy, social URLs, navigation links, and contact destination continue to load from the existing footer settings.
