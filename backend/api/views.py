"""
API Views for the Prompt Generator.

Endpoints:
    POST /api/v1/generate/  — Generate a new prompt template
    POST /api/v1/test/      — Test a prompt with variable values
    POST /api/v1/improve/   — Improve an existing prompt
    GET  /api/v1/history/   — List prompt generation history
    DELETE /api/v1/history/<id>/ — Delete a history entry
"""

import logging

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.generics import ListAPIView, DestroyAPIView

from .models import PromptHistory
from .serializers import (
    GeneratePromptRequestSerializer,
    GeneratePromptResponseSerializer,
    TestPromptRequestSerializer,
    TestPromptResponseSerializer,
    ImprovePromptRequestSerializer,
    PromptHistorySerializer,
)
from .metaprompt import generate_prompt, test_prompt, improve_prompt

logger = logging.getLogger(__name__)


@api_view(["POST"])
def generate_prompt_view(request: Request) -> Response:
    """
    Generate a prompt template for the given task.

    Request body:
        task: str — The task description
        variables: list[str] — Optional variable names

    Response:
        id: int — History record ID
        task: str — The task
        prompt: str — Generated prompt template
        variables: list[str] — Detected variables
    """
    serializer = GeneratePromptRequestSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    task = serializer.validated_data["task"]
    variables = serializer.validated_data.get("variables", [])

    try:
        result = generate_prompt(task=task, variables=variables)

        # Save to history
        history = PromptHistory.objects.create(
            task=task,
            prompt=result["prompt"],
            variables=result["variables"],
            raw_response=result.get("raw_response", ""),
        )

        response_data = {
            "id": history.id,
            "task": task,
            "prompt": result["prompt"],
            "variables": result["variables"],
        }

        response_serializer = GeneratePromptResponseSerializer(data=response_data)
        response_serializer.is_valid(raise_exception=True)

        return Response(response_serializer.data, status=status.HTTP_201_CREATED)

    except RuntimeError as exc:
        logger.error("Prompt generation failed: %s", exc)
        return Response(
            {"error": str(exc), "code": "GENERATION_FAILED"},
            status=status.HTTP_502_BAD_GATEWAY,
        )
    except Exception as exc:
        logger.exception("Unexpected error during prompt generation")
        return Response(
            {"error": "An unexpected error occurred.", "code": "INTERNAL_ERROR"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["POST"])
def test_prompt_view(request: Request) -> Response:
    """
    Test a prompt template by filling in variable values and running it.

    Request body:
        prompt: str — The prompt template
        variable_values: dict — Variable name -> value mapping

    Response:
        output: str — The AI's response
    """
    serializer = TestPromptRequestSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    prompt_template = serializer.validated_data["prompt"]
    variable_values = serializer.validated_data["variable_values"]

    try:
        output = test_prompt(
            prompt_template=prompt_template,
            variable_values=variable_values,
        )

        return Response(
            {"output": output},
            status=status.HTTP_200_OK,
        )

    except RuntimeError as exc:
        logger.error("Prompt testing failed: %s", exc)
        return Response(
            {"error": str(exc), "code": "TEST_FAILED"},
            status=status.HTTP_502_BAD_GATEWAY,
        )
    except Exception as exc:
        logger.exception("Unexpected error during prompt testing")
        return Response(
            {"error": "An unexpected error occurred.", "code": "INTERNAL_ERROR"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["POST"])
def improve_prompt_view(request: Request) -> Response:
    """
    Improve an existing prompt template.

    Request body:
        prompt: str — The existing prompt template
        feedback: str — Optional improvement feedback

    Response:
        id: int — History record ID
        task: str — "Improved prompt"
        prompt: str — The improved prompt
        variables: list[str] — Detected variables
    """
    serializer = ImprovePromptRequestSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    prompt_text = serializer.validated_data["prompt"]
    feedback = serializer.validated_data.get("feedback", "")

    try:
        result = improve_prompt(prompt=prompt_text, feedback=feedback)

        # Save to history
        history = PromptHistory.objects.create(
            task=f"Improved: {prompt_text[:100]}...",
            prompt=result["prompt"],
            variables=result["variables"],
            is_improved=True,
        )

        return Response(
            {
                "id": history.id,
                "task": history.task,
                "prompt": result["prompt"],
                "variables": result["variables"],
            },
            status=status.HTTP_201_CREATED,
        )

    except RuntimeError as exc:
        logger.error("Prompt improvement failed: %s", exc)
        return Response(
            {"error": str(exc), "code": "IMPROVE_FAILED"},
            status=status.HTTP_502_BAD_GATEWAY,
        )
    except Exception as exc:
        logger.exception("Unexpected error during prompt improvement")
        return Response(
            {"error": "An unexpected error occurred.", "code": "INTERNAL_ERROR"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


class PromptHistoryListView(ListAPIView):
    """List all generated prompts (paginated)."""

    queryset = PromptHistory.objects.all()
    serializer_class = PromptHistorySerializer


class PromptHistoryDeleteView(DestroyAPIView):
    """Delete a prompt history entry."""

    queryset = PromptHistory.objects.all()
    serializer_class = PromptHistorySerializer
