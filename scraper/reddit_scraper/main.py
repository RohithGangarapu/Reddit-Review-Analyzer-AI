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
    headless: bool
) -> None:
    logger.info(f"Starting Reddit scraper for query: '{query}'")
    
    async with async_playwright() as p:
        browser, context = await create_scraper_context(p, headless=headless)
        page = await context.new_page()
        
        try:
            # 1. Search Reddit for query
            logger.info("Executing Reddit search...")
            posts_metadata = await search_reddit(page, query, limit=posts_limit)
            
            if not posts_metadata:
                logger.warning("No search results found or query was blocked. Exiting.")
                # Write empty result
                result = ScraperResult(query=query, posts=[])
                with open(output_file, "w", encoding="utf-8") as f:
                    f.write(result.model_dump_json(indent=4))
                return
                
            # 2. Iterate through each post to collect comments
            scraped_posts_models = []
            
            for idx, post_data in enumerate(posts_metadata):
                post_url = post_data["url"]
                logger.info(f"[{idx+1}/{len(posts_metadata)}] Processing post: '{post_data['title']}' ({post_url})")
                
                try:
                    # Collect comments
                    comments_data = await expand_and_extract_comments(
                        page, post_url, limit=comments_limit
                    )
                    
                    # Convert raw comments to CommentModels
                    comments_models = [CommentModel(**c) for c in comments_data]
                    
                    # Create PostModel
                    post_model = PostModel(
                        title=post_data["title"],
                        url=post_data["url"],
                        subreddit=post_data["subreddit"],
                        author=post_data["author"],
                        upvotes=post_data["upvotes"],
                        comment_count=post_data["comment_count"],
                        comments=comments_models
                    )
                    scraped_posts_models.append(post_model)
                    
                except Exception as e:
                    # Skip post on failure, logging the issue but continuing
                    logger.error(f"Error scraping post at {post_url}: {e}", exc_info=True)
                    # Append post metadata with empty comments on failure so metadata is preserved
                    post_model = PostModel(
                        title=post_data["title"],
                        url=post_data["url"],
                        subreddit=post_data["subreddit"],
                        author=post_data["author"],
                        upvotes=post_data["upvotes"],
                        comment_count=post_data["comment_count"],
                        comments=[]
                    )
                    scraped_posts_models.append(post_model)
                    
            # 3. Create ScraperResult and write to JSON
            result = ScraperResult(query=query, posts=scraped_posts_models)
            
            output_path = Path(output_file)
            # Ensure parent directory exists
            output_path.parent.mkdir(parents=True, exist_ok=True)
            
            with open(output_path, "w", encoding="utf-8") as f:
                f.write(result.model_dump_json(indent=4))
                
            logger.info(f"Scraping completed. Results saved to: {output_path.resolve()}")
            
        finally:
            logger.info("Cleaning up browser context...")
            await context.close()
            await browser.close()
            logger.info("Browser closed cleanly.")

def main() -> None:
    parser = argparse.ArgumentParser(description="Headless Reddit scraper using Playwright.")
    parser.add_argument("query", type=str, help="Search query string.")
    parser.add_argument(
        "--posts-limit",
        type=int,
        default=10,
        help="Number of discussion posts to collect (default: 10)."
    )
    parser.add_argument(
        "--comments-limit",
        type=int,
        default=20,
        help="Number of comments to collect per post (default: 20)."
    )
    parser.add_argument(
        "--output",
        type=str,
        default="output.json",
        help="Path to save the JSON output file (default: output.json)."
    )
    parser.add_argument(
        "--headful",
        action="store_true",
        help="Run browser in headful mode (default: headless)."
    )
    
    args = parser.parse_args()
    
    asyncio.run(
        run_scraper(
            query=args.query,
            posts_limit=args.posts_limit,
            comments_limit=args.comments_limit,
            output_file=args.output,
            headless=not args.headful
        )
    )

if __name__ == "__main__":
    main()
