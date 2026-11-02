# Looker Studio: registration funnel

A free, self-updating dashboard on top of GA4 that shows, per course
(Beginners / Improvers), how many people get from the site to a submitted form.

| Step | GA4 source |
|---|---|
| 1. Visited the site | Sessions (hostname `tangogarden.de`) |
| ↳ Bounced | Bounce rate (session not engaged) |
| 2. Opened the course page | Sessions on `/pages/beginner-course` or `/pages/growth-sessions` (and `/de/…`) |
| 3. Clicked "Reserve your spot" | `register_click`, parameter `course` |
| 4. Submitted the form | `registration_submit`, parameter `course` (sent by the form's Apps Script) |

**Read it as counts per step, not as people moving through.** Step 4 arrives
from Google Forms with no link to the website visitor, so GA4's own funnel
report (which follows people) would show it as zero. Compare the numbers and
the ratios between steps.

`course` values: `beginner-course`, `growth-sessions`. The `Course` custom
dimension exists since 2 Nov 2026; events before that have no course.

---

## 1. Create the report and connect GA4 (2 min)

1. Open **lookerstudio.google.com** with the Google account that can see GA4
   (vangelis.theodorakis@tangogarden.de).
2. **Create → Report**. Choose the **Google Analytics** connector, then the
   Tango Garden account and property **550087499**. **Add → Add to report**.
3. Rename the report (top left): **Tango Garden · Registration funnel**.
4. **Resource → Manage added data sources → Edit**: check that **Course**
   appears in the field list (dimension, green). If not, click **Refresh fields**.

## 2. Report-wide settings

- **Date range control**: **Insert → Date range control**, place it top right,
  default **Last 28 days**.
- **Hostname filter** (keeps out old test traffic): **Page → Current page
  settings → Filters → Add a filter** → *Include* · `Hostname` · *Equal to* ·
  `tangogarden.de`. Name it **Live site only**.
  Note: `registration_submit` arrives without a hostname. Remove this filter
  from the two step-4 charts below (chart → **Setup → Filter** → remove), or
  they show 0.

## 3. Filters to create once (Resource → Manage filters → Add)

| Name | Include condition |
|---|---|
| Beginner page | `Page path and screen class` · *RegExp match* · `^(/de)?/pages/beginner-course/?$` |
| Improvers page | `Page path and screen class` · *RegExp match* · `^(/de)?/pages/growth-sessions/?$` |
| Beginner clicks | `Event name` = `register_click` **AND** `Course` = `beginner-course` |
| Improvers clicks | `Event name` = `register_click` **AND** `Course` = `growth-sessions` |
| Beginner submits | `Event name` = `registration_submit` **AND** `Course` = `beginner-course` |
| Improvers submits | `Event name` = `registration_submit` **AND** `Course` = `growth-sessions` |

## 4. The funnel: two rows of scorecards

**Insert → Scorecard**, one per box. Set the metric and the filter as listed,
and rename the metric (click its name) to the label.

Row 1, **Site**:

| Label | Metric | Filter |
|---|---|---|
| Visits | Sessions | Live site only |
| Bounce rate | Bounce rate | Live site only |

Row 2, **Beginners** (copy the row and swap the filters for **Improvers**):

| Label | Metric | Filter |
|---|---|---|
| Course page visits | Sessions | Beginner page |
| Register clicks | Event count | Beginner clicks |
| Forms submitted | Event count | Beginner submits (remove *Live site only*) |

Add text boxes between the scorecards with an arrow (→) so the row reads as
a funnel. Optional: turn on **Comparison date range → Previous period** in
each scorecard to show the change against the previous 28 days.

## 5. Clicks and submits side by side

**Insert → Pivot table**:
- Row dimension: **Course**
- Column dimension: **Event name**
- Metric: **Event count**
- Filter (new): `Event name` *In* `register_click, registration_submit`
  (and remove *Live site only* from this chart)

## 6. Where visitors come from

**Insert → Table**:
- Dimension: **Session default channel group** (or **Session source / medium**
  for detail: instagram, google, meetup, Meta ads)
- Metrics: **Sessions**, **Bounce rate**, **Event count** with the filter
  `Event name` = `register_click`

`registration_submit` cannot be split by source (see the note at the top),
so stop this table at register clicks.

## 7. Trend over time

**Insert → Time series**:
- Dimension: **Date** (switch to **ISO year week** for smoother lines)
- Breakdown dimension: **Event name**
- Metric: **Event count**
- Filter: `Event name` *In* `register_click, registration_submit`

## 8. Share

**Share** (top right): add Kristina as *Viewer*. Viewers see the data through
your credentials; they do not need GA4 access.

---

## Reading it

- Volumes are small (summer 2026: about 1,200 visits and 27 register clicks
  in five weeks). Compare **months or semesters**, not single weeks.
- Click → submit below ~50% means the form loses people. Page → click is
  where the course page does its work.
- Your own test submissions count too. Use a `+test` email and expect a few
  extra submits on test days.
- rausgegangen and Eventbrite sign-ups never reach the website, so they are
  invisible here.
