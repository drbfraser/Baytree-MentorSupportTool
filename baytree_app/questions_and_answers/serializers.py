from rest_framework import serializers
from .models import QuestionAndAnswer


class QuestionAndAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionAndAnswer
        fields = ['id', 'questionnaire', 'question', 'answer']

    def create(self, validated_data):
        return QuestionAndAnswer.objects.create(
            id=validated_data.get('id'),
            questionnaire=validated_data.get('questionnaire'),
            question=validated_data.get('question'),
            answer=validated_data.get('answer')
        )