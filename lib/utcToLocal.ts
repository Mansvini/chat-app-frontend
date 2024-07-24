export function utcToLocal(utcTimestamp: Date): string {
    // Create a Date object from the UTC timestamp with ' UTC' appended
  const date = new Date(utcTimestamp + ' UTC');

  // Check if the date is valid
  if (!(date instanceof Date)) {
    throw new Error('Invalid date');
  }

  const localTimeStamp = new Date(date.toString());
  // Extract components of the local date and time
//   const localDateString = localTimeStamp.toLocaleDateString();
  const localTimeString = localTimeStamp.toLocaleTimeString();

  // Combine the date and time components into a single string
//   const localDateTimeString = `${localDateString} ${localTimeString}`;

  return localTimeString;
}