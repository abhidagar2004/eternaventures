# Home page reference redesign

The home page follows the supplied compact studio hero, lime statement marquee, philosophy, six practice cards, client logos, four-step method, audience cards, moving portfolio, moving testimonials, blog cards, and neon contact CTA. The shared footer is unchanged.

The existing `homepage_content.hero_video_url` field accepts either a video URL or an image URL; the Admin label and upload accept both. Video uses muted inline playback, a pause/play button, and the local studio poster when missing, blocked or failing. Reduced-motion preference starts with the static poster; users can explicitly play. Images with standard extensions render directly. Existing CMS visibility and custom section order remain supported; the previous seeded order migrates to the latest reference order. Seeded text resolves to concise reference copy; later custom edits remain visible.

Marquee, projects, logos and testimonials use seamless duplicate tracks. Every row has a pause/resume control and pauses on hover/focus; reduced-motion preference disables autoplay and duplicate content. Manual horizontal scrolling remains available. Duplicate content is inert and hidden from assistive technology.

Existing article routes, service routes, projects, testimonials, client logos and background video remain connected to Supabase. No database schema changes are required.

## Generated assets

Generated with built-in ImageGen. Matching recreations, not original photographs. JPEG quality 90, with generated dimensions preserved.

### home-studio-hero

Saved: `public/images/home-studio-hero.jpg`

Final prompt: Photorealistic premium creative agency film studio interior. Extremely wide horizontal 3:1 composition, dark black left half empty and moody for white website typography. Right half a giant wall projection of a grid of monochrome fashion contact sheets, silhouette of creative director standing watching at far right, desks and editing monitors below, polished concrete, subtle warm lamp and a diagonal acid lime ceiling strip light. Cinematic authentic editorial photography, detailed, high resolution. Artwork only, no website text, no logo, no UI.

### home-narrative

Saved: `public/images/home-narrative.jpg`

Final prompt: Premium editorial photograph of overlapping analog cinema film strips with portraits of people, deep red and orange lighting with one cool blue frame, tactile dark film edges, horizontal landscape 16:9 composition, high resolution. No logos no text no UI.

### home-influence

Saved: `public/images/home-influence.jpg`

Final prompt: Premium editorial fashion portrait of a confident young South Asian female creator with dark wavy hair, warm golden sunlight, subtle cream background, natural skin texture, soft shadows, shoulder up, horizontal 16:9 crop, high resolution, no text no logo.

### home-intelligence

Saved: `public/images/home-intelligence.jpg`

Final prompt: Premium architectural editorial photograph of curved translucent glass modern office facade, pale sage green and silver glass panels reflecting soft sky, elegant repeating lines, sunlit, horizontal 16:9, high resolution no text no logo.


Hero artwork: 2172 x 724. Narrative, influence and intelligence photographs: 1672 x 941 each. Existing high-resolution project images are reused for the two legacy low-resolution home thumbnails.

Validation: TypeScript and production build pass; media type, CMS copy preservation, section order, visibility and local image URL checks pass. Browser visual QA was interrupted by active user input and blocked by automatic approval review; final desktop/mobile appearance remains unverified in-browser.
