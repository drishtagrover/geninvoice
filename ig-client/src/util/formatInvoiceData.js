export const normalizeInvoiceFromApi = (detail) => {
    const d = detail || {};
    return {
        title: d.title,
        company: d.company || {},
        billing: d.billing || {},
        shipping: d.shipping || {},
        invoice: {
            number: d.number || "",
            date: d.date || "",
            dueDate: d.due_date || "",
        },
        account: {
            name: d.account_name || "",
            number: d.account_number || "",
            ifsccode: d.account_ifsc || "",
        },
        tax: d.tax ?? 0,
        notes: d.notes || "",
        items: d.items || [],
        logo: d.logo || "",
        id: d.id,
        template: d.template || "",
    };
};

export const formatInvoiceData=(invoiceData)=>{
    const{
        title,
        company ={},
        invoice={},
        account={},
        billing={},
        shipping={},
        tax=0,
        notes="",
        items=[],
        logo=""
    }= invoiceData || {}

    const currencySymbol= "₹";
    const subtotal = items.reduce((acc, item) => acc + (item.qty * item.amount), 0);
    const taxAmount = subtotal * (tax / 100);
    const total = subtotal + taxAmount;


    return {
        title,
        companyName: company.name,
        companyAddress: company.address,
        companyPhone: company.phone,
        companyLogo: logo,

        invoiceNumber: invoice.number,
        invoiceDate: invoice.date,
        paymentDate: invoice.dueDate,

        accountName: account.name,
        accountNumber: account.number,
        accountIfscCode: account.ifsccode,

        billingName: billing.name,
        billingAddress: billing.address,
        billingPhone: billing.phone,

        shippingName: shipping.name,
        shippingAddress: shipping.address,
        shippingPhone: shipping.phone,

        currencySymbol,
        tax,
        items,
        notes,
        subtotal,
        taxAmount,
        total
    };
};

export const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";

  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}