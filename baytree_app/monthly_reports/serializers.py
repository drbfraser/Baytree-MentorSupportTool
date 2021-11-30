from rest_framework import serializers
from .models import MonthlyReport
from questions_and_answers.models import QuestionAndAnswer
from questions_and_answers.serializers import QuestionAndAnswerSerializer


class MonthlyReportSerializer(serializers.ModelSerializer):
    questions_and_answers = QuestionAndAnswerSerializer(many=True)

    class Meta:
        model = MonthlyReport
        fields = ['id', 'created_at', 'updated_at', 'mentor', 'mentee', 'questions_and_answers']

    def create(self, validated_data):
        questions_and_answers_data = validated_data.pop('questions_and_answers')
        monthly_report = MonthlyReport.objects.create(**validated_data)
        for question_and_answer_data in questions_and_answers_data:
            QuestionAndAnswer.objects.create(monthly_report=monthly_report, **question_and_answer_data)
        return monthly_report


