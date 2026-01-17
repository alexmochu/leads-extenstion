/**
 * Utility functions for Sales Intelligence features.
 */

// Keyword mappings for auto-tagging
const TAG_RULES = [
    { label: 'Decision Maker', keywords: /founder|ceo|director|vp|president|owner|co-founder/i },
    { label: 'Recruiter', keywords: /recruiter|talent|hr|human resources|hiring/i },
    { label: 'Tech', keywords: /developer|engineer|software|cto|full stack|backend|frontend/i },
    { label: 'Sales', keywords: /sales|account executive|sdr|bdr|business development/i },
    { label: 'Marketing', keywords: /marketing|cmo|brand|growth|seo|content/i },
    { label: 'Real Estate', keywords: /real estate|realtor|broker|property/i },
];

/**
 * Analyzes text (title, bio) to generate smart tags.
 * @param {Object} lead - The lead object (must have title, possibly bio).
 * @returns {string} Comma-separated tags.
 */
export const generateTags = (lead) => {
    const text = `${lead.title || ''} ${lead.bio || ''} ${lead.headline || ''}`.toLowerCase();
    const tags = new Set();

    TAG_RULES.forEach(rule => {
        if (rule.keywords.test(text)) {
            tags.add(rule.label);
        }
    });

    return Array.from(tags).join(', ');
};

/**
 * Generates a cold outreach icebreaker.
 * @param {Object} lead 
 * @returns {string} The personalized message.
 */
export const generateIcebreaker = (lead) => {
    const name = lead.name ? lead.name.split(' ')[0] : 'there';
    const company = lead.company || 'your company';
    const title = lead.title || 'your role';

    // Simple template randomization could go here, but sticking to one solid one for now.
    return `Hi ${name}, I saw you're the ${title} at ${company}. Would love to connect and discuss how we can help achieve your goals this quarter.`;
};

/**
 * Checks if a lead already exists in the dataset.
 * Checks by URL (if available) or Name.
 * @param {Object} newLead 
 * @param {Array<Object>} existingLeads 
 * @returns {boolean} True if duplicate.
 */
export const checkDuplicate = (newLead, existingLeads) => {
    if (!existingLeads || existingLeads.length === 0) return false;

    return existingLeads.some(existing => {
        // Strict check on URL if both exist
        if (newLead.url && existing.url) {
            return newLead.url === existing.url;
        }
        // Fallback to name match
        if (newLead.name && existing.name) {
            return newLead.name.toLowerCase() === existing.name.toLowerCase();
        }
        return false;
    });
};
