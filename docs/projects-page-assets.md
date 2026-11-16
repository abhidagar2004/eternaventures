# Services banner and projects page assets

- `public/images/services-arch-banner.png`: exact user-supplied 2172 × 724 charcoal arch banner, copied from `Charcoal Arch with Chartreuse Beam.png`. Used directly behind live services hero text.
- `public/images/projects-reference.png`: user-supplied 767 × 2051 projects page reference. The projects hero uses only the sculpture region through `ReferenceArtwork`; all page text, cards, filters, and actions are live HTML.
- `public/images/project-valia.jpg`, `project-amrita.jpg`, `project-digital-growth.jpg`, `project-disco.jpg`, `project-espresso.jpg`: fallback copies of the existing public project media. The live page honors current admin-managed image URLs and only uses these copies if a known image fails to load.

The projects page continues reading projects, statistics, editable section copy, reviews, and brochure form labels from the existing Supabase tables. Project details open in a native dialog. Brochure requests use the existing `leads` submission flow and provide the configured brochure link after a successful request.

The legacy “Our Work” hero heading and introduction use the new supplied reference copy; other custom hero copy remains editable. Footer layout is shared across all public routes through `Footer.css`. Services and projects banners use the same 500px desktop height as the courses banner, with matching neon rectangular buttons provided by `HeroButton`.
