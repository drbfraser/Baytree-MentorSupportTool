import os

MOCK_VIEWS = os.environ["MOCK_VIEWS"]
VIEWS_BASE_URL = 'http://mock-views' if MOCK_VIEWS else 'https://app.viewsapp.net/api/restful/'
VIEWS_USERNAME = os.environ["VIEWS_USERNAME"]
VIEWS_PASSWORD = os.environ["VIEWS_PASSWORD"]