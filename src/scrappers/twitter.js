/**
 * Scrapper for X (formerly Twitter) Profiles.
 */
export const twitterScrapper = () => {
    // X uses react-native-web styles, classes are obfuscated (css-1dbjc4n etc).
    // We often rely on finding unique text structures or aria-labels.

    // Name usually in a span with heavy font weight inside the primary column
    // This is fragile.
    const titleElements = document.title.split(' / '); // "Name (@handle) / X"
    let name = 'Unknown';
    let handle = 'Unknown';

    if (titleElements.length > 0) {
        const namePart = titleElements[0];
        const match = namePart.match(/(.+) \((@.+)\)/);
        if (match) {
            name = match[1];
            handle = match[2];
        } else {
            name = namePart;
        }
    }

    // Bio
    const bioElement = document.querySelector('[data-testid="UserDescription"]');
    const bio = bioElement ? bioElement.innerText : '';

    // Location
    const locationElement = document.querySelector('[data-testid="UserLocation"]');
    const location = locationElement ? locationElement.innerText : '';

    // Website in bio
    const urlElement = document.querySelector('[data-testid="UserUrl"]');
    const website = urlElement ? urlElement.innerText : '';

    return {
        platform: 'X (Twitter)',
        name,
        handle,
        bio,
        location,
        website,
        url: window.location.href,
        scrappedAt: new Date().toISOString()
    };
};
