export function round(value: number, places?: number): number {
  return +value.toFixed(places || 2)
}
