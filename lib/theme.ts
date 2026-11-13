export const THEME_KEY = "bukimade:theme";

/**
 * Sayfa boyanmadan önce <head> içinde çalışır: kayıtlı tercih yoksa sistem temasını izler.
 * Böylece açılışta tema "yanıp sönmez".
 */
export const themeScript = `(function(){try{var k="${THEME_KEY}",m=window.matchMedia("(prefers-color-scheme: dark)");function a(){var s=localStorage.getItem(k);document.documentElement.classList.toggle("dark",s?s==="dark":m.matches)}a();m.addEventListener("change",a)}catch(e){}})();`;
