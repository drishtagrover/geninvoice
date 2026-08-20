from django.urls import path
from .views import InvoiceListCreateView, InvoiceDetailView, SendInvoiceView

urlpatterns = [
    path("",             InvoiceListCreateView.as_view(), name="invoice-list-create"),
    path("sendinvoice/", SendInvoiceView.as_view(),       name="invoice-send"),
    path("<uuid:pk>/",   InvoiceDetailView.as_view(),     name="invoice-detail"),
]