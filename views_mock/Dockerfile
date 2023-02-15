FROM python:3.9.1-buster
ENV PYTHONUNBUFFERED=1
WORKDIR /code

# # Install dependencies
COPY /views_mock/requirements.txt .
RUN pip install -r requirements.txt

# Build and install shared-apps
COPY /shared-apps .
RUN python setup.py sdist && python -m pip install --user ./dist/shared-apps-0.1.tar.gz

COPY ./views_mock .