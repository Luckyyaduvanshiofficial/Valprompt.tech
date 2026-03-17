"""
DRF Serializers for the Prompt Generator API.
"""

from rest_framework import serializers

from .models import PromptHistory


# ---------------------------------------------------------------------------
# Request Serializers
# ---------------------------------------------------------------------------

class GeneratePromptRequestSerializer(serializers.Serializer):
    """Validates the request body for prompt generation."""

    task = serializers.CharField(
        required=True,
        help_text="Description of the task to generate a prompt for.",
    )
    variables = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        default=list,
        help_text="Optional list of variable names to include (e.g. ['DOCUMENT', 'QUESTION']).",
    )


class TestPromptRequestSerializer(serializers.Serializer):
    """Validates the request body for testing a prompt."""

    prompt = serializers.CharField(
        required=True,
        help_text="The prompt template with {$VARIABLE} placeholders.",
    )
    variable_values = serializers.DictField(
        child=serializers.CharField(),
        required=True,
        help_text="Mapping of variable names to their values.",
    )


class ImprovePromptRequestSerializer(serializers.Serializer):
    """Validates the request body for prompt improvement."""

    prompt = serializers.CharField(
        required=True,
        help_text="The existing prompt template to improve.",
    )
    feedback = serializers.CharField(
        required=False,
        default="",
        help_text="Optional feedback about what needs improvement.",
    )


# ---------------------------------------------------------------------------
# Response / Model Serializers
# ---------------------------------------------------------------------------

class PromptHistorySerializer(serializers.ModelSerializer):
    """Serializer for PromptHistory model."""

    class Meta:
        model = PromptHistory
        fields = [
            "id",
            "task",
            "prompt",
            "variables",
            "is_improved",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields


class GeneratePromptResponseSerializer(serializers.Serializer):
    """Response serializer for prompt generation."""

    id = serializers.IntegerField()
    task = serializers.CharField()
    prompt = serializers.CharField()
    variables = serializers.ListField(child=serializers.CharField())


class TestPromptResponseSerializer(serializers.Serializer):
    """Response serializer for prompt testing."""

    output = serializers.CharField()
