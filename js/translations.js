const translations = {
  cs: {
    navHome: "Úvod",
    navAbout: "O nás",
    navServices: "Služby",
    navProjects: "Zakázky",
    navReferences: "Reference",
    navContact: "Kontakt",
    navCta: "Nezávazná poptávka"
  },

  en: {
    navHome: "Home",
    navAbout: "About us",
    navServices: "Services",
    navProjects: "Projects",
    navReferences: "References",
    navContact: "Contact",
    navCta: "Request a quote"
  },

  de: {
    navHome: "Startseite",
    navAbout: "Über uns",
    navServices: "Leistungen",
    navProjects: "Projekte",
    navReferences: "Referenzen",
    navContact: "Kontakt",
    navCta: "Unverbindliche Anfrage"
  }
};


// Přepínání jazyka
document.addEventListener("DOMContentLoaded", () => {
  const languageButtons = document.querySelectorAll("[data-lang]");

  languageButtons.forEach(button => {
    button.addEventListener("click", () => {
      const language = button.dataset.lang;

      console.log("Přepínám jazyk na:", language);

      localStorage.setItem("language", language);
    });
  });
});
