from rest_framework_simplejwt.authentication import JWTAuthentication

class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        header = None
        try:
            print("IM GONNA TRY TO GET THE HEADER NOW!")
            header = request.COOKIES.get('access_token')
            print("HEADER??:" + header)
        except:
            pass

        if header is None:
            return None

        validated_token = self.get_validated_token(header)
        print('validated token:', validated_token)

        return self.get_user(validated_token), validated_token