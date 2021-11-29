from django.contrib import admin
from .models import MonthlyReport
from questions_and_answers.models import QuestionAndAnswer


class QuestionInline(admin.StackedInline):
    model = QuestionAndAnswer
    extra = 1


class MonthlyReportAdmin(admin.ModelAdmin):
    inlines = [QuestionInline]


admin.site.register(MonthlyReport, MonthlyReportAdmin)
