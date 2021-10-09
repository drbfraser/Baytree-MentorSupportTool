from django.http import HttpResponseRedirect
from django.http.response import HttpResponse
from django.shortcuts import render
from django.urls import reverse

from .forms import QuestionnaireForm

def index(request):
    return render(request, 'questionnaires/index.html')

def answer(request):
    if request.method == 'POST':
        form = QuestionnaireForm(request.POST)
        if form.is_valid():
            # process the data in form.cleaned_data as required
            # TODO: send post request to views system
            print(form.cleaned_data['date'])
            print(form.cleaned_data['time'])
            return HttpResponseRedirect(reverse('thanks'))
    else:
        form = QuestionnaireForm()
    return render(request, 'questionnaires/answer.html', {'form': form})

def thanks(request):
    return HttpResponse('Thanks for submitting your questionnaire!')
