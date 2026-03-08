# ValuesProfile.app — Product Specification v2.0

**Know Your Values. Own Your Decisions.**

*A CultureWright Consulting Product*  
*Jerry Wolf, Ph.D. Candidate — University of Pennsylvania, Chief Learning Officer Program*  
*December 2025*

---

## Executive Summary

ValuesProfile.app is a mobile-first web application that guides users through a **~7 minute** values discovery experience. Users sort **90 values presented in random order**, narrow to their top 5, rank them, and voice-define their #1 value. An agentic AI transforms their spoken words into a powerful personal definition, then generates contextual taglines for values #2 and #3.

The output is a beautiful, shareable **Values Card** displaying their top 3 values with personalized definitions—designed to be proudly shared on social media, connecting to users' moral identity while inviting others to discover their own values.

---

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **90 Values, Randomized** | Comprehensive coverage across 9 life domains. Random order prevents primacy/recency bias. |
| **Top 3 on Card** | Optimal for memory (rule of 3), fits social formats, creates hierarchy without overwhelm. |
| **Voice Input + AI Refinement** | User speaks naturally about #1 value; AI elevates to powerful prose while preserving authentic voice. |
| **User-Editable Definitions** | AI output is a starting point. Users can refine before finalizing their card. |

---

## Time Budget Analysis

| Step | Duration | Cumulative |
|------|----------|------------|
| Landing + Consent + Tutorial | 20 sec | 0:20 |
| Sort 90 values (3 sec avg/card) | 4:30 | 4:50 |
| Narrow "Very Important" to top 5 | 25 sec | 5:15 |
| Rank top 5 (drag and drop) | 20 sec | 5:35 |
| Voice define #1 value | 45 sec | 6:20 |
| AI processing + review/edit | 30 sec | 6:50 |
| **TOTAL** | | **~7 minutes** |

---

## Competitive Landscape

| Competitor | Approach | Weakness | Our Advantage |
|------------|----------|----------|---------------|
| **VIA Character Strengths** | 120 questions, 15 min, academic | Long, boring, no personalization, not shareable | 7 min, voice input, AI-personalized, social-first |
| **Barrett PVA** | Pick from list, enterprise focus | No personal definitions, B2B only, expensive | Voice captures meaning, B2C accessible, free tier |
| **Life Values Inventory** | Likert scale survey | Tedious, no behavioral anchoring, clinical feel | Engaging swipe UX, connects to real experience |
| **BuzzFeed Quizzes** | Fun, viral, simple | Shallow, generic results, no real insight | Research-backed + AI depth + shareable |

### Our Unique Position

ValuesProfile.app is the only tool that combines:

1. **Voice-native input** — Speak your values in your own words
2. **Agentic AI refinement** — Transforms rambling speech into powerful personal definitions
3. **User editability** — AI output is a starting point, not final word
4. **Social-first design** — Beautiful output people actually want to share
5. **Research-backed methodology** — Built on ValuesPrism empirical research from 400+ interviews

---

## The 90 Values Taxonomy

Our value set draws from three sources: ValuesPrism empirical research (400+ interviews), Schwartz's Theory of Basic Values, and the Rokeach Value Survey. Values are organized into 9 domains with 10 values each.

**PRESENTATION:** Values are shuffled into random order for each user to prevent ordering bias. Domain groupings exist for research analysis but are invisible to users during the assessment.

### Domain 1: Integrity & Character
*The foundation of moral identity—who you are when no one is watching.*

| Value | Card Text | Source |
|-------|-----------|--------|
| Integrity | Alignment between words and actions | ValuesPrism |
| Honesty | Truthfulness in communication | ValuesPrism |
| Honor | Living by a code of principles | ValuesPrism |
| Authenticity | Being true to yourself | Schwartz |
| Accountability | Owning outcomes and consequences | ValuesPrism |
| Responsibility | Taking ownership of duties | ValuesPrism |
| Dignity | Inherent worth of every person | ValuesPrism |
| Humility | Accurate self-assessment | Schwartz |
| Transparency | Openness in dealings | Rokeach |
| Consistency | Reliable behavior over time | Rokeach |

