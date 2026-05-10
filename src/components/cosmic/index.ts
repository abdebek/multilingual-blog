export const cosmicVariants = {
  none: () => import('./variants/None.astro'),
  gradient: () => import('./variants/Gradient.astro'),
  particles: () => import('./variants/Particles.astro'),
  starfield: () => import('./variants/Starfield.astro'),
} as const;

export type CosmicVariant = keyof typeof cosmicVariants;

export const DEFAULT_COSMIC: CosmicVariant =
  (import.meta.env.COSMIC_VARIANT as CosmicVariant | undefined) ??
  'none';
