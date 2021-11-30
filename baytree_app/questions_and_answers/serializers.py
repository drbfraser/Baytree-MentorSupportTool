from rest_framework import serializers
from .models import QuestionAndAnswer


class QuestionAndAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionAndAnswer
        fields = ['id', 'monthly_report', 'question', 'answer']

    def create(self, validated_data):
        return QuestionAndAnswer.objects.create(
            id=validated_data.get('id'),
            monthly_report=validated_data.get('monthly_report'),
            question=validated_data.get('question'),
            answer=validated_data.get('answer')
        )