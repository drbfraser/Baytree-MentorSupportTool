import json
import datetime

from django.template import Library
from django.utils.html import format_html

from users.models import MenteeUser, MentorUser, CustomUser


register = Library()

@register.inclusion_tag('tags/pie.html')
def piechart():
    mentee = MenteeUser.objects.all().count()
    mentor = MentorUser.objects.all().count()
    data = [
        {
        'name': 'mentee',
        'value': mentee
        },
        {
            'name': 'mentor',
            'value': mentor
        }
    ]
    return {
        'text': json.dumps(data)
    }


@register.inclusion_tag('tags/pie.html')
def linechart(is_header=False):
    today = datetime.date.today()
    headers = []
    data = []
    for r in range(10):
        headers.append(today-datetime.timedelta(days=r))
    headers = reversed(headers)
    if is_header:
        return {
            'text': [d.strftime('%m-%d') for d in headers]
        }
    
    for d in headers:
        count = CustomUser.objects.filter(date_joined__year=d.year, date_joined__month=d.month, date_joined__day=d.day).count()
        data.append(count)
    return {
        'text': data
    }
