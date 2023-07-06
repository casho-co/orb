import logging
from django.conf import settings
from confluent_kafka import Producer
from .serializer import serialize_message

logger = logging.getLogger("ashura_app")


class Singleton(type):
    _instances = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super(
                Singleton, cls).__call__(*args, **kwargs)
        return cls._instances[cls]


class KafkaProducer(metaclass=Singleton):
    def __init__(self):
        self.producer = Producer(
            {'bootstrap.servers': settings.KAFKA_BOOTSTRAP_SERVERS})

    def acked(self, err, msg):
        if err is not None:
            logger.error(
                f'Failed to deliver message: {msg.value()}: {err.str()}')
        else:
            logger.info(f'Message produced: {msg.value()}')

    def send_message(self, topic, message):
        serialized_message = serialize_message(message)

        try:
            self.producer.produce(topic, serialized_message.encode(
                'utf-8'), callback=self.acked)
            self.producer.flush()
        except Exception as e:
            logger.error(f'Error occurred while producing to Kafka: {e}')
