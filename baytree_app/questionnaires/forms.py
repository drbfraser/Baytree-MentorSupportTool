from datetime import datetime
from django import forms
from django.forms.widgets import SelectDateWidget

AVAILABLE_YEAR_RANGE = 2
CURRENT_YEAR = datetime.now().year

class QuestionnaireForm(forms.Form):
    date = forms.DateField(
        label='Date', 
        initial=datetime.now(), 
        widget=SelectDateWidget(years=range(CURRENT_YEAR - AVAILABLE_YEAR_RANGE, CURRENT_YEAR + AVAILABLE_YEAR_RANGE)))
    time = forms.TimeField(
        label='Time (Hours:Minutes)',
        input_formats=['%H:%M'])
    mentor = forms.CharField(
        label="Mentor's Name", 
        max_length=100)
    mentee = forms.CharField(
        label="Mentee's Name", 
        max_length=100)
    reporting_month = forms.ChoiceField(
        label='Reporting Month', 
        choices=[(x, x) for x in range(1, 13)])
    mentee_engagement = forms.ChoiceField(
        label='Mentee Engagement', 
        choices=[(x, x) for x in range(1, 6)], required=False)
    mentee_on_time = forms.ChoiceField(
        label='Mentee arrives on time', 
        choices=[(x, x) for x in range(1, 6)])

