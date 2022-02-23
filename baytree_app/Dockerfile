FROM python:3
ENV PYTHONUNBUFFERED 1
WORKDIR /app/baytree_app
COPY requirements.txt ./
ENV DJANGO_SETTINGS_MODULE=baytree_app.production_settings
RUN pip install -r requirements.txt
COPY . ./
EXPOSE 8000