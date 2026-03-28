
# Farm Management SaaS - Design System

This document outlines the design system for the Farm Management SaaS application. The goal is to create a user interface that is clean, intuitive, and professional, while also reflecting the agricultural domain.

## Color Palette

The color palette is inspired by nature, with a focus on earthy tones and a clear, contrasting accent color for calls to action.

- **Primary:** `#2c6e49` (Forest Green) - Used for primary buttons, headers, and key navigation elements.
- **Secondary:** `#fefee3` (Parchment) - A warm, off-white for backgrounds and content areas.
- **Accent:** `#f5b700` (Goldenrod) - For calls to action, highlights, and important notifications.
- **Text:** `#333333` (Charcoal) - For all body text and general content.
- **Borders & Lines:** `#cccccc` (Light Gray) - For table borders, input field borders, and subtle dividers.

## Typography

- **Font Family:** We will use the 'Inter' font, a clean and readable sans-serif font available from Google Fonts. It should be imported in `index.html`.
- **Headings (h1, h2, h3):**
  - `font-weight: 600`
  - `color: #2c6e49` (Forest Green)
- **Body Text:**
  - `font-size: 16px`
  - `line-height: 1.6`
  - `color: #333333` (Charcoal)

## Spacing

Consistent spacing is crucial for a clean layout. We will use a base unit of 8px for all margins, padding, and positioning.

- **Small:** 8px
- **Medium:** 16px
- **Large:** 24px
- **X-Large:** 32px

## Components

### Buttons

- **Primary Button:**
  - `background-color: #2c6e49` (Forest Green)
  - `color: #ffffff`
  - `padding: 12px 24px`
  - `border-radius: 8px`
  - `font-weight: 600`
  - `text-transform: uppercase`
- **Secondary Button:**
  - `background-color: transparent`
  - `color: #2c6e49` (Forest Green)
  - `border: 2px solid #2c6e49`
  - `padding: 10px 22px`
  - `border-radius: 8px`
  - `font-weight: 600`

### Forms

- **Input Fields:**
  - `border: 1px solid #cccccc` (Light Gray)
  - `border-radius: 8px`
  - `padding: 12px`
  - `font-size: 16px`
- **Labels:**
  - `font-weight: 600`
  - `margin-bottom: 8px`
  - `display: block`

### Tables

- `width: 100%`
- `border-collapse: collapse`
- **Header:**
  - `background-color: #fefee3` (Parchment)
  - `font-weight: 600`
  - `text-align: left`
- **Cells:**
  - `padding: 16px`
  - `border-bottom: 1px solid #cccccc` (Light Gray)

## Implementation Plan

1.  **Add 'Inter' font to `index.html`.**
2.  **Update `App.css` and `index.css` with the new color palette and typography styles.**
3.  **Refactor existing components (`Dashboard.tsx`, `Tabs.tsx`, etc.) to use the new design system.**
4.  **Apply styles to the forms and lists in the `dairy` and `livestock` modules.**
5.  **Ensure all new components adhere to this design system.**
