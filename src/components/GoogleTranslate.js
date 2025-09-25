import { useEffect } from "react";

export default function GoogleTranslate() {
  useEffect(() => {
    // ✅ Add the Google Translate script dynamically
    const addScript = document.createElement("script");
    addScript.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    addScript.async = true;
    document.body.appendChild(addScript);

    // ✅ Define init function globally so Google can call it
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "fr,hi,es,de,en", // Languages you want
        },
        "google_translate_element"
      );
    };

    return () => {
      // Cleanup if component unmounts
      if (document.body.contains(addScript)) {
        document.body.removeChild(addScript);
      }
    };
  }, []);

  return <div id="google_translate_element"></div>;
}
