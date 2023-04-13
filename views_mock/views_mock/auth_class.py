from rest_framework_simplejwt.authentication import JWTAuthentication

class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        header = None
        try:
            header = request.META['HTTP_AUTHORIZATION']

        except Exception as e:
          print(e)

        if header is None:
            return None

        validated_token = self.get_validated_token(header)
        return self.get_user(validated_token), validated_token