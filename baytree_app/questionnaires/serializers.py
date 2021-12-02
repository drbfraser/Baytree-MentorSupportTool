from rest_framework import serializers
from .models import Questionnaire
from questions_and_answers.models import QuestionAndAnswer
from questions_and_answers.serializers import QuestionAndAnswerSerializer


class QuestionnaireSerializer(serializers.ModelSerializer):
    questions_and_answers = QuestionAndAnswerSerializer(many=True)

    class Meta:
        model = Questionnaire
        fields = ['id', 'created_at', 'updated_at', 'mentor', 'mentee', 'questions_and_answers']

    def create(self, validated_data):
        questions_and_answers_data = validated_data.pop('questions_and_answers')
        questionnaire = Questionnaire.objects.create(**validated_data)
        for question_and_answer_data in questions_and_answers_data:
            QuestionAndAnswer.objects.create(questionnaire=questionnaire, **question_and_answer_data)
        return questionnaire


