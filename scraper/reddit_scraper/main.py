import argparse
import asyncio
import logging
import sys
from pathlib import Path
from models import ScraperResult, PostModel, CommentModel
from search_rss import search_reddit_rss
from comments_rss import expand_and_extract_comments_rss

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
    output_file: str
) -> None:
    logger.info(f"Starting Reddit RSS scraper for query: '{query}'")
    
    try:
        logger.info("Executing Reddit search via RSS API...")
        posts_metadata = await search_reddit_rss(query, limit=posts_limit)
        
        if not posts_metadata:
            logger.warning("No search results found. Exiting.")
            return _write_empty_result(query, output_file)
            
        scraped_posts_models = []
        for idx, post_data in enumerate(posts_metadata):
            post_url = post_data["url"]
            logger.info(f"[{idx+1}/{len(posts_metadata)}] Processing post: '{post_data['title']}' ({post_url})")
            
            try:
                comments_data = await expand_and_extract_comments_rss(post_url, limit=comments_limit)
                comments_models = [CommentModel(**c) for c in comments_data]
                post_model = PostModel(
                    title=post_data["title"], url=post_data["url"], subreddit=post_data["subreddit"],
                    author=post_data["author"], upvotes=post_data["upvotes"], comment_count=len(comments_models),
                    comments=comments_models
                )
                scraped_posts_models.append(post_model)
            except Exception as e:
                logger.error(f"Error scraping post at {post_url}: {e}", exc_info=True)
                post_model = PostModel(
                    title=post_data["title"], url=post_data["url"], subreddit=post_data["subreddit"],
                    author=post_data["author"], upvotes=post_data["upvotes"], comment_count=0,
                    comments=[]
                )
                scraped_posts_models.append(post_model)
                
        _write_final_result(query, scraped_posts_models, output_file)
        
    except Exception as e:
        logger.error(f"Fatal error during RSS scraping: {e}", exc_info=True)

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
    parser = argparse.ArgumentParser(description="Reddit scraper (RSS mode).")
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
    
    args = parser.parse_args()
    
    asyncio.run(
        run_scraper(
            query=args.query,
            posts_limit=args.posts_limit,
            comments_limit=args.comments_limit,
            output_file=args.output
        )
    )

if __name__ == "__main__":
    main()
