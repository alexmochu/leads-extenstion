/**
 * Scrapper for Facebook Profiles.
 */
export const facebookScrapper = () => {
    // Facebook is also difficult due to obfuscated classes.
    // We rely on simple document structure or meta tags if available.

    let name = document.querySelector('h1')?.innerText || '';
    if (!name) {
        // fallback: title
        name = document.title;
    }

    return {
        platform: 'Facebook',
        name,
        url: window.location.href,
        scrappedAt: new Date().toISOString()
    };
};
