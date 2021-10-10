from django.shortcuts import render

from .models import MentorWorkLog


def index(request):
    worklogs = MentorWorkLog.objects.order_by('id')
    context = {'worklogs': worklogs}
    return render(request, 'worklogs/index.html', context)


def detail(request, id):
    worklog = MentorWorkLog.objects.get(id=id)
    context = {'worklog': worklog}
    return render(request, 'worklogs/detail.html', context)