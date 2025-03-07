import sanitizeHtml from "sanitize-html";

export function sanitizeMe(data: any) {
  // Check if data is an object (single object or array of objects)
  if (typeof data === "object") {
    if (Array.isArray(data)) {
      // If data is an array of objects, sanitize each object in the array
      return data.map((item) => sanitizeObject(item));
    } else {
      // If data is a single object, sanitize it
      return sanitizeObject(data);
    }
  }
  return data; // Return data as is if it's not an object or array
}

// Helper function to sanitize each object
function sanitizeObject(obj: any) {
  let cleanData: any = {};
  for (let [key, value] of Object.entries(obj)) {
    cleanData[key] = sanitizeHtml(value as string | number | any, {
      allowedAttributes: {},
      allowedTags: [],
    });
  }
  return cleanData;
}
