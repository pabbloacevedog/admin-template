import { boot } from "quasar/wrappers";
import { createI18n } from "vue-i18n";
import messages from "src/i18n";

export default boot(({ app }) => {
    // Obtener el idioma del navegador
    const browserLanguage =
        navigator.language || navigator.languages[0] || "en-US";

    // Verificar si el idioma del navegador está en los mensajes definidos
    const availableLanguages = Object.keys(messages);
    const locale = availableLanguages.includes(browserLanguage)
        ? browserLanguage
        : "en-US"; // Idioma por defecto si no está soportado

    const i18n = createI18n({
        locale, // Usar el idioma detectado o el predeterminado
        globalInjection: true,
        messages,
    });

    // Configurar i18n en la aplicación
    app.use(i18n);
});
