from decimal import Decimal
from django.db import transaction
from rest_framework import serializers
from .models import Address, Invoice, Item

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model= Address
        fields=["id","name","phone","address"]
        read_only_fields=["id"]


class ItemSerializer(serializers.ModelSerializer):
    total=serializers.DecimalField(
        max_digits=12, decimal_places=2, read_only=True
    ) 
    class Meta:
        model=Item
        fields=["id", "name","description","qty", "amount", "total"]
        read_only_fields=["id","total"]


class InvoiceListSerializer(serializers.ModelSerializer):
    subtotal   = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    total      = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    billed_to  = serializers.CharField(source="billing.name", read_only=True)

    class Meta:
        model  = Invoice
        fields = [
            "id", "title", "number", "date", "due_date",
            "tax", "subtotal", "total",
            "billed_to", "template", "thumbnail_url",
            "created_at", "last_updated_at",
        ]
        read_only_fields = ["id", "created_at", "last_updated_at"]



class InvoiceDetailSerializer(serializers.ModelSerializer):
    company  = AddressSerializer()
    billing  = AddressSerializer()
    shipping = AddressSerializer(required=False, allow_null=True)
    items    = ItemSerializer(many=True) 

    subtotal = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    total    = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model  = Invoice
        fields = [
            "id", "title", "number", "date", "due_date",
            "tax", "subtotal", "total", "notes",
            "logo", "thumbnail_url", "template",
            "account_name", "account_number", "account_ifsc",
            "company", "billing", "shipping", "items",
            "created_at", "last_updated_at",
        ]
        read_only_fields = ["id", "created_at", "last_updated_at"]

    def create(self, validated_data):
        company_data  = validated_data.pop("company")
        billing_data  = validated_data.pop("billing")
        shipping_data = validated_data.pop("shipping", None)
        item_data    = validated_data.pop("items")

        with transaction.atomic():
            company=Address.objects.create(**company_data)
            billing=Address.objects.create(**billing_data)
            shipping=Address.objects.create(**shipping_data) if shipping_data else None
            invoice =Invoice.objects.create(
                company=company,
                billing=billing,
                shipping=shipping,
                **validated_data
            )
            Item.objects.bulk_create([
                Item(invoice=invoice, **item_data)
                for item_data in item_data
            ])
        return invoice
    

    def update(self, instance, validated_data):
        company_data  = validated_data.pop("company", None)
        billing_data  = validated_data.pop("billing", None)
        shipping_data = validated_data.pop("shipping", None)
        items_data    = validated_data.pop("items", None)

        with transaction.atomic():
            for attr, value in validated_data.items():
                setattr(instance,attr,value)
            instance.save()

            if company_data:
                Address.objects.filter(id=instance.company.id).update(**company_data)

            if billing_data:
                Address.objects.filter(id=instance.billing.id).update(**billing_data)

            if shipping_data:
                if instance.shipping:
                    Address.objects.filter(id=instance.shipping.id).update(**shipping_data)
                else:
                    instance.shipping = Address.objects.create(**shipping_data)
                    instance.save()

            if items_data is not None:
                instance.items.all().delete()
                Item.objects.bulk_create([
                    Item(invoice=instance, **item_data)
                    for item_data in items_data
                ])

        return instance