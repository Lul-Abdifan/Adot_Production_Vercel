export function formatDateShortYear(date: Date) {
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-indexed
    const year = String(date.getFullYear()).slice(2);
  
    return `${day}-${month}-${year}`;
  }
  export function formatDate(date: Date) {
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-indexed
    const year = date.getFullYear();
  
    return `${year}-${month}-${day}`;
  }
  export function getPreviousSunday(date: Date): string {
    const dayOfWeek = date.getDay();
    const daysToSubtract = dayOfWeek === 0 ? 0 : dayOfWeek;
    const previousSunday = new Date(date);
    previousSunday.setDate(date.getDate() - daysToSubtract);
    return formatDate(previousSunday);
  }
  
  export function getNextSaturday(date: Date): string {
    const dayOfWeek = date.getDay();
    const daysToAdd = dayOfWeek === 6 ? 0 : 6 - dayOfWeek;
    const nextSaturday = new Date(date);
    nextSaturday.setDate(date.getDate() + daysToAdd);
    return formatDate(nextSaturday);
  }