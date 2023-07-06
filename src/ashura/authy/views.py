import json
import logging
import time
from django.http import JsonResponse
from .middleware import TokenAuthenticationMiddleware
from django.utils.decorators import method_decorator
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.views import APIView

logger = logging.getLogger('ashura_app')

class CreateToken(APIView):
    def post(self, request):
        data = {"test":"test"}
        token = RefreshToken() 
        token['data'] = data  
        access = str(token.access_token)
        refresh = str(token)
        return JsonResponse({'access':access,'refresh':refresh})

@method_decorator(TokenAuthenticationMiddleware , name='dispatch')        
class TokenTest(APIView):
    def post(self,request):
        logger.info(request.user)
        return JsonResponse({'message':'Token Verified'})
    
class TokenRefresh(TokenRefreshView):
    def post(self,request):
        time.sleep(5)
        return super().post(request)