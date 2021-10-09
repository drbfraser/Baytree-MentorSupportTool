from django.shortcuts import render

from .models import MentorWorkLog


def index(request):
    worklogs = MentorWorkLog.objects.order_by('id')
    context = {'worklogs': worklogs}
    return render(request, 'worklogs/index.html', context)