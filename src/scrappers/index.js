import { linkedinScrapper } from './linkedin';
import { twitterScrapper } from './twitter';
import { facebookScrapper } from './facebook';
import { genericScrapper } from './generic';

/**
 * Determines which scrapper to use based on the current URL.
 * @returns {Function} One of the platform specific scrappers or the generic one.
 */
export const getScrapper = (url) => {
    if (url.includes('linkedin.com/in/')) {
        return linkedinScrapper;
    } else if (url.includes('twitter.com') || url.includes('x.com')) {
        return twitterScrapper;
    } else if (url.includes('facebook.com')) {
        return facebookScrapper;
    } else {
        return genericScrapper;
    }
};
