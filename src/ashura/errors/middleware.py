# middleware.py
import logging
from django.http import JsonResponse
from errors.custom_error import CustomError

logger = logging.getLogger("ashura_app")


class ErrorHandlingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        return response

    def process_exception(self, request, exception):
        if isinstance(exception, CustomError):
            logger.error(
                msg=f'Error occurred while processing request: {exception}'
            )
            return JsonResponse({'errors': exception.serialize_errors()}, safe=False, status=exception.status_code)
        else:
            logger.error(
                f'Error occurred while processing request: {exception}')
            return JsonResponse([{'message': 'something went wrong.'}], safe=False, status=400)
