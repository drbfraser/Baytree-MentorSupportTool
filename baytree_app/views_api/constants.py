import os

views_base_url = 'https://app.viewsapp.net/api/restful/'
views_username = os.environ["VIEWS_USERNAME"]
views_password = os.environ["VIEWS_PASSWORD"]

sessions_base_url = views_base_url + "work/sessiongroups/sessions"
sessions_base_url_by_group = views_base_url + "work/sessiongroups/{}/sessions"
volunteers_base_url = views_base_url + "contacts/volunteers/"