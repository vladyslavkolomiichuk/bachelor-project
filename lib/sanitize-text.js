import sanitizeHtml from "sanitize-html";
import DOMPurify from "dompurify";

export function sanitizeInputBack(input) {
  return sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {},
  });
}

export function sanitizeInputFront(input) {
  return DOMPurify.sanitize(input);
}

export function sanitizeObjectDeepFront(input) {
  if (Array.isArray(input)) {
    return input.map((item) => sanitizeObjectDeepFront(item));
  }

  if (input !== null && typeof input === "object") {
    return Object.fromEntries(
      Object.entries(input).map(([key, value]) => [
        key,
        sanitizeObjectDeepFront(value),
      ])
    );
  }

  return sanitizeInputFront(input);
}

export function sanitizeObjectDeepBack(input) {
  if (Array.isArray(input)) {
    return input.map((item) => sanitizeObjectDeepBack(item));
  }

  if (input !== null && typeof input === "object") {
    return Object.fromEntries(
      Object.entries(input).map(([key, value]) => [
        key,
        sanitizeObjectDeepBack(value),
      ])
    );
  }

  return sanitizeInputBack(input);
}
