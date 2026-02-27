import type { Charge, FieldResult } from "../types/simulation";

export const COULOMB_CONSTANT = 8.99e9;

export function calculateField(charges: Charge[], x: number, y: number): FieldResult {
  let Ex = 0;
  let Ey = 0;

  for (const charge of charges) {
    const dx = x - charge.x;
    const dy = y - charge.y;
    const r = Math.sqrt(dx * dx + dy * dy);

    if (r < 10) {
      continue;
    }

    const E = (COULOMB_CONSTANT * charge.magnitude * charge.polarity) / (r * r);
    Ex += (E * dx) / r;
    Ey += (E * dy) / r;
  }

  return { Ex, Ey, magnitude: Math.sqrt(Ex * Ex + Ey * Ey) };
}

export function containsPoint(charge: Charge, x: number, y: number): boolean {
  const dx = x - charge.x;
  const dy = y - charge.y;
  return dx * dx + dy * dy <= charge.radius * charge.radius;
}

export function formatFieldStrength(value: number): string {
  if (value > 1e6) {
    return `${(value / 1e6).toFixed(2)} MN/C`;
  }
  return `${value.toFixed(2)} N/C`;
}

export function netChargeMicroCoulombs(charges: Charge[]): number {
  const netCharge = charges.reduce((sum, c) => sum + c.polarity * c.magnitude, 0);
  return netCharge * 1e6;
}

export function calculatePotential(charges: Charge[], x: number, y: number): number {
  let potential = 0;
  for (const charge of charges) {
    const dx = x - charge.x;
    const dy = y - charge.y;
    const r = Math.sqrt(dx * dx + dy * dy);
    if (r < 10) {
      continue;
    }
    potential += (COULOMB_CONSTANT * charge.magnitude * charge.polarity) / r;
  }
  return potential;
}

export function formatPotential(value: number): string {
  if (Math.abs(value) >= 1e6) {
    return `${(value / 1e6).toFixed(2)} MV`;
  }
  if (Math.abs(value) >= 1e3) {
    return `${(value / 1e3).toFixed(2)} kV`;
  }
  return `${value.toFixed(2)} V`;
}