### Domain 2: Courage & Action
*The will to act despite fear, uncertainty, or opposition.*

| Value | Card Text | Source |
|-------|-----------|--------|
| Courage | Acting despite fear | ValuesPrism |
| Speaking-Up | Voicing truth to power | ValuesPrism |
| Perseverance | Persistence through difficulty | Schwartz |
| Resilience | Bouncing back from setbacks | Schwartz |
| Initiative | Taking action without prompting | Rokeach |
| Decisiveness | Making timely decisions | Rokeach |
| Adventure | Seeking new experiences | Schwartz |
| Boldness | Taking confident risks | Schwartz |
| Assertiveness | Standing firm on beliefs | Rokeach |
| Conviction | Strong belief in principles | Rokeach |

### Domain 3: Care & Compassion
*The capacity to see, feel, and respond to the needs of others.*

Care, Compassion, Empathy, Kindness, Generosity, Patience, Forgiveness, Nurturing, Gentleness, Presence

### Domain 4: Service & Duty
*The commitment to contribute to something greater than oneself.*

Service, Duty, Mission, Sacrifice, Stewardship, Citizenship, Volunteerism, Philanthropy, Legacy, Mentorship

### Domain 5: Excellence & Achievement
*The drive to perform at the highest level and accomplish meaningful goals.*

Excellence, Achievement, Competence, Standards, Ambition, Discipline, Focus, Efficiency, Recognition, Mastery

### Domain 6: Relationship & Connection
*The bonds that connect us to others and create meaning through belonging.*

Trust, Loyalty, Belonging, Family, Friendship, Community, Collaboration, Respect, Inclusion, Communication

### Domain 7: Growth & Development
*The commitment to continuous learning, improvement, and human potential.*

Development, Learning, Empowerment, Curiosity, Innovation, Creativity, Wisdom, Open-Mindedness, Adaptability, Self-Awareness

### Domain 8: Justice & Fairness
*The commitment to equity, rights, and moral treatment of all.*

Fairness, Justice, Equality, Equity, Rights, Liberty, Safety, Security, Advocacy, Voice

### Domain 9: Self-Direction & Meaning
*The autonomy to chart one's own course and live with purpose.*

Freedom, Independence, Purpose, Faith, Gratitude, Joy, Balance, Simplicity, Health, Peace

---

## User Experience Flow

### Step 1: Landing & Consent (20 sec)

User arrives at landing page with compelling hook:

> "Most people can't name their top 3 values. The ones who can make better decisions under pressure."

- Optional research consent with clear explanation
- Optional demographics (age range, industry, leadership role)
- Quick tutorial: "Swipe right for important, left for less important"

### Step 2: Sort 90 Values (4:30)

Values appear one at a time in **randomized order**. Each card shows the value name and a brief definition.

- **Swipe Right / Tap →:** "Very Important to me"
- **Swipe Up / Tap ↑:** "Somewhat Important"
- **Swipe Left / Tap ←:** "Less Important to me"

Progress bar shows completion. Satisfying animations on each swipe.

> **UX NOTE:** Desktop users see keyboard shortcuts (← ↑ →). Target: 3 seconds average per card.

### Step 3: Narrow to Top 5 (25 sec)

User sees all values they marked "Very Important" (typically 15-25 values). Tap to select exactly 5.

*Prompt: "If you could only keep 5 values, which would they be?"*

### Step 4: Rank Top 5 (20 sec)

Drag-and-drop interface to order values from #1 (most important) to #5.

*Prompt: "If you could only keep ONE value, which would it be? That's your #1."*

### Step 5: Voice Define #1 Value (45 sec)

