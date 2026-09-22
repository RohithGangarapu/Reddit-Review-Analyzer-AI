import argparse
import asyncio
import json
import logging
import sys
from pathlib import Path
# pyrefly: ignore [missing-import]
from playwright.async_api import async_playwright
from models import ScraperResult, PostModel, CommentModel
from search import search_reddit
from comments import expand_and_extract_comments
from search_json import search_reddit_json
from comments_json import expand_and_extract_comments_json
from utils import create_scraper_context

# Configure logging to output to stdout with timestamps
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger("reddit_scraper.main")

async def run_scraper(
    query: str,
    posts_limit: int,
    comments_limit: int,
    output_file: str,
    headless: bool,
    method: str = "json"
) -> None:
    logger.info(f"Starting Reddit scraper for query: '{query}' using method '{method}'")
    
    posts_metadata = []
    
    # 1. Search Reddit for query based on selected method
    if method == "playwright":
        async with async_playwright() as p:
            browser, context = await create_scraper_context(p, headless=headless)
            page = await context.new_page()
            
            from playwright_stealth import Stealth
            stealth = Stealth()
            await stealth.apply_stealth_async(page)
            
            try:
                logger.info("Executing Reddit search via Playwright...")
                posts_metadata = await search_reddit(page, query, limit=posts_limit)
                
                if not posts_metadata:
                    logger.warning("No search results found or query was blocked. Exiting.")
                    return _write_empty_result(query, output_file)
                    
                scraped_posts_models = []
                for idx, post_data in enumerate(posts_metadata):
                    post_url = post_data["url"]
                    logger.info(f"[{idx+1}/{len(posts_metadata)}] Processing post: '{post_data['title']}' ({post_url})")
                    
                    try:
                        comments_data = await expand_and_extract_comments(page, post_url, limit=comments_limit)
                        comments_models = [CommentModel(**c) for c in comments_data]
                        post_model = PostModel(
                            title=post_data["title"], url=post_data["url"], subreddit=post_data["subreddit"],
                            author=post_data["author"], upvotes=post_data["upvotes"], comment_count=post_data["comment_count"],
                            comments=comments_models
                        )
                        scraped_posts_models.append(post_model)
                    except Exception as e:
                        logger.error(f"Error scraping post at {post_url}: {e}", exc_info=True)
                        post_model = PostModel(
                            title=post_data["title"], url=post_data["url"], subreddit=post_data["subreddit"],
                            author=post_data["author"], upvotes=post_data["upvotes"], comment_count=post_data["comment_count"],
                            comments=[]
                        )
                        scraped_posts_models.append(post_model)
                        
                _write_final_result(query, scraped_posts_models, output_file)
                
            finally:
                logger.info("Cleaning up browser context...")
                await context.close()
                await browser.close()
                logger.info("Browser closed cleanly.")
                
    elif method == "json":
        try:
            logger.info("Executing Reddit search via JSON API...")
            posts_metadata = await search_reddit_json(query, limit=posts_limit)
            
            if not posts_metadata:
                logger.warning("No search results found. Exiting.")
                return _write_empty_result(query, output_file)
                
            scraped_posts_models = []
            for idx, post_data in enumerate(posts_metadata):
                post_url = post_data["url"]
                logger.info(f"[{idx+1}/{len(posts_metadata)}] Processing post: '{post_data['title']}' ({post_url})")
                
                try:
                    comments_data = await expand_and_extract_comments_json(post_url, limit=comments_limit)
                    comments_models = [CommentModel(**c) for c in comments_data]
                    post_model = PostModel(
                        title=post_data["title"], url=post_data["url"], subreddit=post_data["subreddit"],
                        author=post_data["author"], upvotes=post_data["upvotes"], comment_count=post_data["comment_count"],
                        comments=comments_models
                    )
                    scraped_posts_models.append(post_model)
                except Exception as e:
                    logger.error(f"Error scraping post at {post_url}: {e}", exc_info=True)
                    post_model = PostModel(
                        title=post_data["title"], url=post_data["url"], subreddit=post_data["subreddit"],
                        author=post_data["author"], upvotes=post_data["upvotes"], comment_count=post_data["comment_count"],
                        comments=[]
                    )
                    scraped_posts_models.append(post_model)
                    
            _write_final_result(query, scraped_posts_models, output_file)
            
        except Exception as e:
            logger.error(f"Fatal error during JSON scraping: {e}", exc_info=True)

def _write_empty_result(query: str, output_file: str) -> None:
    result = ScraperResult(query=query, posts=[])
    with open(output_file, "w", encoding="utf-8") as f:
        f.write(result.model_dump_json(indent=4))

def _write_final_result(query: str, scraped_posts_models: list, output_file: str) -> None:
    result = ScraperResult(query=query, posts=scraped_posts_models)
    output_path = Path(output_file)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(result.model_dump_json(indent=4))
    logger.info(f"Scraping completed. Results saved to: {output_path.resolve()}")

def main() -> None:
    parser = argparse.ArgumentParser(description="Reddit scraper supporting Playwright and JSON methods.")
    parser.add_argument("query", type=str, help="Search query string.")
    parser.add_argument(
        "--posts-limit", type=int, default=10, help="Number of discussion posts to collect (default: 10)."
    )
    parser.add_argument(
        "--comments-limit", type=int, default=20, help="Number of comments to collect per post (default: 20)."
    )
    parser.add_argument(
        "--output", type=str, default="output.json", help="Path to save the JSON output file (default: output.json)."
    )
    parser.add_argument(
        "--headful", action="store_true", help="Run browser in headful mode (Playwright only)."
    )
    parser.add_argument(
        "--method", type=str, choices=["playwright", "json"], default="json",
        help="Scraping method to use: 'json' (bypasses blocks, fast) or 'playwright' (simulates real browser). Default is 'json'."
    )
    
    args = parser.parse_args()
    
    asyncio.run(
        run_scraper(
            query=args.query,
            posts_limit=args.posts_limit,
            comments_limit=args.comments_limit,
            output_file=args.output,
            headless=not args.headful,
            method=args.method
        )
    )

if __name__ == "__main__":
    main()
