# FAQ accordion card

An implementation of the [Frontend Mentor FAQ accordion card challenge](https://www.frontendmentor.io/challenges/faq-accordion-card-XlyjD0Oam), using its supplied illustrations, copy and design references.

## Development

Node 22.13 or later. Use `npm ci`, `npm run dev`, `npm run lint`, `npm run typecheck`, `npm run build`, and `npm test`. Browser tests use installed Chrome and own port 4537.

Next 16.3.6, React 19.2.8, TypeScript 5.9.3 and Tailwind 4.2.1 are pinned to the family baseline. The page is a server component with no client JavaScript of its own.

## Sources

Original challenge files are preserved under `reference/`; supplied images moved byte-for-byte to `public/images/`. Geometry and colors follow the decoded Figma frames (Mobile 375, Desktop and Desktop - Active 1440). Kumbh Sans 400/700 loads through `next/font`.

## Implementation choices

- The accordion is native `<details name="faq">`: one answer open at a time, Enter/Space keyboard support and the expanded state come from the browser, and it works without JavaScript. The second question starts open, as in the design comp.
- The design sets questions at 13–14px and answers at 12px. They rise to the family 16px floor because they are the page's body copy; the card keeps the Figma width and positions and grows slightly taller.
- The answer gray and interactive orange are darker versions of the supplied colors. Expanded answers and hovered questions meet 4.5:1 normal text contrast, and the keyboard focus ring meets 3:1 against the card. Rendered browser regressions cover every answer and hover state at mobile, tablet and desktop widths.
- The desktop card (920×509) starts at 1120px, where the box illustration that breaks out of the card's left edge still has room on screen. Below that the mobile layout is used, with the card widening up to 480px.
