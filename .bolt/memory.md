# Project memory

## Product intent & audience

- Arabic literacy app (vite-react) with listening and reading lessons (listening stories + reading passages).
- Includes word-tap interactions, answer choices, and read-aloud features for lesson content.
- Learning progress persisted on device (local) — not yet in a database.

## Brand personality & voice

- Storyteller-centric: read-aloud voices should match the speaking character (e.g., little girl lines → girl voice, teacher lines → man's voice).
- Arabic-first UX; attention to proper Arabic phonetics and pronunciation quality.

## Visual design & UX direction

- JSX + Tailwind CSS, Lucide React icons, React hooks (see `.bolt/prompt` for constraints).
- Use `@/` path alias for imports.

## Decisions, constraints & rationale

- **Read-aloud scope:** only lesson content (listening stories, reading passages) is spoken aloud; chosen answers are never read aloud.
- **Character voices:** listening stories use distinct TTS voices per speaker/character to match the narrator/role.
- **Tashkeel:** full vowel marks (تشكيل الحروف) added to all 3 listening stories and 6 reading passages for clearer pronunciation.
- **Word-tap fix:** word-tap now preserves tashkeel (no longer strips vowel marks) so spoken words are pronounced correctly.

## Open questions & assumptions

- Story and passage wording not yet verified line-by-line against the source book.
- Learning progress stored locally only; migration to database pending.
- TTS voice selection/character mapping may need tuning for more speaker variety.