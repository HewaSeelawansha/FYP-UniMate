// utils/listingNLP.js
const natural = require('natural');
const TfIdf = natural.TfIdf;
const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;

const stopwords = new Set([...natural.stopwords, 'in', 'at', 'on', 'of', 'the']);

const preprocessText = (text) => {
  if (!text) return '';
  let processed = text.toLowerCase().replace(/'/g, '');
  processed = processed.replace(/[^\w\s]/gi, '');
  const tokens = tokenizer.tokenize(processed) || [];
  return tokens
    .filter(token => !stopwords.has(token) && token.length > 2)
    .map(token => stemmer.stem(token))
    .join(' ');
};

const createSearchIndex = (listings) => {
  const tfidf = new TfIdf();
  
  listings.forEach(listing => {
    const fields = [
      listing.name,
      listing.description,
      listing.type,
      listing.boardingID?.name || '',
      listing.boardingID?.address || '',
      listing.boardingID?.description || '',
      ...(listing.amenities || []),
      ...(listing.boardingID?.amenities || [])
    ].filter(Boolean).join(' ');
    
    const processed = preprocessText(fields);
    if (processed) tfidf.addDocument(processed);
  });
  
  return tfidf;
};

const getSimilarListings = (targetListing, allListings, tfidf, count = 5) => {
  const targetFields = [
    targetListing.name,
    targetListing.description,
    targetListing.type,
    targetListing.boardingID?.name || '',
    targetListing.boardingID?.address || '',
    targetListing.boardingID?.description || '',
    ...(targetListing.amenities || []),
    ...(targetListing.boardingID?.amenities || [])
  ].filter(Boolean).join(' ');
  
  const processedTarget = preprocessText(targetFields);
  const scores = [];
  
  tfidf.tfidfs(processedTarget, (i, measure) => {
    if (!targetListing._id.equals(allListings[i]?._id)) {
      scores.push({ listing: allListings[i], score: measure });
    }
  });
  
  return scores
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(item => item.listing);
};

module.exports = {
  preprocessText,
  createSearchIndex,
  getSimilarListings
};