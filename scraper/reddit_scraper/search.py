import logging
import urllib.parse
from typing import List, Dict, Any
from bs4 import BeautifulSoup
# pyrefly: ignore [missing-import]
from playwright.async_api import Page
from posts import parse_post_unit
from utils import scroll_to_bottom

logger = logging.getLogger("reddit_scraper.search")

async def search_reddit(page: Page, query: str, limit: int = 10) -> List[Dict[str, Any]]:
    """
    Performs search on Reddit for the given query and collects up to `limit` posts.
    """
    encoded_query = urllib.parse.quote(query)
    search_url = f"https://www.reddit.com/search/?q={encoded_query}"
    
    logger.info(f"Navigating to search page: {search_url}")
    response = await page.goto(search_url)
    
    if not response or response.status != 200:
        status_code = response.status if response else "Unknown"
        logger.error(f"Failed to load search page. HTTP Status: {status_code}")
        return []
        
    # Wait for the search results container or post units to load
    try:
        await page.wait_for_selector('div[data-testid="search-post-unit"]', timeout=10000)
    except Exception:
        logger.warning("Timeout waiting for search post unit selector. The search results may be empty or layout changed.")
        # Proceed anyway to try parsing whatever is in the DOM
        
    # Scroll a couple of times to load more items if needed
    await scroll_to_bottom(page, max_scrolls=2, delay_ms=1000)
    
    # Get HTML content and parse with BeautifulSoup
    html = await page.content()
    soup = BeautifulSoup(html, "html.parser")
    
    post_units = soup.find_all(attrs={"data-testid": "search-post-unit"})
    logger.info(f"Found {len(post_units)} post units in the search page DOM.")
    
    scraped_posts: List[Dict[str, Any]] = []
    for unit in post_units:
        if len(scraped_posts) >= limit:
            break
            
        parsed = parse_post_unit(unit)
        if parsed:
            scraped_posts.append(parsed)
            
    logger.info(f"Successfully parsed {len(scraped_posts)} posts from search results.")
    return scraped_posts
