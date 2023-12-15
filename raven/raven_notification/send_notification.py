import frappe
from pywebpush import webpush, WebPushException
import json


def send_push_notification(user, data):
    subscriptions = frappe.db.get_list('Raven Push Subscription', filters=[
        ['user', '=', user]], fields=['subscription_info'])
    print('subscriptions', subscriptions)
    data = json.dumps(data)
    vapid = frappe.get_doc('Raven VAPID')
    vapid_private_key = vapid.get_password('private_key')
    vapid_claims = {"sub": vapid.subject}

    for subscription in subscriptions:
        subscription_info = json.loads(subscription.subscription_info)
        try:
            webpush(
                subscription_info,
                data,
                vapid_private_key,
                vapid_claims
            )
            print("Push notification sent successfully!")
        except WebPushException as ex:
            print("Error in sending push notification", ex)
            return False
    return True
