import re
from typing import Optional

def clean_text(text: Optional[str]) -> str:
    """
    Cleans extracted text by trimming whitespace and normalizing spacing.
    """
    if not text:
        return ""
    # Strip whitespace, replace multiple whitespace characters (including newlines) with a single space
    cleaned = re.sub(r"\s+", " ", text)
    return cleaned.strip()

def is_deleted_comment(author: Optional[str], text: Optional[str]) -> bool:
    """
    Determines if a comment is deleted or removed based on the author and text content.
    """
    if not author or not text:
        return True
        
    author_clean = author.strip().lower()
    text_clean = text.strip().lower()
    
    # Common placeholders for deleted/removed comments on Reddit
    deleted_patterns = [
        "[deleted]",
        "[removed]",
        "comment deleted by user",
        "comment removed by moderator",
        "comment removed",
    ]
    
    if author_clean in ["[deleted]", "[removed]"]:
        return True
        
    if text_clean in ["[deleted]", "[removed]"]:
        return True
        
    if any(pat in text_clean for pat in deleted_patterns):
        return True
        
    return False
