import logging
from typing import List, Dict, Any
import httpx
from parser import clean_text, is_deleted_comment

logger = logging.getLogger("reddit_scraper.comments_json")

HEADERS = {
    "User-Agent": "python:reddit-review-analyzer:v1.0.0 (by /u/developer)",
    "Accept": "application/json"
}

def extract_comments_recursive(comments_list: List[Dict], limit: int, current_depth: int = 0) -> List[Dict[str, Any]]:
    """
    Recursively extracts comments from the Reddit JSON tree structure.
    """
    extracted = []
    
    for item in comments_list:
        if len(extracted) >= limit:
            break
            
        if item.get("kind") != "t1":
            # 'more' kind or something else, skip for basic parsing
            continue
            
        data = item.get("data", {})
        
        author = data.get("author", "")
        raw_text = data.get("body", "")
        score = data.get("score")
        created_utc = data.get("created_utc")
        
        text = clean_text(raw_text)
        
        if not is_deleted_comment(author, text):
            extracted.append({
                "author": author,
                "text": text,
                "score": score,
                "depth": current_depth,
                "created": str(created_utc) if created_utc else None
            })
            
        # Check for nested replies
        replies = data.get("replies")
        if replies and isinstance(replies, dict) and replies.get("kind") == "Listing":
            children = replies.get("data", {}).get("children", [])
            nested_limit = limit - len(extracted)
            if nested_limit > 0:
                nested_comments = extract_comments_recursive(children, nested_limit, current_depth + 1)
                extracted.extend(nested_comments)
                
    return extracted

async def expand_and_extract_comments_json(post_url: str, limit: int = 20) -> List[Dict[str, Any]]:
    """
    Fetches a post's comments via the Reddit native .json endpoint.
    """
    # Clean up the URL and append .json
    clean_url = post_url.split("?")[0].rstrip("/")
    json_url = f"{clean_url}.json"
    
    logger.info(f"Fetching comments JSON: {json_url}")
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(json_url, headers=HEADERS, timeout=15.0)
            
            if response.status_code != 200:
                logger.error(f"Failed to fetch comments JSON. HTTP Status: {response.status_code}")
                return []
                
            data = response.json()
            
            # Reddit post JSON structure is usually a list of 2 Listings: [Post, Comments]
            if not isinstance(data, list) or len(data) < 2:
                logger.warning("Unexpected JSON structure for comments. Expected a list of 2 items.")
                return []
                
            comments_listing = data[1].get("data", {}).get("children", [])
            extracted_comments = extract_comments_recursive(comments_listing, limit)
            
            logger.info(f"Extracted {len(extracted_comments)} valid comments for post via JSON.")
            return extracted_comments
            
    except Exception as e:
        logger.error(f"Error fetching or parsing comments JSON: {e}", exc_info=True)
        return []
