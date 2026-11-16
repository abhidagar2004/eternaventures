# About and Insights reference layouts

The latest supplied reference replaces the earlier About accordion with three separate editorial sections: a studio photograph with Who We Are card, a black Perception / Attention / Trust statement, and four illustrated approach disciplines. The white collage hero, results strip, cream clarity section and split neon mission CTA follow the same reference.

Both About and Blogs use a 500px desktop hero including the 80px navigation offset, matching Services and Projects. On small screens the heroes are 690px with stacked content. The existing shared footer is unchanged.

Blogs uses the newspaper sculpture banner, Latest Insights heading, category filters, search, newest/oldest sorting, three-column article list and black growth CTA. Articles still load from Supabase and link to the existing blog detail routes. Custom CMS copy and later custom article thumbnails remain supported. Known seeded placeholder copy and original thumbnails resolve to the new reference presentation; a fallback catalog is available if loading fails.

New matching image recreations and their full prompts are documented in `editorial-assets.md`. JPEG files preserve their generated resolution and use quality 90. The previous user-supplied projects banner remains unchanged.

Validation: TypeScript and production build passed. Image assets were visually inspected. Browser preview was attempted but the Windows computer-use tool could not confidently determine the current URL, so final in-browser visual validation remains unverified.
