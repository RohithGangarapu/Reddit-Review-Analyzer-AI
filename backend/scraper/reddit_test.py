import os
import json
import requests
from bs4 import BeautifulSoup
import feedparser

# Standard custom User-Agent as required by Reddit API guidelines to avoid 403 blocks
HEADERS = {
    "User-Agent": "python:reddit-review-analyzer-test:v1.0.0 (by /u/developer)",
    "Accept": "application/json, text/html, application/xhtml+xml, application/xml"
}

def print_result(name, count, sample):
    print(f"{name}")
    print(f"✓ Retrieved: {count} posts")
    if sample:
        body = str(sample.get('body') or sample.get('summary') or 'N/A')
        print(f"Sample Post:\n  Title: {sample.get('title')}\n  Author: {sample.get('author', 'N/A')}\n  URL: {sample.get('url', sample.get('link'))}\n  Body: {body[:100]}...\n")
    else:
        print("Sample Post: None\n")

def save_raw_response(filename, content):
    """Helper to save raw HTTP response content to a file."""
    mode = "wb" if isinstance(content, bytes) else "w"
    encoding = None if isinstance(content, bytes) else "utf-8"
    with open(filename, mode, encoding=encoding) as f:
        f.write(content)
    print(f"  [Saved raw response to {filename}]")

def rss_test():
    try:
        # Fetch RSS feed using requests to pass the User-Agent
        response = requests.get("https://www.reddit.com/r/python.rss", headers=HEADERS, timeout=10)
        save_raw_response("rss.xml", response.content)
        response.raise_for_status()
        
        feed = feedparser.parse(response.content)
        posts = []
        for entry in feed.entries:
            posts.append({
                "title": entry.title,
                "link": entry.link,
                "summary": entry.description
            })
            
        print_result("RSS", len(posts), posts[0] if posts else None)
        return len(posts) > 0
    except Exception as e:
        print(f"RSS\n✗ Failed: {e}\n")
        return False

def json_test():
    try:
        response = requests.get("https://www.reddit.com/r/python.json?limit=5", headers=HEADERS, timeout=10)
        save_raw_response("json.json", response.text)
        response.raise_for_status()
        
        data = response.json()
        posts = []
        for child in data.get("data", {}).get("children", []):
            d = child["data"]
            posts.append({
                "title": d.get("title"),
                "body": d.get("selftext"),
                "author": d.get("author"),
                "score": d.get("score"),
                "url": f"https://www.reddit.com{d.get('permalink')}",
                "subreddit": d.get("subreddit")
            })
            
        print_result("JSON", len(posts), posts[0] if posts else None)
        return len(posts) > 0
    except Exception as e:
        print(f"JSON\n✗ Failed: {e}\n")
        return False

def search_test():
    try:
        # Using old.reddit.com as the modern www.reddit.com is obfuscated and heavily blocks raw HTML scraping
        response = requests.get("https://old.reddit.com/r/python/search?q=tutorial&restrict_sr=on", headers=HEADERS, timeout=10)
        save_raw_response("search.html", response.text)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, "html.parser")
        posts = []
        
        # Old reddit search results have div class="search-result"
        for post in soup.find_all("div", class_="search-result"):
            title_a = post.find("a", class_="search-title")
            author_a = post.find("a", class_="author")
            
            if not title_a:
                continue
                
            posts.append({
                "title": title_a.text.strip(),
                "url": title_a["href"],
                "author": author_a.text.strip() if author_a else "N/A",
                "body": "N/A" # Search results don't expose body text well
            })
            
        print_result("SEARCH HTML (old.reddit.com)", len(posts), posts[0] if posts else None)
        return len(posts) > 0
    except Exception as e:
        print(f"SEARCH HTML\n✗ Failed: {e}\n")
        return False

def browser_test():
    try:
        # Fetching the main subreddit feed
        response = requests.get("https://old.reddit.com/r/python/", headers=HEADERS, timeout=10)
        save_raw_response("browser.html", response.text)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, "html.parser")
        posts = []
        
        # Old reddit normal feed uses div class="thing"
        for post in soup.find_all("div", class_="thing"):
            title_a = post.find("a", class_="title")
            author_a = post.find("a", class_="author")
            
            if not title_a:
                continue
                
            href = title_a.get("href", "")
            if href.startswith("/r/"):
                href = f"https://old.reddit.com{href}"
                
            posts.append({
                "title": title_a.text.strip(),
                "url": href,
                "author": author_a.text.strip() if author_a else "N/A",
                "body": "N/A"
            })
            
        print_result("BROWSER HTML (old.reddit.com)", len(posts), posts[0] if posts else None)
        return len(posts) > 0
    except Exception as e:
        print(f"BROWSER HTML\n✗ Failed: {e}\n")
        return False

def mirror_test():
    try:
        # PullPush is a popular working alternative to Pushshift
        response = requests.get("https://api.pullpush.io/reddit/search/submission/?subreddit=python&size=5", timeout=15)
        save_raw_response("mirror.json", response.text)
        response.raise_for_status()
        
        data = response.json()
        posts = []
        
        for d in data.get("data", []):
            posts.append({
                "title": d.get("title"),
                "body": d.get("selftext"),
                "author": d.get("author"),
                "score": d.get("score"),
                "url": d.get("full_link") or d.get("url"),
                "subreddit": d.get("subreddit")
            })
            
        print_result("MIRROR JSON (PullPush API)", len(posts), posts[0] if posts else None)
        return len(posts) > 0
    except Exception as e:
        print(f"MIRROR JSON\n✗ Failed: {e}\n")
        return False

def main():
    print("================================")
    print("LIVE REDDIT RETRIEVAL TEST")
    print("================================\n")
    
    rss_res = rss_test()
    json_res = json_test()
    search_res = search_test()
    browser_res = browser_test()
    mirror_res = mirror_test()
    
    print("================================")
    print("SUMMARY")
    print("================================")
    print(f"RSS            : {'SUCCESS' if rss_res else 'FAILED'}")
    print(f"JSON           : {'SUCCESS' if json_res else 'FAILED'}")
    print(f"SEARCH         : {'SUCCESS' if search_res else 'FAILED'}")
    print(f"BROWSER        : {'SUCCESS' if browser_res else 'FAILED'}")
    print(f"MIRROR         : {'SUCCESS' if mirror_res else 'FAILED'}")
    print("================================\n")

if __name__ == "__main__":
    main()