User speaks naturally about what their #1 value means to them. Live transcription shows their words.

- "What does [VALUE] mean to YOU?"
- Helper prompts if stuck: "When have you seen this value tested?" "What would violating it feel like?"
- Option to re-record or type instead

*Fallback chain: Web Speech API → Whisper API → Text input*

### Step 6: AI Processing + Edit (30 sec)

Agentic AI transforms their voice input into a powerful personal definition for #1, then generates contextual taglines for #2 and #3 based on the ranking and voice context.

- Loading screen with rotating inspirational quotes
- **User can EDIT any definition** before finalizing
- "Regenerate" option if AI output misses the mark

### Step 7: Values Card + Share

User sees their beautiful Values Card with top 3 values and personalized definitions.

- Share to Instagram, LinkedIn, X, TikTok (platform-optimized formats)
- Download as image
- Copy shareable link
- CTA: "Want the full report? Unlock all 5 values + growth insights for $7.99"

---

## AI Agent Architecture

### Agent 1: Definition Refinement

Transforms raw voice transcript into powerful personal definition.

```
SYSTEM PROMPT

You are a values articulation specialist. Transform spoken,
informal reflections into powerful personal statements.

PRINCIPLES:
1. PRESERVE VOICE: Keep authentic phrasing when strong
2. ELEVATE: Make it sharper, not different
3. ANCHOR: Connect to concrete actions, not abstractions
4. BRIEF: 2-3 sentences maximum
5. SECOND PERSON: "You define..." / "For you..."

OUTPUT (JSON):
{
  "tagline": "2-5 word memorable phrase",
  "definition": "2-3 sentence personal definition"
}
```

**Example transformation:**

| | |
|---|---|
| **INPUT** | "Integrity for me is like... doing what you say you're going to do even when nobody's checking. Like at work when I could take shortcuts but I don't because I'd know..." |
| **OUTPUT** | **Tagline:** "The mirror test" |
| | **Definition:** "You define integrity as alignment between your private actions and public commitments. For you, the test isn't whether others are watching—it's whether you can look at yourself afterward." |

### Agent 2: Tagline Generation

Generates contextual taglines for #2 and #3 values based on ranking context and #1 definition style.

```
SYSTEM PROMPT

Given the user's #1 value definition and their ranked values,
generate taglines for #2 and #3 that:
- Match the voice/style of #1 definition
- Feel personally meaningful (not generic)
- Are 2-5 words each
- Consider the relationship between all 5 ranked values
```

### Error Handling

| Failure Mode | Detection | Recovery |
|--------------|-----------|----------|
| Web Speech unavailable | Feature detection on load | Show "Type instead" as primary |
| Transcription garbled | User clicks "Re-record" | Try Whisper API fallback |
| Claude API timeout | >15 second response | "Taking longer..." + auto-retry |
| Claude API error | 5xx response | Fallback to generic taglines |
| Empty voice input | <3 words transcribed | "We didn't catch that. Try again?" |
| Payment fails | Stripe webhook error | Retry button + support email |

---

## The Values Card — Social Sharing

The centerpiece output—a beautiful, personalized visual that connects to moral identity and invites others to discover their values.

### Design Principles

1. **Pride-worthy:** Something people WANT to share—not just tolerate sharing
2. **Identity-affirming:** Connects to moral identity ("This is who I am")
3. **Invitation to action:** Creates curiosity ("I want to know MY values")
4. **Platform-native:** Optimized for each social platform's format
5. **Clean and minimal:** Not cluttered, but shows enough to be interesting

### Card Layout

```
┌─────────────────────────────────────────┐
│                                         │
│           MY VALUES                     │
│                                         │
│   ┌───────┐  ┌───────┐  ┌───────┐      │
│   │   1   │  │   2   │  │   3   │      │
│   └───────┘  └───────┘  └───────┘      │
│   INTEGRITY   COURAGE    SERVICE       │
│                                         │
│   "The mirror test"                    │
│   "Voice over comfort"                 │
│   "Others before self"                 │
│                                         │
│   ─────────────────────────────────    │
│   Discover your values →                │
│   valuesprofile.app                     │
│                                         │
└─────────────────────────────────────────┘
```

