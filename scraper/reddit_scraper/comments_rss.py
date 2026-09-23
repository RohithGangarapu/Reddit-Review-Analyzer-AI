import logging
from typing import List, Dict, Any
import httpx
import feedparser
from bs4 import BeautifulSoup
import asyncio
import asyncio
from utils import get_random_headers
from parser import clean_text, is_deleted_comment

logger = logging.getLogger("reddit_scraper.comments_rss")



async def expand_and_extract_comments_rss(post_url: str, limit: int = 20) -> List[Dict[str, Any]]:
    """
    Fetches a post's comments via the Reddit native .rss endpoint.
    """
    # Clean up the URL and append .rss
    clean_url = post_url.split("?")[0].rstrip("/")
    # Generate a feed token to bypass cache/limits
    import time
    import random
    feed_token = f"feed_{int(time.time())}_{random.randint(1000, 9999)}"
    user_token = f"user_{random.randint(10000, 99999)}"
    rss_url = f"{clean_url}/.rss?feed={feed_token}&user={user_token}"
    
    logger.info(f"Fetching comments RSS: {rss_url}")
    
    try:
        async with httpx.AsyncClient() as client:
            max_retries = 3
            response = None
            
            for attempt in range(max_retries):
                response = await client.get(rss_url, headers=get_random_headers(), timeout=15.0)
                
                if response.status_code == 429:
                    if attempt < max_retries - 1:
                        sleep_time = 4 * (attempt + 1)
                        logger.warning(f"429 Too Many Requests. Sleeping {sleep_time}s before retry...")
                        await asyncio.sleep(sleep_time)
                        continue
                    else:
                        logger.error(f"Failed to fetch comments RSS after {max_retries} attempts. HTTP Status: 429")
                        return []
                elif response.status_code != 200:
                    logger.error(f"Failed to fetch comments RSS. HTTP Status: {response.status_code}")
                    return []
                else:
                    break
            
            if not response or response.status_code != 200:
                return []
                
            feed = feedparser.parse(response.content)
            extracted_comments = []
            
            # In Reddit comments RSS, the first entry is usually the original post itself.
            # The remaining entries are top-level comments.
            entries = feed.entries[1:] if len(feed.entries) > 1 else []
            
            for entry in entries:
                if len(extracted_comments) >= limit:
                    break
                    
                author = entry.author if 'author' in entry else ""
                if author.startswith("/u/"):
                    author = author[3:]
                    
                raw_html = entry.summary if 'summary' in entry else ""
                soup = BeautifulSoup(raw_html, "html.parser")
                raw_text = soup.get_text(separator=" ", strip=True)
                
                text = clean_text(raw_text)
                
                if not is_deleted_comment(author, text):
                    extracted_comments.append({
                        "author": author,
                        "text": text,
                        "score": 0, # Score is not reliably exposed in RSS
                        "depth": 0, # RSS only gives us a flat list of top-level comments mostly
                        "created": entry.updated if 'updated' in entry else None
                    })
            
            logger.info(f"Extracted {len(extracted_comments)} valid comments for post via RSS.")
            return extracted_comments
            
    except Exception as e:
        logger.error(f"Error fetching or parsing comments RSS: {e}", exc_info=True)
        return []
