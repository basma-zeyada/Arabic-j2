# Project memory

## Product intent & audience

- Arabic literacy app (vite-react) with listening and reading lessons (listening stories + reading passages).
- Includes word-tap interactions, answer choices, and read-aloud features for lesson content.
- Learning progress persisted on device (local) — migration to database pending (setup requires it next).

## Brand personality & voice

- Storyteller-centric: read-aloud voices should match the speaking character (e.g., little girl → girl voice, teacher → man's voice).
- Arabic-first UX; attention to proper Arabic phonetics and pronunciation quality.
- Kid-friendly: end-of-unit mini-games are picture-only (no text) so pre-literate children can enjoy them.

## Visual design & UX direction

- JSX + Tailwind CSS, Lucide React icons, React hooks (see `.bolt/prompt` for constraints).
- Use `@/` path alias for imports.
- Map screen includes a unit selector; units unlock sequentially after the previous unit's end game is completed.

## Decisions, constraints & rationale

- **All units reachable:** fixed hardcoded `units[0]` across home screen, map, and parent dashboard; all three units now accessible.
- **End-of-unit mini-games:** each unit ends with a picture-only game — rearrange story images in sequence + match the pairs.
- **Read-aloud scope:** only lesson content is spoken aloud; chosen answers never read aloud.
- **Character voices:** listening stories use distinct TTS voices per speaker/character.
- **Tashkeel:** full vowel marks added to listening stories and reading passages; word-tap preserves tashkeel.
- **Progress keying:** keyed by section id (includes unit prefix), so all units share one results store.

## Open questions & assumptions

- Book text extraction too garbled to rebuild spelling, speaking, writing, and assessment lessons accurately — these were not added.
- Existing lesson text not verified line-by-line against source book.
- Progress still stored locally only; database migration pending.
- TTS voice selection/character mapping may need tuning for more speaker variety.