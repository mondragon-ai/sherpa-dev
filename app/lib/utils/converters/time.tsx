export function getHoursDifference(timeString: number): string {
  const inputTime = new Date(timeString * 1000);
  if (isNaN(inputTime.getTime())) {
    throw new Error("Invalid date format");
  }

  const currentTime = new Date();

  const diffMilliseconds = currentTime.getTime() - inputTime.getTime();

  const diffHours = Math.round(diffMilliseconds / (1000 * 60 * 60));
  const diffMin = Math.round(diffMilliseconds / (1000 * 60));

  if (diffHours >= 720) {
    return `${(diffHours / 720).toFixed(0)}M`;
  }

  if (diffHours >= 168 && diffHours < 720) {
    return `${(diffHours / 168).toFixed(0)}w`;
  }

  if (diffHours > 72 && diffHours < 168) {
    return `${(diffHours / 24).toFixed(0)}d`;
  }

  if (diffMin < 60) {
    return `${Math.abs(diffMin).toFixed(0)}m`;
  }

  return `${diffHours.toFixed(0)}h`;
}

export const createCurrentSeconds = () => {
  const dateInMillisecs = new Date().getTime();
  return Math.round(dateInMillisecs / 1000);
};

export const formatTimestamp = (seconds: number): string => {
  const date = new Date(seconds * 1000);

  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  return date.toLocaleString("en-US", options);
};
