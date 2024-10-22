export function getInitials(name: string) {
  const words = name.replaceAll("_", " ").split(" ");

  let initials = "";
  for (const w of words) {
    initials += w.charAt(0).toLocaleUpperCase();
  }

  return initials;
}

export function capitalizeWords(name: string) {
  const words = name.replaceAll("_", " ").split(" ");

  let word = "";
  for (const w of words) {
    word += w.charAt(0).toLocaleUpperCase() + w.substring(1) + " ";
  }

  return word;
}

export const truncateString = (str: string, n: number): string => {
  return str.length > n ? str.substring(0, n) + "..." : str;
};

export const toUrlHandle = (
  fileName: string,
  type: "files" | "images",
): string => {
  let name = fileName.split(".").slice(0, -1).join(".");
  return name
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
};
