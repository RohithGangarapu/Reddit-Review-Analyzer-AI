import json
import re
import logging
from typing import Optional, Any
from bs4 import BeautifulSoup

logger = logging.getLogger("reddit_scraper.posts")

def parse_post_unit(unit: BeautifulSoup) -> Optional[dict[str, Any]]:
    """
    Parses a single search post unit (data-testid="search-post-unit") from Reddit search page.
    Returns a dictionary of post metadata or None if essential fields are missing.
    """
    try:
        # 1. Try to find the title and URL
        title_a = unit.find("a", attrs={"data-testid": "post-title-text"})
        if not title_a:
            # Fallback to post-title data attribute
            title_a = unit.find("a", attrs={"data-testid": "post-title"})
            
        if not title_a:
            logger.warning("Could not find post title anchor tag, skipping post unit.")
            return None
            
        title = title_a.get_text(" ", strip=True)
        # Ensure duplicate spaces are cleaned from title too
        title = re.sub(r"\s+", " ", title).strip()
        
        url = title_a.get("href")
        if not url:
            logger.warning("Could not find post URL, skipping post unit.")
            return None
            
        if url.startswith("/"):
            url = "https://www.reddit.com" + url
            
        # 2. Extract values from telemetry context as primary/fallback source
        author = None
        subreddit = None
        
        telemetry = unit.find("search-telemetry-tracker")
        if telemetry and telemetry.get("data-faceplate-tracking-context"):
            try:
                ctx = json.loads(telemetry["data-faceplate-tracking-context"])
                if "post" in ctx and not title:
                    title = ctx["post"].get("title")
                if "profile" in ctx:
                    author = ctx["profile"].get("name")
                if "subreddit" in ctx:
                    subreddit = ctx["subreddit"].get("name")
            except Exception as e:
                logger.debug(f"Error parsing telemetry JSON: {e}")
                
        # 3. Fallbacks if telemetry was missing or incomplete
        if not subreddit:
            # Find subreddits like /r/laptops/
            sub_a = unit.find("a", href=re.compile(r"^/r/[^/]+/$"))
            if sub_a:
                subreddit = sub_a.get_text(strip=True).replace("r/", "").strip()
            else:
                # Deduce from URL
                match = re.search(r"/r/([^/]+)/comments/", url)
                if match:
                    subreddit = match.group(1)
                else:
                    subreddit = "unknown"
                    
        # 4. Extract Votes and Comments count from search counter row
        upvotes = None
        comment_count = None
        counter_row = unit.find(attrs={"data-testid": "search-counter-row"})
        if counter_row:
            spans = counter_row.find_all("span")
            for span in spans:
                text = span.get_text(strip=True).lower()
                num_tag = span.find("faceplate-number")
                num_val = num_tag.get("number") if num_tag else None
                if not num_val:
                    # Fallback to extracting digits
                    match = re.search(r"(\d+k?\.?\d*)\s*(vote|comment)", text)
                    if match:
                        num_val = match.group(1)
                
                if "vote" in text:
                    upvotes = num_val
                elif "comment" in text:
                    comment_count = num_val
                    
        return {
            "title": title,
            "url": url,
            "subreddit": subreddit,
            "author": author,
            "upvotes": upvotes,
            "comment_count": comment_count,
            "comments": []
        }
    except Exception as e:
        logger.error(f"Error parsing post unit: {e}", exc_info=True)
        return None
