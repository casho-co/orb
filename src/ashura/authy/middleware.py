import logging
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth.models import User
from django.http import JsonResponse
from rest_framework_simplejwt.exceptions import TokenError

logger = logging.getLogger("ashura_app")

class TokenAuthenticationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        token = request.headers.get('Authorization').split(' ')[1]

        if token:
            try:
                decoded_token = AccessToken(token,verify=True)
                data = decoded_token['data']
                logger.info(data)
                request.user = data
                response = self.get_response(request)
                return response
            except (TokenError, User.DoesNotExist):
                return JsonResponse({'error':'Unauthorized',
                    "message":"Please provide a valid token"}, status=401)
        else:
            return JsonResponse({'error':'Unauthorized',
                "message":"Please provide a valid token"},status=401)
        