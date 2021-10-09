from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse

from .forms import QuestionnaireForm

def index(request):
    return HttpResponse("Hello, world. You're at the questionnaires index.")

def answer(request):
    # if this is a POST request we need to process the form data
    if request.method == 'POST':
        # create a form instance and populate it with data from the request:
        form = QuestionnaireForm(request.POST)
        temp = request.POST['time']
        print(temp)
        # check whether it's valid:
        if form.is_valid():
            # process the data in form.cleaned_data as required
            # ...
            # redirect to a new URL:
            return HttpResponseRedirect(reverse('thanks'))

    # if a GET (or any other method) we'll create a blank form
    else:
        form = QuestionnaireForm()

    return render(request, 'questionnaires/answer.html', {'form': form})

def thanks(request):
    return HttpResponse("Thanks!")
