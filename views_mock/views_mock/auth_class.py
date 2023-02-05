from rest_framework_simplejwt.authentication import JWTAuthentication

class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        print("RUNNING AUTHENTICATION WITHIN VIEWS MOCK!!")
        print(request.COOKIES)
        header = None
        try:
            print("LETS TRY GRABBING THE HEADER INSIDE VIEW MOCKS")
            header = request.COOKIES.get('access_token')
            print("ACCESS_TOKEN INSIDE MOCK VIEWS:", header)

        except Exception as e:
          print(e)
          print("EXTEPTION:", e)

        if header is None:
            return None

        validated_token = self.get_validated_token(header)
        print('VALIDATED TOKEN INSIDE VIEWS MOCK:', validated_token)
        return self.get_user(validated_token), validated_token