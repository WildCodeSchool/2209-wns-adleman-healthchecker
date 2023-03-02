const formatUrl = (url: string): string => {
  return url.replace("http://", "").replace("https://", "").replace("/", "");
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear().toString().substr(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

export { formatUrl, formatDate };
