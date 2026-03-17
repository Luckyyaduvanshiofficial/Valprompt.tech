"""
Models for the Prompt Generator API.
"""

from django.db import models


class PromptHistory(models.Model):
    """Stores generated prompt templates for history/reuse."""

    task = models.TextField(
        help_text="The original task description provided by the user."
    )
    prompt = models.TextField(
        help_text="The generated prompt template."
    )
    variables = models.JSONField(
        default=list,
        help_text="List of variable names extracted from the prompt.",
    )
    raw_response = models.TextField(
        blank=True,
        default="",
        help_text="Raw metaprompt response (for debugging).",
    )
    is_improved = models.BooleanField(
        default=False,
        help_text="Whether this prompt was improved from an existing one.",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name_plural = "Prompt Histories"

    def __str__(self) -> str:
        return f"[{self.created_at:%Y-%m-%d %H:%M}] {self.task[:60]}..."
