from django.shortcuts import render

from .models import MentorSession

def index(request):
    sessions = MentorSession.objects.order_by('id')
    context = {'sessions': sessions}
    return render(request, 'sessions/index.html', context)

def detail(request, id):
    session = MentorSession.objects.get(id=id)
    context = {'session': session}
    return render(request, 'session/detail.html', context)
