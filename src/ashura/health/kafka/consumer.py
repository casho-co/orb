import logging
from django.conf import settings
from confluent_kafka import Consumer
from .serializer import deserialize_message
from .topics import TOPIC_HEALTH

logger = logging.getLogger("ashura_consumer")


class KafkaConsumer:

    def __init__(self):
        self.consumer = Consumer({
            'bootstrap.servers': settings.KAFKA_BOOTSTRAP_SERVERS,
            'group.id': 'health_consumer_group',
            'auto.offset.reset': 'earliest'
        })
        self.consumer.subscribe([TOPIC_HEALTH])

    def process_messages(self):
        while True:
            message = self.consumer.poll(1.0)
            if message is None:
                continue
            if message.error():
                logger.error(
                    f'Error occurred while consuming from Kafka: {message.error().str()}')
                continue

            deserialized_message = deserialize_message(
                message.value().decode('utf-8'))

            logger.info(f'Received message: {deserialized_message}')
            # Process the message as needed

    def close(self):
        self.consumer.close()
