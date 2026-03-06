

## Apply Option D: Left Accent Bar + Muted Self-Initiated Cards

Two targeted class changes in `src/pages/Index.tsx`:

**1. MandatedJourneyCard (line 73)**
Replace `border-2 border-primary/25 bg-card` with `border border-border border-l-4 border-l-primary bg-card shadow-sm`. This adds a bold left accent bar and subtle elevation while removing the full primary border wash.

**2. SelfInitiatedJourneyCard (line 104)**
Replace `border border-border bg-card/80` with `border border-border/60 bg-card/60`. This makes personal cards visually recede, reinforcing the hierarchy.

No structural, data, or component changes needed.