### Platform Formats

| Platform | Dimensions | Notes |
|----------|------------|-------|
| Instagram Story | 1080×1920 | Full-screen vertical, swipe-up CTA |
| Instagram Post | 1080×1080 | Square, clean typography |
| LinkedIn | 1200×628 | Professional horizontal, subtle branding |
| X/Twitter | 1200×675 | 16:9 for timeline display |
| TikTok | 1080×1920 | Video with reveal animation (future) |

---

## Pricing & Revenue Model

### Free Tier

Complete values discovery experience with shareable output:

- Full 90-value sorting exercise
- Narrow to 5, rank, voice-define #1
- AI-generated definitions for top 3 (editable)
- Beautiful shareable Values Card (all platform formats)
- Shareable profile link

### Premium Report — $7.99

One-time purchase for deeper analysis:

- Voice definitions for ALL 5 top values
- Complete Values Signature synthesis
- Value tensions and potential conflicts analysis
- Decision-making framework based on your values
- Growth edge recommendations
- Professional PDF report (printable)
- Permanent saved profile with retake history

### Team License — $49/team

For teams up to 12 members:

- Premium Report for each member
- Team values comparison dashboard
- Facilitator guide with discussion prompts
- Team PDF summary

### Unit Economics

| Cost Component | Per Assessment |
|----------------|----------------|
| Claude API (definition + taglines) | ~$0.02-0.04 |
| Whisper API (if fallback used) | ~$0.01 |
| Neon PostgreSQL + Netlify | ~$0.002 |
| **Total Variable Cost** | **~$0.05** |

*At $7.99 Premium price, gross margin is ~99%.*

---

## Technical Architecture

### Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (App Router) + Tailwind CSS + Framer Motion |
| State | Zustand (client) + React Query (server) |
| Backend | Netlify Functions (serverless) |
| Database | PostgreSQL via Neon (serverless) + Drizzle ORM |
| AI | Claude Sonnet via Anthropic SDK (structured outputs) |
| Voice | Web Speech API (primary) + OpenAI Whisper (fallback) |
| PDF | @react-pdf/renderer |
| Image Gen | html-to-image + canvas for Values Cards |
| Payments | Stripe Checkout + Webhooks |
| Analytics | Plausible (privacy-friendly, GDPR compliant) |
| Hosting | Netlify (CDN + Functions + Edge) |

### Database Schema

```sql
-- Sessions table
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  consent_research BOOLEAN DEFAULT false,
  demographics JSONB,
  completed_at TIMESTAMPTZ,
  paid BOOLEAN DEFAULT false
);

-- Value sorts
CREATE TABLE sorts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id),
  value_name TEXT NOT NULL,
  category TEXT NOT NULL,  -- 'very', 'somewhat', 'less'
  sorted_at TIMESTAMPTZ DEFAULT now()
);

-- Rankings
CREATE TABLE rankings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id),
  value_name TEXT NOT NULL,
  rank INT NOT NULL  -- 1-5
);

-- Definitions
CREATE TABLE definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id),
  value_name TEXT NOT NULL,
  rank INT NOT NULL,
  raw_transcript TEXT,
  refined_definition JSONB,  -- {tagline, definition}
  user_edited BOOLEAN DEFAULT false
);

-- Profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id),
  profile_json JSONB NOT NULL,
  share_slug TEXT UNIQUE  -- for shareable links
);
```

### Project Structure

