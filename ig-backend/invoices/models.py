from django.db import models
import uuid
import datetime
from decimal import Decimal 
from django.conf import settings

class Address(models.Model):
    id=models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name=models.CharField(max_length=200)
    phone=models.CharField(max_length=200, blank=True)
    address=models.TextField(blank=True)

    class Meta:
        db_table="addresses"

    def __str__(self):
        return self.name
    
class Invoice(models.Model):
    id=models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user=models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="invoices",
        db_index=True,
    )
    company=models.OneToOneField(
        Address, on_delete=models.PROTECT, related_name="as_company"
    )
    billing= models.OneToOneField(
        Address, on_delete=models.PROTECT, related_name="as_billing"
    )
    shipping= models.OneToOneField(
        Address, on_delete=models.PROTECT, related_name="as_shipping",
        null=True, blank=True,
    )
    number=models.CharField(max_length=100)
    date=models.DateField(default=datetime.date.today)
    due_date=models.DateField(null=True, blank=True)
    title=models.CharField(max_length=255, blank=True)
    template=models.CharField(max_length=100,blank=True)

    tax=models.DecimalField(max_digits=5, decimal_places=2, default=Decimal("0.00"))
    notes=models.TextField(blank=True)
    logo=models.TextField(blank=True)
    thumbnail_url=models.URLField(blank=True)
    account_name=models.CharField(max_length=200, blank=True)
    account_number=models.CharField(max_length=200, blank=True)
    account_ifsc=models.CharField(max_length=200, blank=True)

    created_at      = models.DateTimeField(auto_now_add=True)
    last_updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "invoices"
        ordering = ["-created_at"]
        indexes  = [
            # composite index covers the most common query:
            # "all invoices for this user, newest first"
            models.Index(fields=["user", "-created_at"], name="invoice_user_date_idx"),
        ]
 
    def __str__(self):
        return f"Invoice #{self.number} — {self.user}"
 
    @property
    def subtotal(self):
        # aggregated from related Item rows — no stored value needed
        return sum(item.total for item in self.items.all())
 
    @property
    def total(self):
        tax_rate = Decimal(self.tax) / Decimal("100")
        return self.subtotal + (self.subtotal * tax_rate)
 

class Item(models.Model):
    id=models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    invoice=models.ForeignKey(
        Invoice,
        on_delete=models.CASCADE,
        related_name="items"
    )
    name=models.CharField(max_length=255)
    description=models.TextField(blank=True)
    qty=models.PositiveIntegerField(default=1)
    amount= models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        db_table = "invoice_items"
 
    def __str__(self):
        return f"{self.name} x{self.qty}"
 
    @property
    def total(self):
        return Decimal(self.qty) * self.amount
