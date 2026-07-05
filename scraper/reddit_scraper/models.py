from typing import List, Optional, Union
from pydantic import BaseModel, Field

class CommentModel(BaseModel):
    author: Optional[str] = Field(default="[deleted]", description="Username of the comment author")
    text: str = Field(..., description="Cleaned body text of the comment")
    score: Optional[Union[int, str]] = Field(default=None, description="Upvote count or status of the comment")
    depth: int = Field(default=0, description="Nesting depth of the comment (0 for root comments)")
    created: Optional[str] = Field(default=None, description="Timestamp/date string of when the comment was created")

class PostModel(BaseModel):
    title: str = Field(..., description="Title of the Reddit post")
    url: str = Field(..., description="Direct URL to the Reddit post")
    subreddit: str = Field(..., description="Subreddit name (without r/)")
    author: Optional[str] = Field(default=None, description="Username of the post author")
    upvotes: Optional[Union[int, str]] = Field(default=None, description="Upvotes count of the post")
    comment_count: Optional[Union[int, str]] = Field(default=None, description="Total comment count of the post")
    comments: List[CommentModel] = Field(default_factory=list, description="List of comments collected from the post")

class ScraperResult(BaseModel):
    query: str = Field(..., description="Original search query string")
    posts: List[PostModel] = Field(default_factory=list, description="Top posts scraped for the query")
