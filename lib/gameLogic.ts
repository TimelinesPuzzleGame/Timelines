export function checkPlacement(
  placedDates: number[],
  newDate: number,
  position: number
): boolean {
  const newTimeline = [...placedDates];
  newTimeline.splice(position, 0, newDate);

  for (let i = 0; i < newTimeline.length - 1; i++) {
    if (newTimeline[i] > newTimeline[i + 1]) return false;
  }
  return true;
}
