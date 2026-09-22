import logging
import urllib.parse
from typing import List, Dict, Any
import httpx
import asyncio

logger = logging.getLogger("reddit_scraper.search_json")

# Standard User-Agent to avoid immediate blocking from Reddit's API
HEADERS = {
    "User-Agent": "python:reddit-review-analyzer:v1.0.0 (by /u/developer)",
    "Accept": "application/json"
}

async def search_reddit_json(query: str, limit: int = 10) -> List[Dict[str, Any]]:
    """
    Performs search on Reddit using the native .json endpoint and collects up to `limit` posts.
    """
    encoded_query = urllib.parse.quote(query)
    search_url = f"https://www.reddit.com/search.json?q={encoded_query}&limit={limit}"
    
    logger.info(f"Fetching search JSON: {search_url}")
    
    scraped_posts: List[Dict[str, Any]] = []
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(search_url, headers=HEADERS, timeout=15.0)
            
            if response.status_code != 200:
                logger.error(f"Failed to fetch search JSON. HTTP Status: {response.status_code}")
                return []
                
            data = response.json()
            
            # The search endpoint returns a dict with 'data' -> 'children'
            children = data.get("data", {}).get("children", [])
            logger.info(f"Found {len(children)} posts in search JSON response.")
            
            for child in children:
                if len(scraped_posts) >= limit:
                    break
                    
                post_data = child.get("data", {})
                
                title = post_data.get("title")
                permalink = post_data.get("permalink")
                
                if not title or not permalink:
                    continue
                    
                url = f"https://www.reddit.com{permalink}"
                subreddit = post_data.get("subreddit")
                author = post_data.get("author")
                upvotes = post_data.get("score")
                comment_count = post_data.get("num_comments")
                
                scraped_posts.append({
                    "title": title,
                    "url": url,
                    "subreddit": subreddit,
                    "author": author,
                    "upvotes": upvotes,
                    "comment_count": comment_count,
                    "comments": []
                })
                
    except Exception as e:
        logger.error(f"Error fetching or parsing search JSON: {e}", exc_info=True)
        
    logger.info(f"Successfully extracted {len(scraped_posts)} posts from JSON.")
    return scraped_posts
