import logging
from typing import List, Dict, Any, Set
from bs4 import BeautifulSoup
from playwright.async_api import Page
from parser import clean_text, is_deleted_comment
from utils import scroll_to_bottom

logger = logging.getLogger("reddit_scraper.comments")

def get_comment_text(comment_elem: BeautifulSoup) -> str:
    """
    Extracts text for the current shreddit-comment element only,
    ignoring texts of any nested child shreddit-comments.
    """
    # Look for the main text div which ends in -post-rtjson-content
    text_divs = comment_elem.find_all(
        lambda tag: tag.name == "div" and tag.get("id") and "-post-rtjson-content" in tag.get("id")
    )
    
    # Filter to only keep divs whose closest shreddit-comment ancestor is comment_elem
    my_text_divs = []
    for div in text_divs:
        parent = div.parent
        is_mine = False
        while parent:
            if parent.name == "shreddit-comment":
                if parent == comment_elem:
                    is_mine = True
                break
            parent = parent.parent
        if is_mine:
            my_text_divs.append(div)
            
    if my_text_divs:
        return " ".join([d.get_text(strip=True) for d in my_text_divs])
        
    # Fallback to checking paragraph tags if no post-rtjson-content div found
    p_tags = comment_elem.find_all("p")
    my_p_tags = []
    for p in p_tags:
        parent = p.parent
        is_mine = False
        while parent:
            if parent.name == "shreddit-comment":
                if parent == comment_elem:
                    is_mine = True
                break
            parent = parent.parent
        if is_mine:
            my_p_tags.append(p)
            
    if my_p_tags:
        return " ".join([p.get_text(strip=True) for p in my_p_tags])
        
    return ""

async def expand_and_extract_comments(
    page: Page,
    post_url: str,
    limit: int = 20
) -> List[Dict[str, Any]]:
    """
    Navigates to a post, expands its comments dynamically, and extracts up to `limit` comments.
    """
    logger.info(f"Opening post page to scrape comments: {post_url}")
    response = await page.goto(post_url)
    if not response or response.status != 200:
        status_code = response.status if response else "Unknown"
        logger.error(f"Failed to load post page. HTTP Status: {status_code}")
        return []
        
    # Wait for comments section to load
    try:
        await page.wait_for_selector("shreddit-comment", timeout=10000)
    except Exception:
        logger.warning("Timeout waiting for shreddit-comment selector. Post may have no comments or is locked.")
        # Proceed with whatever is in the DOM
        
    # Initial scroll to trigger lazy loading of comments
    await scroll_to_bottom(page, max_scrolls=2, delay_ms=1000)
    
    click_count = 0
    max_clicks = 15  # Safety limit to avoid infinite loops
    
    # We want to load until we have at least `limit` comments (non-deleted and non-duplicate) in the DOM,
    # or until no more expandable buttons are visible.
    while click_count < max_clicks:
        # Check current count of valid comments in DOM
        html = await page.content()
        soup = BeautifulSoup(html, "html.parser")
        dom_comments = soup.find_all("shreddit-comment")
        
        valid_in_dom = 0
        seen_thingids: Set[str] = set()
        
        for comment in dom_comments:
            thingid = comment.get("thingid", "")
            if not thingid or thingid in seen_thingids:
                continue
            seen_thingids.add(thingid)
            
            author = comment.get("author", "")
            raw_text = get_comment_text(comment)
            text = clean_text(raw_text)
            
            if not is_deleted_comment(author, text):
                valid_in_dom += 1
                
        logger.info(f"Currently {valid_in_dom} valid comments loaded in DOM.")
        if valid_in_dom >= limit:
            logger.info(f"Target of {limit} comments met. Stopping expansion.")
            break
            
        # Try to find one visible expansion button to click
        buttons = page.locator("button")
        btn_count = await buttons.count()
        target_button = None
        
        for i in range(btn_count):
            btn = buttons.nth(i)
            if await btn.is_visible():
                try:
                    text = await btn.inner_text()
                    text_lower = text.lower().strip()
                    # Check text matches common expand strings
                    expand_triggers = ["more replies", "view replies", "show replies", "continue this thread"]
                    if any(trigger in text_lower for trigger in expand_triggers):
                        # Filter out buttons that are loading
                        if "loading" not in text_lower:
                            target_button = btn
                            logger.info(f"Found expandable button: '{text.strip()}'")
                            break
                except Exception:
                    # Ignore buttons that vanish or error during inspection
                    continue
                    
        if not target_button:
            logger.info("No more expandable buttons found in DOM.")
            break
            
        # Click the button
        try:
            logger.info("Scrolling to and clicking expansion button...")
            await target_button.scroll_into_view_if_needed()
            await target_button.click(timeout=5000)
            click_count += 1
            # Wait for content to load
            await page.wait_for_timeout(1500)
        except Exception as e:
            logger.warning(f"Failed to click expansion button: {e}")
            break
            
    # Final extraction phase
    final_html = await page.content()
    final_soup = BeautifulSoup(final_html, "html.parser")
    final_comments = final_soup.find_all("shreddit-comment")
    
    extracted_comments: List[Dict[str, Any]] = []
    seen_ids: Set[str] = set()
    
    for comment in final_comments:
        thingid = comment.get("thingid", "")
        if not thingid:
            thingid = f"fallback_{len(seen_ids)}"
            
        if thingid in seen_ids:
            continue
        seen_ids.add(thingid)
        
        author = comment.get("author", "")
        score = comment.get("score")
        depth_val = comment.get("depth", "0")
        created = comment.get("created") or comment.get("timestamp")
        
        try:
            depth = int(depth_val)
        except ValueError:
            depth = 0
            
        raw_text = get_comment_text(comment)
        text = clean_text(raw_text)
        
        # Skip deleted or removed comments
        if is_deleted_comment(author, text):
            continue
            
        extracted_comments.append({
            "author": author,
            "text": text,
            "score": score,
            "depth": depth,
            "created": created
        })
        
        if len(extracted_comments) >= limit:
            break
            
    logger.info(f"Extracted {len(extracted_comments)} valid comments for post.")
    return extracted_comments
