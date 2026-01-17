/**
 * Scrapper for LinkedIn Profiles.
 * Note: LinkedIn DOM changes frequently. Selectors may need maintenance.
 */
export const linkedinScrapper = () => {
    // Attempt to find the name
    const name = document.querySelector('h1.text-heading-xlarge')?.innerText ||
        document.querySelector('.pv-text-details__left-panel h1')?.innerText ||
        'Unknown Name';

    // Attempt to find the job title / headline
    const headline = document.querySelector('.text-body-medium.break-words')?.innerText || '';

    // Attempt to find location
    const location = document.querySelector('.text-body-small.inline.t-black--light.break-words')?.innerText || '';

    // URL
    const url = window.location.href;

    return {
        platform: 'LinkedIn',
        name,
        title: headline,
        location,
        url,
        scrappedAt: new Date().toISOString()
    };
};
