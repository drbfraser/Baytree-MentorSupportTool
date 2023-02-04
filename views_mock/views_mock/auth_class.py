from rest_framework_simplejwt.authentication import JWTAuthentication

class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        print("RUNNING AUTHENTICATION!!")
        header = None
        try:
            header = request.COOKIES.get('access_token')
            print('HEADER??: ' + header)

        except:
            pass

        if header is None:
            return None

        validated_token = self.get_validated_token(header)

        return self.get_user(validated_token), validated_token