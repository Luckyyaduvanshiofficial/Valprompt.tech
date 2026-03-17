"""
Gemini API client wrapper.

Uses the new google.genai SDK (replacement for deprecated google.generativeai).
"""

from google import genai
from google.genai import types
from django.conf import settings


def _get_client() -> genai.Client:
    """Return a configured Gemini client."""
    return genai.Client(api_key=settings.GEMINI_API_KEY)


def call_gemini(
    prompt: str,
    temperature: float = 0.0,
    max_tokens: int = 8192,
    system_instruction: str | None = None,
) -> str:
    """
    Send a prompt to Gemini and return the text response.

    Args:
        prompt: The user message to send.
        temperature: Sampling temperature (0 = deterministic).
        max_tokens: Maximum output tokens.
        system_instruction: Optional system-level instruction.

    Returns:
        The model's text response.

    Raises:
        RuntimeError: If the API call fails.
    """
    try:
        client = _get_client()

        config = types.GenerateContentConfig(
            temperature=temperature,
            max_output_tokens=max_tokens,
        )

        if system_instruction:
            config.system_instruction = system_instruction

        response = client.models.generate_content(
            model=settings.GEMINI_MODEL,
            contents=prompt,
            config=config,
        )

        return response.text

    except Exception as exc:
        raise RuntimeError(f"Gemini API call failed: {exc}") from exc
