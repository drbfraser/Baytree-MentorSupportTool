import os

views_base_url = 'http://localhost:5001/' if os.environ["MOCK_VIEWS"] == True else 'https://app.viewsapp.net/api/restful/'
views_username = os.environ["VIEWS_USERNAME"]
views_password = os.environ["VIEWS_PASSWORD"]
