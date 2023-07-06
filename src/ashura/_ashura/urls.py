"""_ashura URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
import logging
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from errors.database_connection_error import DatabaseConnectionError
from health.kafka.producer import KafkaProducer
from health.kafka.topics import TOPIC_HEALTH

logger = logging.getLogger("ashura_app")


def message(request):

    logger.info("Request ID {0}".format(request.headers['X-Request-Id']))
    logger.info("Message view requested.")

    producer = KafkaProducer()
    producer.send_message(TOPIC_HEALTH, {"message": "kafka message"})

    return JsonResponse({"message": "Ashura V1"}, status=200)


def error(request):
    logger.info("Request ID {0}".format(request.headers['X-Request-Id']))
    logger.error("Error view requested.")
    raise DatabaseConnectionError()
    

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/ashura/", message),
    path("api/ashura/error/", error),
    path("health/", include("health.urls")),
    path("auth/", include("authy.urls")),

]
