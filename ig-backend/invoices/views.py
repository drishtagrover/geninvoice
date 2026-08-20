from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.conf import settings
from django.core.mail import EmailMessage
from django.shortcuts import get_object_or_404

from .models import Invoice
from .serializers import InvoiceListSerializer, InvoiceDetailSerializer


class InvoiceListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        invoices = Invoice.objects.filter(
            user=request.user
        ).select_related(
            "billing"       
        )
        serializer = InvoiceListSerializer(invoices, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = InvoiceDetailSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user) 
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class InvoiceDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk, user):
        return get_object_or_404(Invoice, pk=pk, user=user)

    def get(self, request, pk):
        invoice = self.get_object(pk, request.user)
        serializer = InvoiceDetailSerializer(invoice)
        return Response(serializer.data)

    def patch(self, request, pk):
        invoice = self.get_object(pk, request.user)
        serializer = InvoiceDetailSerializer(invoice, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        invoice = self.get_object(pk, request.user)
        invoice.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class SendInvoiceView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        email     = request.data.get("email")
        pdf_file  = request.FILES.get("file")

        if not email or not pdf_file:
            return Response(
                {"error": "Both 'email' and 'file' fields are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        subject = "Your Invoice"
        body    = f"Please find your invoice attached.\n\nRegards,\n{request.user.full_name}"

        msg = EmailMessage(subject, body, settings.DEFAULT_FROM_EMAIL, [email])
        msg.attach(pdf_file.name, pdf_file.read(), pdf_file.content_type)
        msg.send()

        return Response({"message": "Email sent successfully"}, status=status.HTTP_200_OK)