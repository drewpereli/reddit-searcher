import fetch from 'fetch';

async function fetchSubredditListings(subredditName) {
  let response = await fetch(`https://www.reddit.com/r/${subredditName}/new.json?limit=100`);
  let json = await response.json();
  let listings = json.data.children.map((c) => c.data);
  return listings;
}

function filterSubredditListings(listings, { minAgeMinutes, maxAgeMinutes, maxComments }) {
  return listings.filter((listing) => {
    if (listing.distinguished === 'moderator') {
      return false;
    }

    if (listing.num_comments > maxComments) {
      return false;
    }

    let ageMinutes = getListingAgeMinutes(listing);

    if (ageMinutes < minAgeMinutes || ageMinutes > maxAgeMinutes) {
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
    let { id, subreddit, title, permalink, created_utc, num_comments } = listing;
    let createdAt = created_utc * 1000;
    let ageMinutes = getListingAgeMinutes(listing);
    return {
      id,
      subreddit,
      title,
      url: `https://reddit.com${permalink}`,
      createdAt,
      ageMinutes,
      numComments: num_comments,
    };
  });
}

export async function getPosts(paramsList) {
  let fetchListingPromises = [];

  for (let subredditParams of paramsList) {
    let promise = fetchSubredditListings(subredditParams.subredditName).then((listings) => {
      return filterSubredditListings(listings, subredditParams);
    });
    fetchListingPromises.push(promise);
  }

  let listingGroups = await Promise.all(fetchListingPromises);

  let listings = listingGroups.reduce((all, listing) => all.concat(listing), []);

  let formatted = formatListings(listings);

  formatted.sort((a, b) => b.ageMinutes - a.ageMinutes);

  return formatted;
}

export async function subredditExists(subredditName) {
  try {
    let response = await fetch(`https://www.reddit.com/r/${subredditName}/new.json`);
    return response.ok;
  } catch (error) {
    return false;
  }
}
