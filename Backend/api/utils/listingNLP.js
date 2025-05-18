const natural = require('natural');
const TfIdf = natural.TfIdf;
const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;

const stopwords = new Set([...natural.stopwords, 'in', 'at', 'on', 'of', 'the']);

const preprocessText = (text) => {
    if (!text) return '';
    let processed = text.toLowerCase()
      .replace(/'/g, '')       // Remove apostrophes
      .replace(/\b's\b/g, '')  // Remove possessive 's
      .replace(/[^\w\s]/gi, ' '); // Replace other special chars with space
    
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

// Originally, search functionality likely relied on MongoDB’s basic text matching—queries using regex or $text operators. 
// While this works for basic keyword searches, it falls short when it comes to understanding relevance, partial matches, 
// or ranking listings by how well they match the query.

// To fix that, you integrated Natural Language Processing (NLP) using the natural library in Node.js. This lets you:

// Preprocess listings and search queries (remove stopwords, lowercase, stem words).

// Compute TF-IDF (Term Frequency-Inverse Document Frequency) scores to measure how relevant each listing is to the search terms.

// Score and rank results not just on keyword matches, but on how "important" those matches are in context.

// Provide smarter search results, more like what users expect from platforms like Google or Amazon.

// 🚀 In short: NLP was added to move from simple "does this word exist?" searching to "how well does this listing match the meaning of the search?" 
// — enabling more relevant, intelligent, and user-friendly search results.