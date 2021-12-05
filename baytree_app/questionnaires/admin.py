from django.contrib import admin
from .models import Questionnaire
from questions_and_answers.models import QuestionAndAnswer


class QuestionInline(admin.StackedInline):
    model = QuestionAndAnswer
    extra = 1


class QuestionnaireAdmin(admin.ModelAdmin):
    inlines = [QuestionInline]


admin.site.register(Questionnaire, QuestionnaireAdmin)
