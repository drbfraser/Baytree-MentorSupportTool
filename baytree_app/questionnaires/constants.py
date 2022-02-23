import environ
# Initialise environment variables
env = environ.Env()
environ.Env.read_env()

views_base_url = 'https://app.viewsapp.net/api/restful/'
views_username = env("VIEWS_USERNAME")
views_password = env("VIEWS_PASSWORD")