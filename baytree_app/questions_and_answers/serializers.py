from rest_framework import serializers
from .models import QuestionAndAnswer


class QuestionAndAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionAndAnswer
        fields = ['id', 'question', 'answer']

    def create(self, validated_data):
        return QuestionAndAnswer.objects.create(
            id=validated_data.get('id'),
            question=validated_data.get('question'),
            response=validated_data.get('answer')
        )