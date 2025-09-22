// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Define your translations here in a simple object.
const resources = {
  en: {
    translation: {
      "greeting": "Hello, welcome to our site!",
      "about_us": "About Us",
      "contact": "Contact",
      "switch_lang": "Switch to Spanish"
    }
  },
  es: {
    translation: {
      "greeting": "¡Hola, bienvenido a nuestro sitio!",
      "about_us": "Sobre Nosotros",
      "contact": "Contacto",
      "switch_lang": "Cambiar a Inglés"
    }
  }
};

i18n
  .use(initReactI18next) // passes i18n to react-i18next
  .init({
    resources, // provide the translation content
    lng: "en", // set the default language
    fallbackLng: "en", // fallback language if translation is missing
    interpolation: {
      escapeValue: false // React already handles escaping
    }
  });

export default i18n;