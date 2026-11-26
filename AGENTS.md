# Agent Guidelines: Deloitte Stage Gate Preparation

## Core Mission & Scope
- **Objective**: Prepare thoroughly to clear and excel in the Deloitte Stage Gate examination.
- **Technology Focus**: Exclusively **SQL and PL/SQL** (Oracle Database standard). Strictly enforce Oracle syntax and built-ins (never introduce non-Oracle syntax like LIMIT or IFNULL).

## Directory Structure & Topic Tracking
The workspace is divided into three primary folders:
1. `SQL/`
2. `PLSQL/`
3. `SQL_PLSQL_MIXED/`

### Topic Subfolders & In-Folder Tracking
- **On-Demand Subfolders**: Do not create subfolders in advance. Create a specific topic subfolder inside `SQL/`, `PLSQL/`, or `SQL_PLSQL_MIXED/` (such as `select_statement`, `cursors`, or `triggers`) only when the user asks to study that topic.
- **Automatic File Initialization**: Whenever a topic subfolder is created, immediately and automatically create two files inside it without needing the user to ask:
  1. `TRACKER.md`: Strictly contains only two sections: concepts covered and practice questions completed.
  2. `NOTES.md`: Created blank, to be updated incrementally with short summaries of learned concepts.
- **Tracker Update Criteria**: Do not update `TRACKER.md` simply because a concept was explained. A concept is strictly recorded under "Concepts Covered" only after the user explicitly confirms understanding or answers the check question correctly. Practice questions are only recorded once attempted and solved.
- **Incremental Notes (`NOTES.md`)**: Whenever a concept is confirmed as understood or solved, append a clear, self-contained summary to `NOTES.md`. Ensure notes are practical and immediately understandable for future exam revision, avoiding cryptic fragments or unnecessary filler.

## Root State Tracking & Compaction Defense
- **Root Bookmark (`TRACKER.md`)**: Maintain a `TRACKER.md` in the root `StageGate/` directory that records only the folder currently being worked on (for example: `Active Folder: SQL/select_statement/`).
- **Active Path Update**: Whenever a new topic starts or switches, immediately update the root `TRACKER.md` with the active folder path.
- **Resume Protocol**: When context compacts or resets, inspect the root `TRACKER.md` first to see where work was left off, then open that specific subfolder's `TRACKER.md` to resume seamlessly.

## Teaching & Pacing Protocol
- **One Concept per Turn**: Strictly explain only one single concept at a time. Never combine multiple concepts or sub-topics into a single message.
- **Interactive Progression**: Keep explanations minimal with a simple example, end with a quick check question, and wait for the user to respond before introducing the next concept.
- **Topic Completion & Transition**: Once all core concepts and typical exam requirements for a topic are covered and understood, clearly notify the user that the topic is complete, and prompt them to confirm moving to the next topic.
- **Descriptive Error Messages**: When explaining query failures or syntax traps, always provide the descriptive Oracle error message and the exact reason behind it.

## SQL Practice Drills Protocol (`sql_drills/`)
- **Shared Template vs. Local-Only Drill Sheet**:
  - `sql_drills/DRILLS_MATRIX.md` is kept on GitHub strictly in its clean `0/X` format (with `(None yet)` history) so anyone cloning or downloading the repository can start practice drills locally from scratch.
  - All live personal scores, counters, and `History` logs MUST stay **local-only** in the gitignored drill sheet: `sql_drills/DRILLS_MATRIX.local.md`. **Never commit or push personal drill scores or history to GitHub.**
  - Before starting drills, if `sql_drills/DRILLS_MATRIX.local.md` does not exist yet locally, initialize it by copying the clean template from `sql_drills/DRILLS_MATRIX.md`.
- **Master Drills Matrix (`DRILLS_MATRIX.local.md`)**: Maintained locally inside `sql_drills/`. Lists every SQL concept across all covered topics with live target counters (e.g., `Practical: 0/1 | MCQ: 0/2`).
- **Interleaved Random Selection**: Select concepts at random from those that have not yet reached their target counters.
- **Blind Question Presentation (Anti-Spoiler)**: Never display the topic name, concept name, concept number, or trap category when asking a question. Present only the question number, scenario/code, schema (if applicable), and options/requirements so the user must diagnose the problem completely unprompted.
- **Pre-Question History Inspection & Distinct Sub-Traps**: Before crafting a question for the selected concept, the agent must check that concept's `History` log in `DRILLS_MATRIX.local.md`. The new question must target a completely different, un-tested inner angle or trap within that concept (derived from its `NOTES.md`), never repeating or asking a similar variant of a previously asked question.
- **Post-Solve History & Counter Logging**: Never write to `History` or increment counters in `DRILLS_MATRIX.local.md` in advance when presenting a question. Strictly log the brief trap title under `History` and increment the counter only *after* the user attempts and solves the question.
- **Strict Failure, Remediation & Anti-Cheat Protocol**:
  - If the user fails a practical query or MCQ, the agent must:
    1. **Full Concept Drop**: Reproduce the entire concept section verbatim from that topic's `NOTES.md` so the user can review and recall the complete concept context.
    2. **Mistake & Solution Breakdown**: Provide a clear explanation of what was done wrong, the exact Oracle error code and description (if applicable), and the correct solution.
    3. **Remediation Drill**: Ask follow-up check questions on that concept until the user solves it correctly.
  - **Zero Counter Increment on Remediation**: Successfully solving a remediation question does **not** increment the counter in `DRILLS_MATRIX.local.md`. A counter strictly increments only when a fresh, random question is solved correctly on the first attempt during random rotation. Once remediation is complete, the drill matrix remains unchanged and random rotation resumes.

## Automatic Git Sync & Deployment Protocol
- **Continuous GitHub Sync**: Whenever shared curriculum/config files are created, updated, or deleted (such as `NOTES.md`, `TRACKER.md`, `AGENTS.md`, website files, or clean `0/X` format updates to `DRILLS_MATRIX.md`), immediately commit and push the changes to GitHub without waiting for an explicit prompt. **Never commit or push local drill scores (`sql_drills/*.local.md`) or live drill progress to GitHub.**
- **Execution Workflow**:
  1. If notes or website data are updated, regenerate the live site payload (`node build_site.js`).
  2. Stage all tracked modifications (`git add -A` — local drill files `sql_drills/*.local.md` are gitignored).
  3. Create a concise, descriptive commit message summarizing the exact changes made (e.g., `git commit -m "Update NOTES.md: Character functions LPAD/RPAD"`).
  4. Push directly to remote (`git push origin main`).
  5. If public website assets or notes were updated, deploy the latest build to Firebase Hosting (`firebase deploy --only hosting`) to keep the live web app in sync.
