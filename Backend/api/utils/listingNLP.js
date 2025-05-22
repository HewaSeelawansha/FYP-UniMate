const natural = require("natural");
const TfIdf = natural.TfIdf;
const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;

const stopwords = new Set([
  ...natural.stopwords,
  "in",
  "at",
  "on",
  "of",
  "the",
  "with",
]);

const preprocessText = (text) => {
  if (!text) return "";
  let processed = text
    .toLowerCase()
    .replace(/'/g, "") 
    .replace(/\b's\b/g, "") 
    .replace(/[^\w\s]/gi, " "); 

  const tokens = tokenizer.tokenize(processed) || [];
  return tokens
    .filter((token) => !stopwords.has(token) && token.length > 2)
    .map((token) => stemmer.stem(token))
    .join(" ");
};

const createSearchIndex = (listings) => {
  const tfidf = new TfIdf();

  listings.forEach((listing) => {
    const fields = [
      listing.name,
      listing.description,
      listing.type,
      listing.boardingID?.name || "",
      listing.boardingID?.address || "",
      listing.boardingID?.description || "",
      ...(listing.amenities || []),
      ...(listing.boardingID?.amenities || []),
    ]
      .filter(Boolean)
      .join(" ");

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
    targetListing.boardingID?.name || "",
    targetListing.boardingID?.address || "",
    targetListing.boardingID?.description || "",
    ...(targetListing.amenities || []),
    ...(targetListing.boardingID?.amenities || []),
  ]
    .filter(Boolean)
    .join(" ");

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
    .map((item) => item.listing);
};

const analyzeReviewSentiment = (text) => {
  const positiveWords = new Set([
    "good",
    "great",
    "excellent",
    "happy",
    "clean",
    "comfortable",
    "affordable",
    "friendly",
    "love",
    "recommend",
    "nice",
    "quiet",
    "safe",
    "spacious",
  ]);

  const negativeWords = new Set([
    "bad",
    "poor",
    "dirty",
    "expensive",
    "noisy",
    "worst",
    "avoid",
    "terrible",
    "broken",
    "issues",
    "uncomfortable",
    "unsafe",
    "small",
    "rat",
  ]);

  const tokens = preprocessText(text).split(" ");
  let score = 0;

  tokens.forEach((token, i) => {
    if (token === "not" && i < tokens.length - 1) {
      const nextToken = tokens[i + 1];
      if (positiveWords.has(nextToken)) score -= 2;
      if (negativeWords.has(nextToken)) score += 2;
      return; 
    }
  });

  tokens.forEach((token) => {
    if (positiveWords.has(token)) score += 1;
    if (negativeWords.has(token)) score -= 1;
  });

  let sentiment;
  if (score > 0) sentiment = "positive";
  else if (score < 0) sentiment = "negative";
  else sentiment = "neutral";

  return { score, sentiment };
};

module.exports = {
  preprocessText,
  createSearchIndex,
  getSimilarListings,
  analyzeReviewSentiment, 
};

