import sanitizeHtml from "sanitize-html";
export function sanitizeMe(data: any) {
  let cleanData: any = {};
  for (let [key, value] of Object.entries(data)) {
    cleanData[key] = sanitizeHtml(String(value), {
      allowedAttributes: {},
      allowedTags: [],
    });
  }
  return cleanData;
}
