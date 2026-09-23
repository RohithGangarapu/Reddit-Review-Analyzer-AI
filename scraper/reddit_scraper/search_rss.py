import logging
import urllib.parse
from typing import List, Dict, Any
import httpx
import feedparser
from bs4 import BeautifulSoup
from utils import get_random_headers

logger = logging.getLogger("reddit_scraper.search_rss")



async def search_reddit_rss(query: str, limit: int = 10) -> List[Dict[str, Any]]:
    """
    Performs search on Reddit using the native .rss endpoint and collects up to `limit` posts.
    """
    encoded_query = urllib.parse.quote(query)
    search_url = f"https://www.reddit.com/search.rss?q={encoded_query}&limit={limit}"
    
    logger.info(f"Fetching search RSS: {search_url}")
    
    scraped_posts: List[Dict[str, Any]] = []
    
    try:
        async with httpx.AsyncClient() as client:
            # Generate a random feed token to bypass aggressive caching limits
            import time
            import random
            feed_token = f"feed_{int(time.time())}_{random.randint(1000, 9999)}"
            user_token = f"user_{random.randint(10000, 99999)}"
            bypassed_url = f"{search_url}&feed={feed_token}&user={user_token}"
            
            response = await client.get(bypassed_url, headers=get_random_headers(), timeout=15.0)
            
            if response.status_code != 200:
                logger.error(f"Failed to fetch search RSS. HTTP Status: {response.status_code}")
                return []
                
            feed = feedparser.parse(response.content)
            logger.info(f"Found {len(feed.entries)} posts in search RSS response.")
            
            for entry in feed.entries:
                if len(scraped_posts) >= limit:
                    break
                    
                title = entry.title
                url = entry.link
                
                if not title or not url:
                    continue
                
                author_name = entry.author if 'author' in entry else "N/A"
                if author_name.startswith("/u/"):
                    author_name = author_name[3:]
                    
                # Subreddit usually in tags/categories
                subreddit = "unknown"
                if 'tags' in entry and len(entry.tags) > 0:
                    subreddit = entry.tags[0].term
                
                # Content in RSS is usually HTML, we want plain text for RAG
                body = ""
                if 'summary' in entry:
                    soup = BeautifulSoup(entry.summary, "html.parser")
                    body = soup.get_text(separator=" ", strip=True)
                
                scraped_posts.append({
                    "title": title,
                    "url": url,
                    "subreddit": subreddit,
                    "author": author_name,
                    "upvotes": 0, # RSS doesn't reliably expose score
                    "comment_count": 0, # RSS doesn't reliably expose comment count
                    "comments": []
                })
                
    except Exception as e:
        logger.error(f"Error fetching or parsing search RSS: {e}", exc_info=True)
        
    logger.info(f"Successfully extracted {len(scraped_posts)} posts from RSS.")
    return scraped_posts
