/**
 * Generic scrapper to find contact info on any page.
 */
export const genericScrapper = () => {
    const bodyText = document.body.innerText;

    // Simple regex for emails
    const emailRegex = /[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}/g;
    const emails = [...new Set(bodyText.match(emailRegex) || [])];

    // Simple regex for phone numbers (very basic, can be improved)
    // Matches patterns like +1-555-555-5555, (555) 555-5555, etc.
    const phoneRegex = /(\+\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}/g;
    const phones = [...new Set(bodyText.match(phoneRegex) || [])];

    return {
        platform: 'Generic',
        name: document.title,
        url: window.location.href,
        emails: emails.join(', '),
        phones: phones.join(', '),
        scrappedAt: new Date().toISOString()
    };
};
