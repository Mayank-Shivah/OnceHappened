import { useContext, useEffect, useState } from "react";
import { LanguageContext } from "../context/LanguageContext";
import { translateText } from "../services/translationService";

export function useTranslate(text) {
  const { language } = useContext(LanguageContext);
  const [translated, setTranslated] = useState(text);

  useEffect(() => {
    if (language === "en") setTranslated(text);
    else {
      translateText(text, language).then(setTranslated);
    }
  }, [language, text]);

  return translated;
}
