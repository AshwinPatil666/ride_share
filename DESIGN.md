---
name: Kinetic Campus
colors:
  surface: '#fcf8ff'
  surface-dim: '#dbd8e4'
  surface-bright: '#fcf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f2fe'
  surface-container: '#efecf8'
  surface-container-high: '#e9e6f3'
  surface-container-highest: '#e4e1ed'
  on-surface: '#1b1b23'
  on-surface-variant: '#464554'
  inverse-surface: '#303038'
  inverse-on-surface: '#f2effb'
  outline: '#767586'
  outline-variant: '#c7c4d7'
  surface-tint: '#494bd6'
  primary: '#4648d4'
  on-primary: '#ffffff'
  primary-container: '#6063ee'
  on-primary-container: '#fffbff'
  inverse-primary: '#c0c1ff'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#904900'
  on-tertiary: '#ffffff'
  tertiary-container: '#b55d00'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffdcc5'
  tertiary-fixed-dim: '#ffb783'
  on-tertiary-fixed: '#301400'
  on-tertiary-fixed-variant: '#703700'
  background: '#fcf8ff'
  on-background: '#1b1b23'
  surface-variant: '#e4e1ed'
typography:
  display:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  h1:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  h2:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  margin-mobile: 20px
  gutter-mobile: 12px
---

## Brand & Style

This design system is built for the high-velocity environment of university life. It prioritizes a **Modern/Corporate** aesthetic that leans heavily into a "digital-native" feel—clean, efficient, and dependable. The brand personality is energetic yet organized, aiming to evoke a sense of safety and community reliability. 

The visual language uses generous whitespace and a sophisticated palette to reduce cognitive load for students navigating campus transit. It balances the professional reliability required for a logistics platform with the approachable friendliness of a peer-to-peer social network.

## Colors

The color strategy uses **Indigo (#6366F1)** as the primary anchor for navigation, branding, and core interactive elements. This choice provides a sense of technological sophistication and trust. **Emerald (#10B981)** serves as a high-visibility accent, reserved specifically for "success" states, active ride confirmations, and "Go" actions to provide immediate positive reinforcement.

The background utilizes **Slate-50**, providing a cool, off-white canvas that reduces screen glare and allows white card elements to pop via subtle elevation.

## Typography

This design system utilizes the **Inter** font family exclusively to maintain a utilitarian and systematic feel. The type hierarchy is optimized for mobile readability, using tight letter-spacing on larger displays to create a "locked-in" professional look. 

Heavy weights (600-700) are used for headlines to ensure clear information architecture during quick scanning. Labels use a slightly medium weight to maintain legibility even at small scales on mobile screens.

## Layout & Spacing

The layout follows a **Fluid Grid** model optimized for handheld devices. It utilizes a 4-column grid for mobile with 20px side margins and 12px gutters. All spacing is derived from a base 8px unit, ensuring a consistent rhythm throughout the application. 

Padding within containers should scale linearly: 16px (md) for standard cards and 24px (lg) for hero sections. Vertical rhythm is maintained by aligning all elements to the 8px baseline.

## Elevation & Depth

Visual hierarchy is established through **Tonal Layers** and **Ambient Shadows**. This design system avoids harsh blacks; instead, shadows utilize a subtle Indigo-tinted Slate color to keep the UI feeling "airy."

- **Level 0 (Floor):** Slate-50 background.
- **Level 1 (Cards/Inputs):** Pure white surface with a 1px Slate-200 border and a soft, low-opacity shadow (Y: 2px, Blur: 4px).
- **Level 2 (Floating/Active):** Higher elevation with a more diffused shadow (Y: 8px, Blur: 16px) to indicate items that are draggable or overlays.
- **Level 3 (Navigation):** Bottom bars use a backdrop-blur (12px) effect with 95% opacity to maintain context of the content behind it.

## Shapes

The shape language is defined as **Rounded**, providing a friendly and accessible interface. Standard components like buttons and cards use a 0.5rem (8px) radius. Larger containers or feature cards utilize "rounded-lg" (1rem/16px) to create a soft, modern container feel. Smaller elements like chips or tags may use "rounded-full" to distinguish them from interactive buttons.

## Components

### Buttons
- **Primary:** Solid Indigo background, White text. High-contrast, 0.5rem roundedness.
- **Secondary:** Solid Emerald background. Reserved for "Book Ride" or "Confirm" actions.
- **Ghost:** Transparent background with Slate-600 text for less critical actions like "Cancel."

### Cards
Cards are the primary content container. They must have a White background, a 1px Slate-200 border, and the Level 1 shadow profile. Content within cards should follow the 16px internal padding rule.

### Form Inputs
Inputs use a white background with a 1px Slate-200 border. On focus, the border transitions to Primary Indigo with a 2px outer glow. Labels should be persistent and use the `label-sm` typographic style.

### Bottom Navigation Bar
The navigation bar is fixed to the bottom of the viewport. It features a blurred white background. Active states are indicated by an Indigo icon and a subtle 4px Indigo dot indicator underneath the icon.

### Ride Status Chips
Small, pill-shaped indicators (rounded-full). For example: "En Route" (Emerald background, 10% opacity, solid Emerald text) or "Searching" (Indigo background, 10% opacity, solid Indigo text).