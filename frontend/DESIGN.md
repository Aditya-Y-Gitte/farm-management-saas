# Farm Management SaaS - Design System

This document outlines the design system for the Farm Management SaaS application. The goal is to create a user interface that is clean, intuitive, and professional, while also reflecting the agricultural domain.

## Color Palette

The color palette is inspired by nature, with a focus on earthy tones and a clear, contrasting accent color for calls to action.

- **Primary:** `#3a5a40` (Dark Green) - Used for primary buttons, headers, and key navigation elements.
- **Secondary:** `#f9f9f9` (Light Gray) - A neutral background color.
- **Accent:** `#8884d8` (Lavender) - For charts and highlights.
- **Secondary Accent:** `#82ca9d` (Sea Green) - For charts and secondary highlights.
- **Text:** `#333333` (Charcoal) - For all body text and general content.
- **Borders & Lines:** `#dddddd` (Light Gray) - For table borders, input field borders, and subtle dividers.
- **Card Background:** `#ffffff` (White) - For card elements.

## Typography

- **Font Family:** We will use the 'Inter' font, a clean and readable sans-serif font available from Google Fonts. It should be imported in `index.html`.
- **Headings (h1, h2, h3):**
  - `font-weight: 700`
  - `color: #333333` (Charcoal)
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

### Cards

- `background-color: #ffffff` (White)
- `padding: 1.5rem`
- `border-radius: 8px`
- `box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05)`
- `text-align: center`

### Charts

- `background-color: #ffffff` (White)
- `padding: 1.5rem`
- `border-radius: 8px`
- `box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05)`

### Buttons

- **Primary Button:**
  - `background-color: #3a5a40` (Dark Green)
  - `color: #ffffff`
  - `padding: 12px 24px`
  - `border-radius: 8px`
  - `font-weight: 600`
- **Secondary Button:**
  - `background-color: transparent`
  - `color: #3a5a40` (Dark Green)
  - `border: 2px solid #3a5a40`
  - `padding: 10px 22px`
  - `border-radius: 8px`
  - `font-weight: 600`

### Forms

- **Input Fields:**
  - `border: 1px solid #dddddd` (Light Gray)
  - `border-radius: 8px`
  - `padding: 12px`
  - `font-size: 16px`
- **Labels:**
  - `font-weight: 600`
  - `margin-bottom: 8px`
  - `display: block`

## Implementation Plan

1.  **Add 'Inter' font to `index.html`.**
2.  **Update `App.css` and `index.css` with the new color palette and typography styles.**
3.  **Refactor existing components to use the new design system.**
4.  **Ensure all new components adhere to this design system.**
