import environ
# Initialise environment variables
env = environ.Env()
environ.Env.read_env()

VIEWS_BASE_URL = 'https://app.viewsapp.net/api/restful/'
VIEWS_USERNAME = env("VIEWS_USERNAME")
VIEWS_PASSWORD = env("VIEWS_PASSWORD")