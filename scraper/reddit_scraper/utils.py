import logging
from typing import Any
from playwright.async_api import Browser, BrowserContext, Playwright

logger = logging.getLogger("reddit_scraper.utils")

# Standard Desktop User Agent to avoid anti-scraping blocks
DEFAULT_USER_AGENT = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/122.0.0.0 Safari/537.36"
)

async def create_scraper_context(
    playwright: Playwright,
    headless: bool = True,
    user_agent: str = DEFAULT_USER_AGENT
) -> tuple[Browser, BrowserContext]:
    """
    Launches Chromium and creates a browser context configured to bypass typical anti-bot checks.
    """
    logger.info(f"Launching Chromium (headless={headless})...")
    
    # Launch browser with arguments to disable standard automation flags
    browser = await playwright.chromium.launch(
        headless=headless,
        args=[
            "--disable-blink-features=AutomationControlled",
            "--no-sandbox",
            "--disable-setuid-sandbox",
        ]
    )
    
    # Setup context with desktop viewport, locale, and custom user agent
    context = await browser.new_context(
        user_agent=user_agent,
        viewport={"width": 1280, "height": 800},
        locale="en-US",
        timezone_id="America/New_York",
        device_scale_factor=1,
    )
    
    # Add script to remove navigator.webdriver flag
    await context.add_init_script(
        "const newProto = navigator.__proto__;"
        "delete newProto.webdriver;"
        "navigator.__proto__ = newProto;"
    )
    
    return browser, context

async def scroll_to_bottom(page: Any, max_scrolls: int = 5, delay_ms: int = 1500) -> None:
    """
    Scrolls to the bottom of the page repeatedly to trigger lazy loading of comments or posts.
    """
    logger.info("Scrolling page to trigger lazy loading...")
    previous_height = await page.evaluate("document.body.scrollHeight")
    
    for scroll in range(max_scrolls):
        # Scroll to bottom
        await page.evaluate("window.scrollTo(0, document.body.scrollHeight);")
        await page.wait_for_timeout(delay_ms)
        
        # Check if height changed
        new_height = await page.evaluate("document.body.scrollHeight")
        if new_height == previous_height:
            logger.debug(f"Reached bottom of the page after {scroll + 1} scrolls.")
            break
        previous_height = new_height
