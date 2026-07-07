# Reddit Playbook

last_verified: 2026-07-06
notes: refreshed 2026-07-06 via T1 web sweep; per-sub rules pages could not be fetched directly (reddit.com blocks fetch), so the verify-before-EVERY-post rule below is the live mitigation, not optional
length_window: null

**Role in the system:** Community depth + newly-enabled audience discovery. Per-subreddit culture matters more than any global rule. Audiences 1 and 3. NEW strategic layer (as of 2026-05): Reddit is now the #1 most-cited domain across ChatGPT, Perplexity, Gemini, and Google AI Overviews (which added "Community Perspectives" quoting Reddit threads directly, 2026-05-07) — a strong Reddit post has real odds of surfacing inside AI-search answers months later, making good posts durable assets, not just day-one karma plays (press-reported).

## Target subreddits (verify rules before EVERY post — they change, and rules pages were not fetchable this refresh)
| Subreddit | Audience | Culture notes |
|---|---|---|
| r/LocalLLaMA | 1 | Receipts culture, benchmarks, open-source lean; hostile to API-vendor cheerleading |
| r/ClaudeAI, r/OpenAI | 1-2 | Workflow posts + real usage patterns do well |
| r/ChatGPT | 3 | Massive; simple wins, show-your-screen posts |
| r/artificial, r/singularity | 4 | Discussion/essay links; singularity skews hype-tolerant |
| r/blueCollarWomen, r/electricians, r/Construction etc. | 3 | For story #8: ASK first, extreme self-promo allergy; lead with pure value, zero links |
| r/Parenting | 3-4 | Stories #6/#7/#12; no links, pure discussion value |

## What works
- Text posts that give 100% of the value in-post. Links to own content: only where rules allow, only after karma/tenure in that sub, ratio ~1 self-link per 10 contributions (reconfirmed 2026-07; the practiced norm has drifted even stricter, ~1:19, so 1:10 is the ceiling, not the target).
- "I built/measured/tested X, here's everything" with data in the post body.
- AMAs after establishing presence (reconfirmed 2026-07: r/IAmA remains the venue, ~70% of requests rejected, so the Emmy-nominated-journalist-building-agents hook matters).

## What dies
- Cross-posting identical text (each sub gets native framing or nothing).
- Any whiff of funnel-building. Redditors excavate post history; his has to show genuine participation.
- AI-detected low-value content: Reddit's ranking explicitly downranks it (as of 2026, reported), reinforcing the never-post-autonomously rule below.

## Timing (verified 2026-07-06 — /timing-check)
- r/all was DEPRECATED 2026-04-02 (platform official changelog): discovery now runs through personalized Home-feed ranking + r/popular. The exit ramp for "going wide" is Home-feed personalization, not a shared trending feed.
- Early votes still decide trajectory, but the operative window is the first 15-30 min of Rising-queue momentum within the subreddit (SEO-blog convergence, as of 2026-07). Weekday mornings ET for US-heavy subs remains the folklore baseline.
- Sort-by-new engagement (thoughtful early comments on rising posts) builds presence cheaply (reconfirmed 2026-07).
- Reddit Answers (Reddit's own AI search over its corpus) is live in 6 languages — another surface where strong posts resurface (platform official).

## Mitchell-specific
- Reddit is the primary discovery channel for audience 3 stories in text form: blue-collar AI, change-the-law, memory files for normal people.
- Never post from the agent autonomously: Reddit is the most authenticity-sensitive surface; Mitchell posts, agent drafts + monitors.
