import ENV from 'reddit-searcher/config/environment';
import fetch from 'fetch';

class SubredditParams {
  constructor(schema) {
    let defaults = {
      minAgeMinutes: 60,
      maxComments: 1,
    };

    Object.assign(this, defaults, schema);
  }
}

const SUBREDDIT_PARAMS_LIST = ENV.subredditParams.map((schema) => new SubredditParams(schema));

async function fetchSubredditListings(subredditName) {
  let response = await fetch(`https://www.reddit.com/r/${subredditName}/new.json?limit=100`);
  let json = await response.json();
  let listings = json.data.children.map((c) => c.data);
  return listings;
}

function filterSubredditListings({ listings, minAgeMinutes, maxComments }) {
  return listings.filter((listing) => {
    if (listing.distinguished === 'moderator') {
      return false;
    }

    if (listing.num_comments > maxComments) {
      return false;
    }

    if (getListingAgeMinutes({ listing }) < minAgeMinutes) {
      return false;
    }

    return true;
  });
}

function getListingAgeMinutes(listing) {
  let createdAt = listing.created_utc * 1000;
  let ageMs = Date.now() - createdAt;
  let ageMinutes = Math.round(ageMs / 1000 / 60);
  return ageMinutes;
}

function formatListings(listings) {
  return listings.map((listing) => {
    let { subreddit, title, permalink, created_utc, num_comments } = listing;
    let createdAt = created_utc * 1000;
    let ageMinutes = getListingAgeMinutes(listing);
    return {
      subreddit,
      title,
      url: `https://reddit.com${permalink}`,
      createdAt,
      ageMinutes,
      numComments: num_comments,
    };
  });
}

async function getPosts() {
  let fetchListingPromises = [];

  for (let subreddit of SUBREDDIT_PARAMS_LIST) {
    let { subredditName, minAgeMinutes, maxComments } = subreddit;
    let promise = fetchSubredditListings(subredditName).then((listings) => {
      return filterSubredditListings({ listings, minAgeMinutes, maxComments });
    });
    fetchListingPromises.push(promise);
  }

  let listingGroups = await Promise.all(fetchListingPromises);

  let listings = listingGroups.reduce((all, listing) => all.concat(listing), []);

  let formatted = formatListings(listings);

  formatted.sort((a, b) => a.ageMinutes - b.ageMinutes);

  return formatted;
}

export default getPosts;
