import json


def serialize_message(message):
    return json.dumps(message)


def deserialize_message(serialized_message):
    return json.loads(serialized_message)
