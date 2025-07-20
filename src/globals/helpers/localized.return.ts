export function localizedObject(obj: any, locale: string): unknown {
  // Normalize the incoming locale to lowercase for consistent comparison
  const targetLanguage = locale?.toLowerCase();

  // Special case for 'admin' locale: return object as is without localization
  if (targetLanguage === 'admin') {
    return obj;
  }

  // Base case 1: If the input is not an object, or is null, return it as is
  if (typeof obj !== 'object' || obj === null) {
    if (typeof obj === 'bigint') {
      return obj.toString(); // Handle BigInt
    }
    return obj;
  }

  // Base case 2: If the object itself is a potential localized string object
  // This handles structures like { en: 'John', ar: 'جون', es: 'Juan' }
  // We check if it has keys that look like language codes (e.g., 'en', 'ar')
  // And try to retrieve the value for the targetLanguage
  const objAsAny = obj as any; // Cast to any to access properties dynamically
  const isLocalizedObjectCandidate = Object.keys(objAsAny).every(
    (key) => key.length === 2 && /^[a-z]{2}$/.test(key),
  ); // Check if all keys are 2-letter language codes

  if (isLocalizedObjectCandidate) {
    if (typeof objAsAny[targetLanguage] !== 'undefined') {
      return objAsAny[targetLanguage]; // Return the value for the target language
    } else {
      // Fallback to 'en' if target language not found
      return '';
    }
  }

  // If it's an array, process each item recursively
  if (Array.isArray(obj)) {
    return obj.map((item) => localizedObject(item, targetLanguage));
  }

  // Process each key in the object (for regular objects and nested structures)
  const newObj: { [key: string]: unknown } = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = objAsAny[key]; // Access value using objAsAny
      let newKey = key;

      // Handle properties like "nameEn" or "nameAr" (if you still want to support this format)
      // This part handles the older format, ensuring it also supports dynamic language codes
      const suffixMatch = key.match(/([A-Z][a-z]{1,2})$/); // e.g., 'En', 'Ar', 'Es' (up to 3 letters for common codes like 'Eng')

      if (suffixMatch) {
        const suffix = suffixMatch[1].toLowerCase(); // e.g., 'en', 'ar', 'es'
        const baseKey = key.slice(0, -suffix.length);

        if (suffix === targetLanguage) {
          newKey = baseKey; // Remove the suffix if it matches the target language
          newObj[newKey] = localizedObject(value, targetLanguage);
        } else {
          // If it's a language-specific key for a *different* language, skip it
          continue;
        }
      } else {
        // Recursively process nested objects/arrays/values for non-language-specific keys
        newObj[newKey] = localizedObject(value, targetLanguage);
      }
    }
  }

  return newObj;
}