```
valuesprofile-app/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Global styles
│   ├── assess/
│   │   ├── page.tsx                # Assessment start
│   │   ├── sort/page.tsx           # Card sorting
│   │   ├── narrow/page.tsx         # Pick top 5
│   │   ├── rank/page.tsx           # Ranking
│   │   ├── define/page.tsx         # Voice definitions
│   │   └── review/page.tsx         # Edit definitions
│   ├── profile/
│   │   ├── [slug]/page.tsx         # Public profile
│   │   └── complete/page.tsx       # Post-completion
│   └── api/                        # API routes
├── components/
│   ├── ui/                         # Shadcn components
│   ├── ValueCard.tsx               # Swipeable card
│   ├── VoiceRecorder.tsx           # Voice input
│   ├── ValuesCard.tsx              # Shareable image
│   ├── DefinitionEditor.tsx        # Inline editing
│   └── ProfileReport.tsx           # Full profile
├── lib/
│   ├── db.ts                       # Drizzle client
│   ├── schema.ts                   # DB schema
│   ├── anthropic.ts                # Claude SDK
│   ├── values.ts                   # 90 values data
│   └── prompts.ts                  # AI prompts
├── netlify/functions/              # Serverless funcs
├── public/                         # Static assets
├── netlify.toml                    # Netlify config
└── package.json
```

---

## Claude Code Development Plan

4-week plan for building with Claude Code, deploying to Netlify.

### Week 1: Foundation

1. Project scaffold: Next.js 14 + Tailwind + Framer Motion
2. Neon PostgreSQL setup + Drizzle schema
3. 90 values data structure with domains and definitions
4. ValueCard component with swipe/tap interactions
5. Sorting flow with randomization and progress indicator

### Week 2: Voice & AI

1. Narrowing UI (select 5 from "Very Important")
2. Ranking UI (drag-and-drop)
3. Voice recording with Web Speech API + fallbacks
4. Anthropic SDK integration for definition refinement
5. Tagline generation agent for #2 and #3

### Week 3: Output & Sharing

1. Profile display with AI-generated content
2. Definition editing UI (inline edit, regenerate)
3. Values Card component (beautiful, branded)
4. Image generation for all platform formats
5. Share buttons with deep links
6. Stripe Checkout integration for Premium

### Week 4: Polish & Launch

1. Landing page with compelling copy
2. Premium PDF report generation
3. Mobile testing (iOS Safari, Android Chrome)
4. Accessibility audit (WCAG 2.1 AA)
5. Error handling and edge cases
6. Analytics setup (Plausible)
7. Deploy to Netlify production

---

## Success Metrics

### North Star

**Weekly completed assessments** (users reaching Values Card screen)

### Funnel Metrics

| Stage | Metric | Target |
|-------|--------|--------|
| Start | Begin assessment | 60% of visits |
| Sort Complete | Finish 90 cards | 80% of starters |
| Voice Complete | Submit definition | 85% of rankers |
| Share | Values Card shared | 25% of completers |
| Convert | Premium purchased | 5-10% of completers |

### 6-Month Business Targets

- 10,000+ completed assessments
- 2,500+ Values Cards shared on social media
- 500-1,000 Premium Report purchases (~$4,000-8,000 revenue)
- 5+ Enterprise/Team inquiries from social visibility
- 5,000+ consented research data points for ValuesPrism

---

## Privacy & Research Ethics

### GDPR Compliance

- Explicit opt-in for research participation
- Data minimization (only collect what's needed)
- Right to erasure ("Delete my data")
- Data portability (JSON export)
- Cookieless analytics (Plausible)

### Data Retention

- No consent: Session deleted after 24 hours
- With consent: Retained indefinitely for research
- Voice recordings: Never stored (only transcripts)
- Profiles: Stored only if account created

### Accessibility (WCAG 2.1 AA)

- ARIA labels on all interactive elements
- Full keyboard navigation, visible focus states
- 4.5:1 color contrast minimum
- `prefers-reduced-motion` support
- Always offer "Type instead" alternative

---

*— End of Document —*
