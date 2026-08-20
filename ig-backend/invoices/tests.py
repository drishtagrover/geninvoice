from decimal import Decimal

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from users.models import User
from .models import Address, Invoice, Item


class InvoiceAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="test@example.com", password="testpass123"
        )
        self.other_user = User.objects.create_user(
            email="other@example.com", password="testpass123"
        )
        self.client.force_authenticate(self.user)

    def _payload(self, **overrides):
        payload = {
            "title": "Test Invoice",
            "number": "INV-1001",
            "date": "2026-08-20",
            "due_date": "2026-09-20",
            "tax": "10.00",
            "notes": "Test notes",
            "logo": "",
            "template": "template1",
            "account_name": "Acme Corp",
            "account_number": "1234567890",
            "account_ifsc": "IFSC0001234",
            "company": {
                "name": "Acme",
                "phone": "123456",
                "address": "1 Main St",
            },
            "billing": {
                "name": "Bill",
                "phone": "111111",
                "address": "2 Bill St",
            },
            "shipping": {
                "name": "Ship",
                "phone": "222222",
                "address": "3 Ship St",
            },
            "items": [
                {
                    "name": "Widget",
                    "description": "A widget",
                    "qty": 2,
                    "amount": "100.00",
                },
                {
                    "name": "Gadget",
                    "description": "A gadget",
                    "qty": 1,
                    "amount": "50.00",
                },
            ],
        }
        payload.update(overrides)
        return payload

    def test_unauthenticated_requests_are_rejected(self):
        self.client.force_authenticate(None)
        url = reverse("invoice-list-create")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        detail_url = reverse(
            "invoice-detail",
            kwargs={"pk": Invoice.objects.create(
                user=self.user,
                company=Address.objects.create(name="c"),
                billing=Address.objects.create(name="b"),
            ).pk},
        )
        for method in (self.client.get, self.client.patch, self.client.delete):
            response = method(detail_url)
            self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_returns_summary_without_items(self):
        self.client.post(reverse("invoice-list-create"), self._payload(), format="json")
        response = self.client.get(reverse("invoice-list-create"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertNotIn("items", response.data[0])
        self.assertIn("id", response.data[0])
        self.assertIn("title", response.data[0])
        self.assertIn("billed_to", response.data[0])

    def test_detail_includes_items_company_and_account_fields(self):
        created = self.client.post(
            reverse("invoice-list-create"), self._payload(), format="json"
        )
        invoice_id = created.data["id"]
        response = self.client.get(
            reverse("invoice-detail", kwargs={"pk": invoice_id})
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data
        self.assertEqual(len(data["items"]), 2)
        self.assertEqual(data["company"]["name"], "Acme")
        self.assertEqual(data["billing"]["name"], "Bill")
        self.assertEqual(data["shipping"]["name"], "Ship")
        self.assertEqual(data["account_name"], "Acme Corp")
        self.assertEqual(data["account_number"], "1234567890")
        self.assertEqual(data["account_ifsc"], "IFSC0001234")
        self.assertEqual(data["number"], "INV-1001")

    def test_create_creates_exactly_one_invoice_with_items(self):
        self.assertEqual(Invoice.objects.count(), 0)
        response = self.client.post(
            reverse("invoice-list-create"), self._payload(), format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Invoice.objects.count(), 1)
        self.assertEqual(Item.objects.count(), 2)
        self.assertEqual(Item.objects.first().invoice.user, self.user)

    def test_patch_updates_existing_invoice_without_creating_new(self):
        created = self.client.post(
            reverse("invoice-list-create"), self._payload(), format="json"
        )
        invoice_id = created.data["id"]
        self.assertEqual(Invoice.objects.count(), 1)

        patch_payload = self._payload(
            title="Updated Title",
            items=[{"name": "Only Item", "qty": 5, "amount": "10.00"}],
        )
        response = self.client.patch(
            reverse("invoice-detail", kwargs={"pk": invoice_id}),
            patch_payload,
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Invoice.objects.count(), 1)
        self.assertEqual(response.data["title"], "Updated Title")
        self.assertEqual(len(response.data["items"]), 1)
        self.assertEqual(Item.objects.filter(invoice_id=invoice_id).count(), 1)

    def test_patch_requires_ownership(self):
        created = self.client.post(
            reverse("invoice-list-create"), self._payload(), format="json"
        )
        invoice_id = created.data["id"]
        self.client.force_authenticate(self.other_user)
        response = self.client.patch(
            reverse("invoice-detail", kwargs={"pk": invoice_id}),
            {"title": "Hacked"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_removes_invoice(self):
        created = self.client.post(
            reverse("invoice-list-create"), self._payload(), format="json"
        )
        invoice_id = created.data["id"]
        self.assertEqual(Invoice.objects.count(), 1)
        response = self.client.delete(
            reverse("invoice-detail", kwargs={"pk": invoice_id})
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Invoice.objects.count(), 0)

    def test_list_is_scoped_to_user(self):
        self.client.post(reverse("invoice-list-create"), self._payload(), format="json")
        self.client.force_authenticate(self.other_user)
        response = self.client.get(reverse("invoice-list-create"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)